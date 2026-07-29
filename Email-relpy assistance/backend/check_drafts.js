require('dotenv').config()
const supabase = require('./supabase')

async function queryDrafts() {
  try {
    const { data, error } = await supabase
      .from('email_drafts')
      .select('*')
      .eq('original_message_id', '19fa9521ad898a8b')
    
    if (error) throw error
    console.log('Matching Drafts in DB:')
    console.log(JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error querying drafts:', err.message)
  }
}

queryDrafts()
