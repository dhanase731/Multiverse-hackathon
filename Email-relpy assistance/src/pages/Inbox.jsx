import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { usePolling } from '../hooks/usePolling'
import { getEmails, processEmail } from '../services/emailService'

function EmailCard({ email, onProcess }) {
  const [triggering, setTriggering] = useState(false)

  const handleClick = async () => {
    setTriggering(true)
    try {
      await onProcess(email.id)
    } finally {
      setTriggering(false)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl p-5 border transition-all cursor-pointer hover:border-primary hover:shadow-md ${
        !email.read ? 'border-primary/30 shadow-sm' : 'border-outline-variant'
      } ${triggering ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          {!email.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
          <div className="min-w-0">
            <p className={`text-sm truncate ${!email.read ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
              {email.from}
            </p>
            <p className={`text-sm truncate ${!email.read ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}>
              {email.subject}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-on-surface-variant flex-shrink-0">{email.receivedAt}</span>
      </div>
      <p className="text-xs text-on-surface-variant line-clamp-2 ml-5">{email.preview}</p>
      {triggering && (
        <div className="mt-3 flex items-center gap-2 text-primary text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          Sending to AI...
        </div>
      )}
    </div>
  )
}

export default function Inbox() {
  const { user, signIn } = useAuth()
  const { data: emails, loading, error, refresh } = usePolling(() => getEmails(user?.sub))

  const handleProcess = async (emailId) => {
    await processEmail(user.sub, emailId)
    refresh()
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Inbox</h2>
            <p className="text-sm text-on-surface-variant mt-1">Click an email to trigger AI processing</p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 border border-outline-variant animate-pulse">
                <div className="h-4 bg-surface-container-highest rounded w-1/3 mb-2" />
                <div className="h-3 bg-surface-container-highest rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error || !user ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant bg-white rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[48px]">link_off</span>
            <p className="text-base font-medium">{error?.message || 'Connect your Gmail account to view your inbox'}</p>
            <button
              onClick={signIn}
              className="bg-primary text-on-primary px-xl py-sm rounded-full font-label-lg flex items-center gap-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-none"
            >
              <span className="material-symbols-outlined">link</span>
              Connect Gmail
            </button>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant bg-white rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[48px]">inbox</span>
            <p className="text-base font-medium">Your inbox is empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {emails.map(email => (
              <EmailCard key={email.id} email={email} onProcess={handleProcess} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
