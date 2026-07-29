import { N8N } from '../config'

export async function getSettings(userId) {
  const res = await fetch(N8N.GET_SETTINGS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  return res.json()
}

export async function saveSettings(userId, settings) {
  const res = await fetch(N8N.SAVE_SETTINGS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...settings }),
  })
  return res.json()
}
