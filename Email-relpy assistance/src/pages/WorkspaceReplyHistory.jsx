import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Search, ChevronRight, Mail, Clock, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'

const replies = [
  {
    id: 1, from: 'alex@company.com', subject: 'Meeting time confirmation',
    reply: 'Hi Alex,\n\nThank you for reaching out. The meeting is confirmed for 3 PM tomorrow.\n\nKind regards,',
    intent: 'Meeting Inquiry', priority: 'Medium', status: 'sent', confidence: 0.92,
    time: '07:21 AM', date: 'Today', duration: '1.2s',
  },
  {
    id: 2, from: 'sarah@client.io', subject: 'Project update request',
    reply: 'Hi Sarah,\n\nThank you for following up. I will share the Q3 status report by end of day.\n\nKind regards,',
    intent: 'Status Request', priority: 'High', status: 'sent', confidence: 0.87,
    time: '07:21 AM', date: 'Today', duration: '1.8s',
  },
  {
    id: 3, from: 'legal@firm.com', subject: 'Contract review needed',
    reply: null, intent: 'Legal', priority: 'Urgent', status: 'review', confidence: 0.45,
    time: '07:20 AM', date: 'Today', duration: '-',
  },
  {
    id: 4, from: 'newsletter@tech.com', subject: 'Weekly digest',
    reply: 'Thank you for the newsletter. I have noted the updates.\n\nKind regards,',
    intent: 'Newsletter', priority: 'Low', status: 'sent', confidence: 0.96,
    time: '07:20 AM', date: 'Today', duration: '0.9s',
  },
  {
    id: 5, from: 'john@partner.com', subject: 'Partnership proposal',
    reply: 'Hi John,\n\nThank you for the proposal. I will review it and get back to you shortly.\n\nKind regards,',
    intent: 'Business', priority: 'High', status: 'sent', confidence: 0.81,
    time: '06:19 AM', date: 'Yesterday', duration: '2.1s',
  },
  {
    id: 6, from: 'hr@company.com', subject: 'Benefits enrollment',
    reply: null, intent: 'HR', priority: 'Urgent', status: 'review', confidence: 0.38,
    time: '06:19 AM', date: 'Yesterday', duration: '-',
  },
  {
    id: 7, from: 'support@saas.io', subject: 'Your subscription renewal',
    reply: 'Thank you for the reminder. I will review the subscription details.\n\nKind regards,',
    intent: 'Billing', priority: 'Medium', status: 'sent', confidence: 0.89,
    time: '06:19 AM', date: 'Yesterday', duration: '1.4s',
  },
]

const priorityColor = {
  Low: 'text-on-surface-variant bg-surface-container',
  Medium: 'text-tertiary-container bg-tertiary-fixed',
  High: 'text-error bg-error-container',
  Urgent: 'text-white bg-error font-bold',
}

