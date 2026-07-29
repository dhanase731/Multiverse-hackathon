import { N8N } from '../config'

export async function syncUser(profile) {
  const res = await fetch(N8N.SYNC_USER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  return res.json()
}
