import { N8N } from '../config'

export async function getDrafts(userId) {
  const res = await fetch(N8N.GET_DRAFTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  return res.json()
}

export async function approveDraft(userId, draftId) {
  const res = await fetch(N8N.APPROVE_DRAFT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, draftId }),
  })
  return res.json()
}

export async function rejectDraft(userId, draftId) {
  const res = await fetch(N8N.REJECT_DRAFT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, draftId }),
  })
  return res.json()
}

export async function scheduleDraft(userId, draftId, sendAt) {
  const res = await fetch(N8N.SCHEDULE_DRAFT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, draftId, sendAt }),
  })
  return res.json()
}
