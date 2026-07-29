import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { getDrafts, approveDraft, rejectDraft, scheduleDraft } from '../services/draftService'

function DraftCard({ draft, onRefresh }) {
  const { user } = useAuth()
  const [actioning, setActioning] = useState(false)

  const handleMouseDown = e => e.currentTarget.classList.add('scale-95')
  const handleMouseUp = e => e.currentTarget.classList.remove('scale-95')
  const handleMouseLeave = e => e.currentTarget.classList.remove('scale-95')

  const parsedName = draft.from_email?.split('<')[0]?.trim() || draft.from_email || 'Unknown Sender'
  const initials = parsedName.substring(0, 2).toUpperCase()

  const handleApprove = async () => {
    setActioning(true)
    try {
      await approveDraft(user.sub, draft.id)
      onRefresh()
    } catch (err) {
      console.error(err)
    } finally {
      setActioning(false)
    }
  }

  const handleReject = async () => {
    setActioning(true)
    try {
      await rejectDraft(user.sub, draft.id)
      onRefresh()
    } catch (err) {
      console.error(err)
    } finally {
      setActioning(false)
    }
  }

  return (
    <div className={`group relative bg-white rounded-[16px] p-6 border border-outline-variant hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col ${actioning ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-headline-md">
            {initials}
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface truncate max-w-[180px]">{parsedName}</h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[180px] block">{draft.subject}</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-label-sm font-bold rounded-full">Pending Review</span>
      </div>

      <div className="bg-surface-container-low p-4 rounded-xl mb-4 flex-1">
        <p className="text-body-md text-on-surface-variant line-clamp-4 leading-relaxed italic">{draft.reply_body}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">history</span> Created {new Date(draft.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
          <button
            onClick={handleApprove}
            onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
            className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DraftsPage() {
  const { user } = useAuth()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPageDrafts = () => {
    if (!user?.sub) return
    setLoading(true)
    getDrafts(user.sub)
      .then(data => {
        setDrafts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setDrafts([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPageDrafts()
  }, [user?.sub])

  return (
    <AppShell searchPlaceholder="Search AI drafts...">
      <div className="flex-1 overflow-y-auto p-[24px]">
        <div className="mb-[24px]">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">AI Drafts Queue</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Review and approve your AI-generated replies before they go out.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[16px] p-6 border border-outline-variant animate-pulse h-48" />
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-sm bg-white rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[48px]">drafts</span>
            <p className="text-body-lg font-semibold">No pending AI drafts to review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {drafts.map(draft => (
              <DraftCard key={draft.id} draft={draft} onRefresh={fetchPageDrafts} />
            ))}
          </div>
        )}

        {/* Decorative Footer Area */}
        <div className="mt-[24px] relative h-64 rounded-[16px] overflow-hidden border border-outline-variant flex items-center justify-center">
          <div className="relative z-10 text-center px-6">
            <span className="material-symbols-outlined text-[48px] text-primary mb-2 block">auto_awesome</span>
            <h4 className="font-headline-md text-headline-md text-on-surface">Stay focused on high-value tasks</h4>
            <p className="text-body-md text-on-surface-variant">Our AI continues to draft responses in the background.</p>
          </div>
        </div>
      </div>

      <footer className="w-full py-[8px] flex flex-col items-center justify-center gap-2 bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex gap-[24px]">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Email Reply Assistance. Powered by Advanced AI.</p>
      </footer>
    </AppShell>
  )
}
