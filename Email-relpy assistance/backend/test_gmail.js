require('dotenv').config()
const axios = require('axios')
const supabase = require('./supabase')

async function testGmail() {
  try {
    const { data: account, error: accountErr } = await supabase
      .from('gmail_accounts')
      .select('*')
      .eq('email', 'dhanaseelan707@gmail.com')
      .single()

    if (accountErr || !account) {
      console.error('Account not found in Supabase:', accountErr?.message)
      return
    }

    console.log('Querying messages list...')
    const messagesRes = await axios.get(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages',
      {
        headers: { Authorization: `Bearer ${account.access_token}` },
        params: { maxResults: 15 }
      }
    )

    const messages = messagesRes.data.messages || []
    console.log(`Found ${messages.length} messages. Detail:`)

    for (const msg of messages) {
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
      const labelIds = detail.labelIds || []

      console.log(`- ID: ${msg.id}`)
      console.log(`  Subject: ${subjectHeader ? subjectHeader.value : '(None)'}`)
      console.log(`  From: ${fromHeader ? fromHeader.value : '(None)'}`)
      console.log(`  Labels: ${labelIds.join(', ')}`)
    }
  } catch (err) {
    console.error('Error during Gmail test:', err.response?.data || err.message)
  }
}

testGmail()
