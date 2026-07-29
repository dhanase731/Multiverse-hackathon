import { useEffect, useRef } from 'react'
import { getProcessing } from '../services/workflowService'
import { POLL_INTERVAL } from '../config'

// Polls n8n for processing status updates instead of using socket.io
export function useSocket(userId, handlers = {}) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!userId) return

    const poll = async () => {
      try {
        const items = await getProcessing(userId)
        const list = Array.isArray(items) ? items : items?.data ?? []
        const hasProcessing = list.some(i => i.status === 'processing')
        const hasSent = list.some(i => i.status === 'sent')
        if (hasProcessing) handlersRef.current.onEmailProcessed?.(list)
        if (hasSent) handlersRef.current.onEmailSent?.(list)
      } catch (_) {}
    }

    poll()
    const id = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [userId])
}
