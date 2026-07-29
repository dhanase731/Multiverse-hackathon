import axios from 'axios'

// Uses Vite proxy: /api → http://localhost:3001/api
// Browser never calls n8n directly, so no CORS issues
const api = axios.create({ baseURL: '/api' })

// Auth
export const syncUser = (profile) => api.post('/auth/sync', profile)
export const getMe = () => api.get('/auth/me')

// Emails
export const triggerWorkflow = (userId, email) => api.post('/emails/trigger', { userId, email })
export const getDrafts = (userId) => api.get('/emails/drafts', { params: { userId } })
export const approveDraft = (data) => api.post('/emails/approve', data)
export const rejectDraft = (draftId, userId) => api.post('/emails/reject', { draftId, userId })
export const getHistory = (userId, limit = 20, offset = 0) =>
  api.get('/emails/history', { params: { userId, limit, offset } })
export const getQueue = (userId) => api.get('/emails/queue', { params: { userId } })
export const scheduleDraft = (data) => api.post('/emails/schedule', data)

// Settings
export const getSettings = (userId) => api.get('/settings', { params: { userId } })
export const saveSettings = (data) => api.post('/settings', data)
