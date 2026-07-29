const router = require('express').Router()
const supabase = require('../supabase')

// n8n calls this webhook after processing each email
// Payload: { userId, messageId, subject, from, snippet, intent, priority, sentiment,
//            safe_to_reply, requires_human_review, reply_subject, reply_body, confidence, reason }
router.post('/email-processed', async (req, res) => {
  const payload = req.body

  const status = payload.requires_human_review ? 'pending' : 'processing'

  const { error } = await supabase.from('email_drafts').insert({
    user_id: payload.userId,
    original_message_id: payload.messageId,
    subject: payload.subject,
    from_email: payload.from,
    snippet: payload.snippet,
    intent: payload.intent,
    priority: payload.priority,
    sentiment: payload.sentiment,
    safe_to_reply: payload.safe_to_reply,
    requires_human_review: payload.requires_human_review,
    reply_subject: payload.reply_subject,
    reply_body: payload.reply_body,
    confidence: payload.confidence,
    reason: payload.reason,
    status,
    created_at: new Date().toISOString(),
  })

  if (error) return res.status(500).json({ error: error.message })

  // Emit real-time update to frontend via Socket.IO
  const io = req.app.get('io')
  if (io) {
    io.to(payload.userId).emit('email:processed', { ...payload, status })
  }

  res.json({ success: true })
})

// n8n calls this after a reply is sent successfully
router.post('/reply-sent', async (req, res) => {
  const { messageId, userId } = req.body

  await supabase
    .from('email_drafts')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('original_message_id', messageId)
    .eq('user_id', userId)

  const io = req.app.get('io')
  if (io) io.to(userId).emit('email:sent', { messageId })

  res.json({ success: true })
})

module.exports = router
