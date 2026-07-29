const router = require('express').Router()
const supabase = require('../supabase')

// POST /api/auth/sync — called by AuthContext after Google sign-in
router.post('/sync', async (req, res) => {
  const { userId, email, name, picture, gmailConnected, syncedAt, accessToken, refreshToken } = req.body
  try {
    // 1. Upsert profile in profiles table
    await supabase.from('profiles').upsert({
      id: userId,
      email,
      name,
      avatar: picture,
      updated_at: new Date().toISOString(),
    })

    // 2. Upsert tokens in gmail_accounts table
    if (accessToken) {
      await supabase.from('gmail_accounts').upsert({
        user_id: userId,
        email,
        access_token: accessToken,
        refresh_token: refreshToken || null,
        connected_at: new Date().toISOString(),
      })
    }

    // 3. Forward to n8n (non-blocking)
    try {
      const { call } = require('../n8n')
      await call('sync_user', { 
        userId, 
        email, 
        name, 
        picture, 
        avatar: picture, 
        gmailConnected, 
        syncedAt, 
        accessToken, 
        refreshToken 
      })
    } catch (n8nErr) {
      console.error('[auth/sync] n8n sync warning:', n8nErr.message)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('[auth/sync] error:', err.message)
    res.status(500).json({ error: 'Sync failed', detail: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { access_token } = req.body
  if (!access_token) return res.status(400).json({ error: 'access_token required' })

  const { data: { user }, error } = await supabase.auth.getUser(access_token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name,
    avatar: user.user_metadata?.avatar_url,
    updated_at: new Date().toISOString(),
  })

  res.json({ user: { id: user.id, email: user.email, name: user.user_metadata?.full_name } })
})

// Get current user profile
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  res.json(profile || { id: user.id, email: user.email })
})

module.exports = router
