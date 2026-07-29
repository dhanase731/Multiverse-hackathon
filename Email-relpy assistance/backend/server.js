require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth')
const emailRoutes = require('./routes/emails')
const settingsRoutes = require('./routes/settings')
const webhookRoutes = require('./routes/webhooks')

const app = express()
const server = http.createServer(app)

// Socket.IO — real-time updates to frontend
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
  // Frontend joins a room by userId so we can push targeted updates
  socket.on('join', (userId) => {
    socket.join(userId)
  })
  socket.on('disconnect', () => {})
})

app.set('io', io)

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/emails', emailRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/webhooks', webhookRoutes)  // n8n posts here

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))

// Background worker to automatically fetch unread emails and trigger n8n workflows
const supabase = require('./supabase')
const { call } = require('./n8n')

async function runAutoPoll() {
  console.log(`[Scheduler] Starting background poll for all connected users...`)
  try {
    const { data: accounts, error } = await supabase
      .from('gmail_accounts')
      .select('user_id, email')
    
    if (error) {
      console.error('[Scheduler] Error fetching accounts:', error.message)
      return
    }

    if (!accounts || accounts.length === 0) {
      console.log('[Scheduler] No connected Gmail accounts found.')
      return
    }

    for (const account of accounts) {
      console.log(`[Scheduler] Auto-triggering email workflow for: ${account.email}`)
      try {
        await call('trigger_email_workflow', { userId: account.user_id, email: account.email })
      } catch (err) {
        console.error(`[Scheduler] Error triggering workflow for ${account.email}:`, err.message)
      }
    }
  } catch (err) {
    console.error('[Scheduler] Unexpected scheduler error:', err.message)
  }
}

// Run auto-poll every 5 minutes
setInterval(runAutoPoll, 5 * 60 * 1000)
// Also run it once on startup after 10 seconds
setTimeout(runAutoPoll, 10000)

