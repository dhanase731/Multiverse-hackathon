import { N8N } from '../config'

export async function getProcessing(userId) {
  const res = await fetch(N8N.GET_PROCESSING, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  return res.json()
}
