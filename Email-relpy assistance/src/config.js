// All calls go through the Node.js backend (/api/...) which proxies to n8n.
// This avoids CORS issues — the browser never calls n8n directly.
const BASE = '/api'

export const N8N = {
  PROCESS_EMAIL:  `${BASE}/emails/trigger`,
  APPROVE_DRAFT:  `${BASE}/emails/approve`,
  REJECT_DRAFT:   `${BASE}/emails/reject`,
  SAVE_SETTINGS:  `${BASE}/settings`,
  SYNC_USER:      `${BASE}/auth/sync`,
  GET_EMAILS:     `${BASE}/emails/inbox`,
  GET_PROCESSING: `${BASE}/emails/queue`,
  GET_HISTORY:    `${BASE}/emails/history`,
  GET_DRAFTS:     `${BASE}/emails/drafts`,
  GET_SETTINGS:   `${BASE}/settings`,
  SCHEDULE_DRAFT: `${BASE}/emails/schedule`,
}

export const GOOGLE_CLIENT_ID = '540133941808-jo1lq2jj1d3fg6hmka4ctfqdlhi2vjp0.apps.googleusercontent.com'

export const POLL_INTERVAL = 4000
