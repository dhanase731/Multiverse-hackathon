require('dotenv').config()
const supabase = require('./supabase')

async function deleteOrphaned() {
  try {
    const { data, error } = await supabase
      .from('email_drafts')
      .delete()
      .eq('original_message_id', '19fa9521ad898a8b')
    
    if (error) throw error
    console.log('Orphaned draft deleted successfully.')
  } catch (err) {
    console.error('Error deleting draft:', err.message)
  }
}

deleteOrphaned()
