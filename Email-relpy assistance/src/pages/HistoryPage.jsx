import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import PipelineTimeline from '../components/ui/PipelineTimeline'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../services/historyService'

const FILTERS = ['All', 'Sent', 'Review']

const STATUS_BADGE = {
  delivered: { cls: 'bg-secondary-container text-on-secondary-container', icon: 'check_circle', label: 'Delivered' },
  processing: { cls: 'bg-primary-container text-on-primary-container',   icon: 'sync',         label: 'AI Drafting...' },
  failed:     { cls: 'bg-error-container text-on-error-container',        icon: 'error',        label: 'Failed' },
  review:     { cls: 'bg-warning-container text-on-warning-container',    icon: 'rate_review',   label: 'Review Pending' },
}

const DOT = { delivered: 'bg-secondary', processing: 'bg-primary', failed: 'bg-error', review: 'bg-warning' }

export default function HistoryPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const fetchLogs = () => {
    if (!user?.sub) return
    setLoading(true)
    getHistory(user.sub)
      .then(data => {
        if (!Array.isArray(data)) {
          setLogs([])
          setLoading(false)
          return
        }
        const mapped = data.map(item => {
          const status = item.status === 'sent' ? 'delivered' : item.status === 'failed' ? 'failed' : item.status === 'pending' ? 'review' : 'processing'
          return {
            id: item.id,
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateStr: new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            name: item.from_email || 'Unknown Sender',
            subject: item.subject || 'No Subject',
            status,
            processing: item.confidence ? `${Math.round(item.confidence * 100)}% Confidence` : 'AI Parsed',
            nodes: [
              { icon: 'mail',       label: 'Received' },
              { icon: 'psychology', label: 'Analyzed' },
              { icon: 'edit_note',  label: 'Generated' },
              { icon: 'send',       label: item.status === 'sent' ? 'Sent' : 'Skipped' },
            ],
          }
        })
        setLogs(mapped)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLogs([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchLogs()
  }, [user?.sub])

  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Sent') return log.status === 'delivered'
    if (activeFilter === 'Review') return log.status === 'review'
    return true
  })

  return (
    <AppShell searchPlaceholder="Search across history, subjects, or senders...">
      <div className="p-lg space-y-lg">
        {/* Filter Bar */}
        <section className="flex flex-wrap items-center justify-between gap-md">
          <div>
            <h1 className="text-headline-md font-headline-md text-on-surface">Automation History</h1>
            <p className="text-on-surface-variant text-body-md mt-xs">Observability into every action your AI assistant takes.</p>
          </div>
          <div className="flex items-center gap-sm bg-surface-container-low p-xs rounded-xl border border-outline-variant">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-md py-sm rounded-lg text-label-lg font-label-lg transition-all cursor-pointer border-none ${
                  activeFilter === f
                    ? 'bg-primary-container text-on-primary-container'
                    : 'hover:bg-surface-container-highest text-on-surface-variant bg-transparent'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-6 bg-outline-variant mx-xs" />
            <button 
              onClick={fetchLogs}
              className="flex items-center gap-xs px-md py-sm hover:bg-surface-container-highest text-on-surface-variant rounded-lg text-label-lg font-label-lg transition-all cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Reload
            </button>
          </div>
        </section>

        {/* Log Entries */}
        {loading ? (
          <div className="space-y-md">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-surface-container rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-sm bg-white rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[48px]">history</span>
            <p className="text-body-lg font-semibold">No automation history logs found</p>
          </div>
        ) : (
          <div className="space-y-sm">
            {filteredLogs.map(log => {
              const badge = STATUS_BADGE[log.status] || STATUS_BADGE.processing
              const isProcessing = log.status === 'processing'
              return (
                <div
                  key={log.id}
                  className={`bg-surface-container-lowest rounded-xl p-md border border-outline-variant transition-all hover:shadow-md ${
                    isProcessing ? 'border-2 border-primary shadow-sm' : ''
                  }`}
                >
                  <div className="grid grid-cols-12 gap-md items-start">
                    {/* Left */}
                    <div className="col-span-12 lg:col-span-4 flex gap-md">
                      <div className="flex flex-col items-center gap-xs">
                        <span className={`text-label-lg font-label-lg ${isProcessing ? 'text-primary' : 'text-on-surface-variant'}`}>{log.time}</span>
                        <span className={`w-2 h-2 rounded-full ${DOT[log.status] || 'bg-primary'} ${isProcessing ? 'status-pulse' : ''}`} />
                      </div>
                      <div className="space-y-xs">
                        <h3 className="text-body-lg font-semibold text-on-surface">{log.name}</h3>
                        <p className="text-body-md text-on-surface-variant line-clamp-1">{log.subject}</p>
                        <div className="flex items-center gap-sm mt-md">
                          <span className={`px-sm py-xs rounded-full text-label-md flex items-center gap-xs ${badge.cls}`}>
                            <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                            {badge.label}
                          </span>
                          {log.processing && (
                            <span className="flex items-center gap-xs text-on-surface-variant text-label-md">
                              <span className="material-symbols-outlined text-[14px]">timer</span>
                              {log.processing}
                            </span>
                          )}
                          <span className="text-[10px] text-on-surface-variant">{log.dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pipeline */}
                    <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-md flex flex-col justify-center">
                      <PipelineTimeline
                        nodes={log.nodes}
                        activeIndex={log.status === 'delivered' ? -1 : 1}
                        failedIndex={log.status === 'failed' ? 3 : -1}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