export default function WorkspaceReplyHistory() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(replies[0])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = replies.filter(r => {
    if (filter === 'sent' && r.status !== 'sent') return false
    if (filter === 'review' && r.status !== 'review') return false
    if (search && !r.subject.toLowerCase().includes(search.toLowerCase()) && !r.from.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sentCount = replies.filter(r => r.status === 'sent').length
  const avgConfidence = Math.round(replies.filter(r => r.status === 'sent').reduce((a, r) => a + r.confidence, 0) / sentCount * 100)

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/workspace')} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-on-surface font-bold text-headline-sm">Reply History</h1>
              <p className="text-on-surface-variant text-xs">{replies.length} total replies</p>
            </div>
          </div>

          {/* Stats inline */}
          <div className="hidden lg:flex gap-3">
            {[
              { icon: Mail, label: 'Total', value: replies.length, color: 'text-primary', bg: 'bg-primary/10' },
              { icon: CheckCircle, label: 'Auto-Sent', value: sentCount, color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: TrendingUp, label: 'Avg Confidence', value: `${avgConfidence}%`, color: 'text-tertiary', bg: 'bg-tertiary/10' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.bg}`}>
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
          {/* Left: list */}
          <div className="w-80 border-r border-outline-variant flex flex-col bg-white">
            {/* Search + filter */}
            <div className="p-3 border-b border-outline-variant space-y-2">
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                <Search size={13} className="text-on-surface-variant" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search replies..."
                  className="bg-transparent text-on-surface text-xs outline-none flex-1 placeholder-on-surface-variant/50"
                />
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant rounded-lg p-1">
                {['all', 'sent', 'review'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize cursor-pointer border-none ${
                      filter === f 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'sent' ? 'Sent' : 'Review'}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`p-4 border-b border-outline-variant cursor-pointer transition-colors ${
                    selected?.id === r.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-on-surface text-xs font-bold truncate max-w-[150px]">{r.from}</span>
                    <span className="text-on-surface-variant text-[10px] flex-shrink-0">{r.time}</span>
                  </div>
                  <p className="text-on-surface text-xs font-medium mb-1 truncate">{r.subject}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor[r.priority]}`}>{r.priority}</span>
                    {r.status === 'sent' ? (
                      <span className="flex items-center gap-1 text-secondary text-xs"><CheckCircle size={11} /> Sent</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error text-xs"><AlertCircle size={11} /> Review</span>
                    )}
                    <span className="text-on-surface-variant text-[10px] ml-auto">{Math.round(r.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: detail */}
          <div className="flex-1 overflow-y-auto bg-background p-6">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  {/* Email meta */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-on-surface font-semibold text-base">{selected.subject}</h3>
                        <p className="text-on-surface-variant text-sm mt-0.5">From: {selected.from}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor[selected.priority]}`}>{selected.priority}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Intent', value: selected.intent },
                        { label: 'Confidence', value: `${Math.round(selected.confidence * 100)}%` },
                        { label: 'Date', value: `${selected.date} · ${selected.time}` },
                        { label: 'Duration', value: selected.duration },
                      ].map(item => (
                        <div key={item.label} className="bg-surface-container-low rounded-lg p-2.5">
                          <p className="text-on-surface-variant text-[10px] mb-0.5">{item.label}</p>
                          <p className="text-on-surface text-xs font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-on-surface-variant text-xs font-medium">AI Confidence Score</span>
                      <span className={`text-xs font-bold ${selected.confidence > 0.7 ? 'text-secondary' : selected.confidence > 0.5 ? 'text-tertiary-container' : 'text-error'}`}>
                        {Math.round(selected.confidence * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.confidence * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${selected.confidence > 0.7 ? 'bg-secondary' : selected.confidence > 0.5 ? 'bg-tertiary' : 'bg-error'}`}
                      />
                    </div>
                    <p className="text-on-surface-variant text-xs mt-2">
                      {selected.confidence > 0.7 ? 'High confidence — reply sent automatically' : selected.confidence > 0.5 ? 'Medium confidence — review recommended' : 'Low confidence — human review required'}
                    </p>
                  </div>

                  {/* Reply content */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                        <Mail size={11} className="text-primary" />
                      </div>
                      <span className="text-primary text-xs font-medium">
                        {selected.status === 'sent' ? 'Sent Reply' : 'Reply Blocked — Review Required'}
                      </span>
                      <div className="ml-auto flex items-center gap-1.5 text-on-surface-variant">
                        <Clock size={11} />
                        <span className="text-xs">{selected.duration}</span>
                      </div>
                    </div>

                    {selected.reply ? (
                      <pre className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">{selected.reply}</pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <AlertCircle size={28} className="text-error" />
                        <p className="text-error font-semibold text-sm">Human Review Required</p>
                        <p className="text-on-surface-variant text-xs text-center">This email was flagged as sensitive and was not auto-replied.</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/automation/${selected.id}`)}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/20 transition-all cursor-pointer"
                    >
                      <ChevronRight size={14} /> View Full Details
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}
