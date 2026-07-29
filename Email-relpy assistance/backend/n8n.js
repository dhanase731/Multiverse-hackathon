const axios = require('axios')

// In production: use N8N_WEBHOOK_URL (workflow must be Active in n8n)
// In dev/test: use N8N_WEBHOOK_TEST_URL (click "Execute workflow" in n8n first)
const WEBHOOK_URL = process.env.NODE_ENV === 'production'
  ? process.env.N8N_WEBHOOK_URL
  : (process.env.N8N_WEBHOOK_TEST_URL || process.env.N8N_WEBHOOK_URL)

const call = async (action, data = {}) => {
  console.log(`[n8n] → action: ${action}`, data)
  try {
    return await axios.post(WEBHOOK_URL, { action, ...data }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
  } catch (err) {
    // If the test webhook returned 404 (not listening), try falling back to the production webhook
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.N8N_WEBHOOK_TEST_URL &&
      process.env.N8N_WEBHOOK_URL &&
      WEBHOOK_URL === process.env.N8N_WEBHOOK_TEST_URL &&
      err.response?.status === 404
    ) {
      console.warn(`[n8n] Test webhook returned 404. Retrying with production webhook URL...`)
      return axios.post(process.env.N8N_WEBHOOK_URL, { action, ...data }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      })
    }
    throw err
  }
}

module.exports = { call, WEBHOOK_URL }

