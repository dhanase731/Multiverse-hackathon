require('dotenv').config()
const supabase = require('./supabase')

async function inspect() {
  try {
    const { data, error } = await supabase
      .from('gmail_accounts')
      .select('*')
    
    if (error) throw error
    
    console.log('Connected Gmail Accounts:')
    console.log(JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error querying Supabase:', err.message)
  }
}

inspect()
