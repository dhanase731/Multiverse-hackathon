const router = require('express').Router()
const supabase = require('../supabase')

// GET /api/settings?userId=xxx
router.get('/', async (req, res) => {
  const { userId } = req.query
  if (!userId) return res.status(400).json({ error: 'userId is required' })
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    res.json(data || {})
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings', detail: err.message })
  }
})

// POST /api/settings
router.post('/', async (req, res) => {
  const { userId, tone, language, frequency, autoSchedule, categorization, signature } = req.body
  if (!userId) return res.status(400).json({ error: 'userId is required' })

  // If only userId is passed (and no other settings parameters), treat as a GET request
  if (tone === undefined && language === undefined && frequency === undefined && autoSchedule === undefined && signature === undefined) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return res.json(data || {})
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch settings', detail: err.message })
    }
  }

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        user_id: userId,
        tone: tone || 'Professional',
        language: language || 'English',
        frequency: frequency || 'Instantly',
        auto_schedule: autoSchedule !== undefined ? autoSchedule : false,
        categorization: categorization !== undefined ? categorization : true,
        signature: signature || '',
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings', detail: err.message })
  }
})

module.exports = router

