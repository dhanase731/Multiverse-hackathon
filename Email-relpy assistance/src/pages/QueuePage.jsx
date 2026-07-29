import { useState, useEffect, useCallback } from 'react'
import AppShell from '../components/AppShell'
import PipelineTimeline from '../components/ui/PipelineTimeline'
import { useAuth } from '../context/AuthContext'
import { getDrafts, approveDraft, rejectDraft } from '../services/draftService'

export default function QueuePage() {
  const { user } = useAuth()
  const [queue, setQueue] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(false)

  const fetchQueue = useCallback(() => {
    if (!user?.sub) return
    setLoading(true)
    getDrafts(user.sub)
      .then(data => {
        const queueData = Array.isArray(data) ? data : []
        setQueue(queueData)
        if (queueData.length && !selectedId) {
          setSelectedId(queueData[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setQueue([])
        setLoading(false)
      })
  }, [user?.sub, selectedId])

  useEffect(() => {
    fetchQueue()
  }, [user?.sub])

  const selectedItem = Array.isArray(queue) ? queue.find(item => item.id === selectedId) || queue[0] : null

  const handleApprove = async () => {
    if (!selectedItem || !user?.sub) return
    setActioning(true)
    try {
      await approveDraft(user.sub, selectedItem.id)
      setSelectedId(null)
      fetchQueue()
    } catch (err) {
      console.error(err)
    } finally {
      setActioning(false)
    }
  }

  const handleReject = async () => {
    if (!selectedItem || !user?.sub) return
    setActioning(true)
    try {
      await rejectDraft(user.sub, selectedItem.id)
      setSelectedId(null)
      fetchQueue()
    } catch (err) {
      console.error(err)
    } finally {
      setActioning(false)
    }
  }

  return (
    <AppShell searchPlaceholder="Search automations...">
      <div className="p-md flex gap-gutter h-[calc(100vh-64px)] overflow-hidden">
        {/* Queue List */}
        <div className="flex-1 overflow-y-auto pr-sm">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-headline-md font-headline-md">Live Automation Queue</h2>
            <div className="flex gap-sm">
              <span className="inline-flex items-center gap-xs px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full text-label-md">
                <span className="status-pulse w-2 h-2 bg-secondary rounded-full" />
                {queue.length} Processing
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-sm">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-surface-container rounded-xl animate-pulse" />
              ))}
            </div>
          ) : queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-sm bg-white rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-[48px]">pending_actions</span>
              <p className="text-body-lg font-semibold">No pending emails in the automation queue</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
              {queue.map(item => {
                const isSelected = selectedId === item.id || (!selectedId && queue[0]?.id === item.id)
                const statusSteps = [
                  { icon: 'check_circle', label: 'Reading Email',           done: true,  active: false, fill: true },
                  { icon: 'psychology',   label: 'Generating Reply (Gemini)', done: true,  active: false, fill: true },
                  { icon: 'drafts',       label: 'Saving Draft',            done: true,  active: false, fill: true },
                  { icon: 'airplanemode_active', label: 'Reviewing Reply',  done: false, active: true,  fill: false }
                ]

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`bg-surface-container-lowest rounded-[16px] p-md transition-all shadow-sm relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-2 border-primary ring-2 ring-primary/20'
                        : 'border border-outline-variant hover:border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold">
                          {(item.from_email || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-body-lg font-bold truncate max-w-[150px]">{item.from_email}</h3>
                          <p className="text-label-lg text-on-surface-variant line-clamp-1">{item.subject}</p>
                        </div>
                      </div>
                      <span className="px-sm py-xs rounded-full text-label-md font-bold bg-warning-container text-on-warning-container">PENDING</span>
                    </div>

                    <div className="space-y-sm">
                      {statusSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center relative bg-surface-container-highest text-on-surface-variant`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {step.icon}
                            </span>
                          </div>
                          <span className="text-label-lg">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <aside className="w-[400px] bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-sm flex flex-col overflow-hidden">
          <div className="p-md border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-headline-sm font-headline-sm">Automation Details</h3>
          </div>

          {selectedItem ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-lg">
              {/* Original Email */}
              <div>
                <h4 className="text-label-lg font-bold text-primary uppercase tracking-wider mb-sm">Original Email</h4>
                <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant">
                  <p className="text-body-md text-on-surface leading-relaxed">{selectedItem.snippet}</p>
                  <div className="mt-sm pt-sm border-t border-outline-variant flex justify-between text-label-md text-on-surface-variant">
                    <span>From: {selectedItem.from_email}</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div>
                <h4 className="text-label-lg font-bold text-primary uppercase tracking-wider mb-sm">AI Classification</h4>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                    <p className="text-[10px] text-on-surface-variant uppercase">Intent</p>
                    <p className="text-body-md font-bold text-on-surface">{selectedItem.intent || 'General'}</p>
                  </div>
                  <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                    <p className="text-[10px] text-on-surface-variant uppercase">Priority</p>
                    <p className="text-body-md font-bold text-on-surface">{selectedItem.priority || 'Medium'}</p>
                  </div>
                  <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                    <p className="text-[10px] text-on-surface-variant uppercase">Sentiment</p>
                    <p className="text-body-md font-bold text-on-surface">{selectedItem.sentiment || 'Neutral'}</p>
                  </div>
                  <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                    <p className="text-[10px] text-on-surface-variant uppercase">Confidence</p>
                    <p className="text-body-md font-bold text-on-surface">
                      {selectedItem.confidence ? `${Math.round(selectedItem.confidence * 100)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generated Reply */}
              <div>
                <h4 className="text-label-lg font-bold text-primary uppercase tracking-wider mb-sm">Generated Reply</h4>
                <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant">
                  <p className="text-label-md font-bold text-on-surface mb-xs">Subject: {selectedItem.reply_subject}</p>
                  <pre className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap font-sans bg-white p-sm rounded border">
                    {selectedItem.reply_body}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-md text-on-surface-variant text-center">
              Select an item from the queue to view details.
            </div>
          )}

          {selectedItem && (
            <div className="p-md bg-surface-container-low border-t border-outline-variant flex gap-sm">
              <button
                onClick={handleApprove}
                disabled={actioning}
                className="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-lg hover:opacity-90 transition-all cursor-pointer border-none disabled:opacity-50"
              >
                {actioning ? 'Sending...' : 'Approve & Send'}
              </button>
              <button
                onClick={handleReject}
                disabled={actioning}
                className="px-md py-sm border border-error text-error rounded-lg font-label-lg hover:bg-error/5 transition-all cursor-pointer bg-transparent disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  )
}
