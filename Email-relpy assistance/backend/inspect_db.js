require('dotenv').config()
const axios = require('axios')

async function run() {
  const url = process.env.SUPABASE_URL + '/rest/v1/'
  const apikey = process.env.SUPABASE_SERVICE_KEY
  try {
    const res = await axios.get(url, {
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`
      }
    })
    const definitions = res.data.definitions
    if (definitions) {
      for (const tableName of Object.keys(definitions)) {
        console.log(`Table: ${tableName}`)
        const props = definitions[tableName].properties
        if (props) {
          console.log('Columns:')
          for (const colName of Object.keys(props)) {
            console.log(`  - ${colName}: ${props[colName].type} (${props[colName].format || ''})`)
          }
        }
      }
    } else {
      console.log('No definitions found in OpenAPI spec.')
    }
  } catch (err) {
    console.error('Error fetching spec:', err.message)
  }
}

run()
