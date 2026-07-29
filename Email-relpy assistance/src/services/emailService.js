import { N8N } from '../config'

export async function getEmails(userId) {
  if (!userId) {
    throw new Error('Connect Gmail')
  }
  const res = await fetch(N8N.GET_EMAILS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.error || 'Failed to fetch emails')
  }
  return res.json()
}

export async function processEmail(userId, emailId) {
  const res = await fetch(N8N.PROCESS_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, emailId }),
  })
  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.error || 'Failed to process email')
  }
  return res.json()
}
