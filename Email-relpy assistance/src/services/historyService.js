import { N8N } from '../config'

export async function getHistory(userId, search = '', filter = 'all') {
  const res = await fetch(N8N.GET_HISTORY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, search, filter }),
  })
  return res.json()
}
