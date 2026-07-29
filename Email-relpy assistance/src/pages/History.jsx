import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, AlertCircle, Clock, TrendingUp, Mail } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { usePolling } from '../hooks/usePolling'
import { getHistory } from '../services/historyService'

const priorityColor = {
  Low:    'text-on-surface-variant bg-surface-container',
  Medium: 'text-tertiary bg-tertiary-fixed',
  High:   'text-error bg-error-container',
  Urgent: 'text-white bg-error font-bold',
}

export default function History() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const fetchFn = useCallback(
    () => getHistory(user?.sub, search, filter),
    [user?.sub, search, filter]
  )
  const { data: history, loading } = usePolling(fetchFn, 10000)

  const sentCount = history.filter(r => r.status === 'sent').length
  const avgConf = sentCount
    ? Math.round(history.filter(r => r.status === 'sent').reduce((a, r) => a + (r.confidence ?? 0), 0) / sentCount * 100)
    : 0

  const displaySelected = selected ?? history[0]

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-white flex-wrap gap-3">
          <div>
            <h1 className="text-on-surface font-bold text-xl">History</h1>
            <p className="text-on-surface-variant text-xs">{history.length} completed automations</p>
          </div>
          <div className="hidden lg:flex gap-3">
            {[
              { icon: Mail, label: 'Total', value: history.length, color: 'text-primary', bg: 'bg-primary/10' },
              { icon: CheckCircle, label: 'Auto-Sent', value: sentCount, color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: TrendingUp, label: 'Avg Confidence', value: `${avgConf}%`, color: 'text-tertiary', bg: 'bg-tertiary/10' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>
                  <s.icon size={15} className={s.color} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{s.value}</p>
                  <p className="text-on-surface-variant text-[10px]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* List */}
          <div className="w-80 border-r border-outline-variant flex flex-col bg-white">
            <div className="p-3 border-b border-outline-variant space-y-2">
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                <Search size={13} className="text-on-surface-variant" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search history..."
                  className="bg-transparent text-on-surface text-xs outline-none flex-1 placeholder-on-surface-variant/50"
                />
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant rounded-lg p-1">
                {['all', 'sent', 'review'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize cursor-pointer border-none ${
                      filter === f ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'sent' ? 'Sent' : 'Review'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-surface-container rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px]">history</span>
                  <p className="text-xs">No history yet</p>
                </div>
              ) : (
                history.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`p-4 border-b border-outline-variant cursor-pointer transition-colors ${
                      displaySelected?.id === r.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-on-surface text-xs font-bold truncate max-w-[150px]">{r.from}</span>
                      <span className="text-on-surface-variant text-[10px] flex-shrink-0">{r.sentAt}</span>
                    </div>
                    <p className="text-on-surface text-xs font-medium mb-1 truncate">{r.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor[r.priority] ?? 'text-on-surface-variant bg-surface-container'}`}>
                        {r.priority ?? 'Normal'}
                      </span>
                      {r.status === 'sent' ? (
                        <span className="flex items-center gap-1 text-secondary text-xs"><CheckCircle size={11} /> Sent</span>
                      ) : (
                        <span className="flex items-center gap-1 text-error text-xs"><AlertCircle size={11} /> Review</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-y-auto bg-background p-6">
            <AnimatePresence mode="wait">
              {displaySelected && (
                <motion.div
                  key={displaySelected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 max-w-2xl mx-auto"
                >
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                    <h3 className="text-on-surface font-semibold text-base mb-1">{displaySelected.subject}</h3>
                    <p className="text-on-surface-variant text-sm">From: {displaySelected.from}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {[
                        { label: 'Status', value: displaySelected.status },
                        { label: 'Sent At', value: displaySelected.sentAt },
                        { label: 'Duration', value: displaySelected.duration ?? '-' },
                      ].map(item => (
                        <div key={item.label} className="bg-surface-container-low rounded-lg p-2.5">
                          <p className="text-on-surface-variant text-[10px] mb-0.5">{item.label}</p>
                          <p className="text-on-surface text-xs font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {displaySelected.confidence != null && (
                    <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-on-surface-variant text-xs font-medium">AI Confidence</span>
                        <span className={`text-xs font-bold ${displaySelected.confidence > 0.7 ? 'text-secondary' : 'text-error'}`}>
                          {Math.round(displaySelected.confidence * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${displaySelected.confidence * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={`h-full rounded-full ${displaySelected.confidence > 0.7 ? 'bg-secondary' : 'bg-error'}`}
                        />
                      </div>
                    </div>
                  )}

                  {displaySelected.originalEmail && (
                    <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={13} className="text-on-surface-variant" />
                        <span className="text-xs font-semibold text-on-surface-variant">Original Email</span>
                      </div>
                      <pre className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                        {displaySelected.originalEmail}
                      </pre>
                    </div>
                  )}

                  {displaySelected.aiReply && (
                    <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                        <span className="text-xs font-semibold text-primary">AI Generated Reply</span>
                        <div className="ml-auto flex items-center gap-1 text-on-surface-variant">
                          <Clock size={11} />
                          <span className="text-xs">{displaySelected.duration}</span>
                        </div>
                      </div>
                      <pre className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                        {displaySelected.aiReply}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}
