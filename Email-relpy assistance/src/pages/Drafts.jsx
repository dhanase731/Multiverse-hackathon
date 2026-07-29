import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { usePolling } from '../hooks/usePolling'
import { getDrafts, approveDraft, rejectDraft, scheduleDraft } from '../services/draftService'

function DraftCard({ draft, onApprove, onReject, onSchedule }) {
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(draft.aiReply ?? '')
  const [scheduling, setScheduling] = useState(false)
  const [sendAt, setSendAt] = useState('')
  const [busy, setBusy] = useState(false)

  const handle = async (fn) => {
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-outline-variant flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
            {draft.from?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface truncate max-w-[180px]">{draft.from}</p>
            <p className="text-xs text-on-surface-variant truncate max-w-[180px]">{draft.subject}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">Pending Review</span>
      </div>

      <div className="bg-surface-container-low p-4 rounded-xl mb-4 flex-1">
        {editing ? (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            className="w-full bg-transparent text-sm text-on-surface outline-none resize-none"
          />
        ) : (
          <p className="text-sm italic text-on-surface-variant line-clamp-4">{body}</p>
        )}
      </div>

      {scheduling && (
        <div className="mb-3 flex items-center gap-2">
          <input
            type="datetime-local"
            value={sendAt}
            onChange={e => setSendAt(e.target.value)}
            className="flex-1 text-xs border border-outline-variant rounded-lg px-3 py-2 outline-none bg-surface-container-low"
          />
          <button
            onClick={() => handle(() => onSchedule(draft.id, sendAt))}
            disabled={!sendAt || busy}
            className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer border-none disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={() => setScheduling(false)}
            className="px-3 py-2 rounded-lg border border-outline-variant text-xs text-on-surface-variant cursor-pointer bg-transparent"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-[11px] text-on-surface-variant">
          {draft.createdAt}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handle(() => onReject(draft.id))}
            disabled={busy}
            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all cursor-pointer border-none bg-transparent"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
          <button
            onClick={() => setEditing(e => !e)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all cursor-pointer border-none bg-transparent"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => setScheduling(s => !s)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 transition-all cursor-pointer border-none bg-transparent"
            title="Schedule"
          >
            <span className="material-symbols-outlined text-[20px]">schedule_send</span>
          </button>
          <button
            onClick={() => handle(() => onApprove(draft.id))}
            disabled={busy}
            className="px-4 py-2 rounded-full text-xs font-bold tracking-wider bg-primary text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {busy ? '...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Drafts() {
  const { user } = useAuth()
  const { data: drafts, loading, refresh } = usePolling(() => getDrafts(user?.sub))

  const handleApprove = async (draftId) => {
    await approveDraft(user.sub, draftId)
    refresh()
  }

  const handleReject = async (draftId) => {
    await rejectDraft(user.sub, draftId)
    refresh()
  }

  const handleSchedule = async (draftId, sendAt) => {
    await scheduleDraft(user.sub, draftId, sendAt)
    refresh()
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">AI Drafts</h2>
          <p className="text-sm text-on-surface-variant mt-1">Review and approve AI-generated replies before they go out.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-outline-variant animate-pulse h-48" />
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px]">drafts</span>
            <p className="text-base font-medium">No drafts waiting for review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drafts.map(draft => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onApprove={handleApprove}
                onReject={handleReject}
                onSchedule={handleSchedule}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
