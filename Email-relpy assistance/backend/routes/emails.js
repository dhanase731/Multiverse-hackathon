const router = require('express').Router()
const axios = require('axios')
const supabase = require('../supabase')
const { call } = require('../n8n')

// GET/POST /api/emails/inbox
// Fetches real emails from the Google Gmail API using the stored access token
router.route('/inbox')
  .get(async (req, res) => {
    await fetchInbox(req, res)
  })
  .post(async (req, res) => {
    await fetchInbox(req, res)
  })

async function fetchInbox(req, res) {
  const userId = req.query.userId || req.body.userId
  if (!userId) return res.status(400).json({ error: 'userId is required' })

  try {
    // 1. Retrieve access token from Supabase
    const { data: account, error: accountErr } = await supabase
      .from('gmail_accounts')
      .select('access_token')
      .eq('user_id', userId)
      .single()

    if (accountErr || !account || !account.access_token) {
      return res.status(400).json({ error: 'Gmail disconnected', code: 'GMAIL_DISCONNECTED' })
    }

    // 2. Query Google Gmail API for list of messages
    const messagesRes = await axios.get(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages',
      {
        headers: { Authorization: `Bearer ${account.access_token}` },
        params: { maxResults: 15 }
      }
    )

    const messages = messagesRes.data.messages || []
    const detailedEmails = []

    // 3. Retrieve detailed info for each message
    for (const msg of messages) {
      try {
        const detailRes = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: { Authorization: `Bearer ${account.access_token}` }
          }
        )

        const detail = detailRes.data
        const headers = detail.payload.headers || []
        const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')

        const subject = subjectHeader ? subjectHeader.value : '(No Subject)'
        const sender = fromHeader ? fromHeader.value : '(Unknown Sender)'
        const snippet = detail.snippet || ''
        const internalDate = detail.internalDate
        const labelIds = detail.labelIds || []
        const isUnread = labelIds.includes('UNREAD')

        detailedEmails.push({
          id: msg.id,
          threadId: detail.threadId,
          subject,
          from: sender,
          preview: snippet,
          receivedAt: new Date(Number(internalDate)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dateStr: new Date(Number(internalDate)).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          read: !isUnread,
          labels: labelIds
        })
      } catch (err) {
        console.error(`Error fetching message ${msg.id}:`, err.message)
      }
    }

    // 4. Automatically trigger n8n workflow if new unread emails exist
    const unreadEmails = detailedEmails.filter(email => !email.read)
    if (unreadEmails.length > 0) {
      let hasNewUnread = false
      for (const email of unreadEmails) {
        const { data: existing } = await supabase
          .from('email_drafts')
          .select('id')
          .eq('original_message_id', email.id)
          .maybeSingle()
        if (!existing) {
          hasNewUnread = true
          break
        }
      }

      if (hasNewUnread) {
        console.log(`[n8n] → Triggering unified email workflow for user ${userId}`)
        try {
          await call('trigger_email_workflow', { userId })
        } catch (webhookErr) {
          console.error('[n8n] webhook error:', webhookErr.message)
        }
      }
    }

    res.json(detailedEmails)
  } catch (err) {
    console.error('[inbox] error fetching Gmail inbox:', err.message)
    res.status(500).json({ error: 'Failed to fetch Gmail inbox', detail: err.message })
  }
}

// POST /api/emails/trigger
// Triggers the n8n email workflow on demand
router.post('/trigger', async (req, res) => {
  const { userId, email } = req.body
  try {
    const response = await call('trigger_email_workflow', { userId, email })
    res.json({ success: true, data: response.data })
  } catch (err) {
    const status = err.response?.status || 502
    const detail = err.response?.data || err.message
    res.status(status).json({ error: 'n8n trigger failed', detail })
  }
})

// GET/POST /api/emails/drafts
// Returns pending drafts for a user
router.route('/drafts')
  .get(async (req, res) => {
    const userId = req.query.userId || req.body.userId
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch drafts', detail: err.message })
    }
  })
  .post(async (req, res) => {
    const userId = req.body.userId || req.query.userId
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch drafts', detail: err.message })
    }
  })

// POST /api/emails/drafts/:id/approve
// Tells n8n to send the approved reply via Gmail
router.post('/drafts/:id/approve', async (req, res) => {
  const { id } = req.params
  const { userId, replyBody, replySubject, messageId } = req.body
  try {
    const response = await call('approve_draft', { draftId: id, userId, replyBody, replySubject, messageId })
    res.json({ success: true, data: response.data })
  } catch (err) {
    res.status(502).json({ error: 'Failed to approve draft', detail: err.message })
  }
})

// DELETE /api/emails/drafts/:id
// Rejects/discards a draft
router.delete('/drafts/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.query
  try {
    await call('reject_draft', { draftId: id, userId })
    res.json({ success: true })
  } catch (err) {
    res.status(502).json({ error: 'Failed to reject draft', detail: err.message })
  }
})

// GET/POST /api/emails/history
router.route('/history')
  .get(async (req, res) => {
    const userId = req.query.userId || req.body.userId
    const limit = Number(req.query.limit || req.body.limit || 20)
    const offset = Number(req.query.offset || req.body.offset || 0)
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch history', detail: err.message })
    }
  })
  .post(async (req, res) => {
    const userId = req.body.userId || req.query.userId
    const limit = Number(req.body.limit || req.query.limit || 20)
    const offset = Number(req.body.offset || req.query.offset || 0)
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch history', detail: err.message })
    }
  })

// GET/POST /api/emails/queue
router.route('/queue')
  .get(async (req, res) => {
    const userId = req.query.userId || req.body.userId
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'processing')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch queue', detail: err.message })
    }
  })
  .post(async (req, res) => {
    const userId = req.body.userId || req.query.userId
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'processing')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      res.json(data || [])
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch queue', detail: err.message })
    }
  })

// POST /api/emails/approve (shorthand used by config.js)
router.post('/approve', async (req, res) => {
  const { draftId, userId, replyBody, replySubject, messageId } = req.body
  try {
    const response = await call('approve_draft', { draftId, userId, replyBody, replySubject, messageId })
    res.json({ success: true, data: response.data })
  } catch (err) {
    res.status(502).json({ error: 'Failed to approve draft', detail: err.message })
  }
})

// POST /api/emails/reject (shorthand)
router.post('/reject', async (req, res) => {
  const { draftId, userId } = req.body
  try {
    await call('reject_draft', { draftId, userId })
    res.json({ success: true })
  } catch (err) {
    res.status(502).json({ error: 'Failed to reject draft', detail: err.message })
  }
})

// POST /api/emails/schedule
router.post('/schedule', async (req, res) => {
  const { draftId, userId, scheduledAt } = req.body
  try {
    const response = await call('schedule_draft', { draftId, userId, scheduledAt })
    res.json({ success: true, data: response.data })
  } catch (err) {
    res.status(502).json({ error: 'Failed to schedule draft', detail: err.message })
  }
})

module.exports = router
