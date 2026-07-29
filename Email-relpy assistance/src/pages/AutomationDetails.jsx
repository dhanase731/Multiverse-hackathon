import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Zap, User, Bot, Send } from 'lucide-react'
import { useState } from 'react'
import Layout from '../components/Layout'

const mockData = {
  1: {
    from: 'alex@company.com', subject: 'Meeting time confirmation',
    body: 'Hi, can we confirm the 3PM slot for tomorrow? I want to make sure everyone is available.',
    intent: 'Meeting Inquiry', priority: 'Medium', sentiment: 'Neutral',
    confidence: 0.92, safe_to_reply: true,
    reason: 'Straightforward scheduling request that can be answered directly.',
    reply: 'Hi Alex,\n\nThank you for reaching out. The meeting is confirmed for 3 PM tomorrow.\n\nKind regards,',
    time: '07:21 AM · Today',
  },
  3: {
    from: 'legal@firm.com', subject: 'Contract review needed',
    body: 'Please review the attached NDA before signing. This is time-sensitive.',
    intent: 'Legal', priority: 'Urgent', sentiment: 'Neutral',
    confidence: 0.45, safe_to_reply: false,
    reason: 'Email contains legal content. Human review required before any response.',
    reply: 'REVIEW_REQUIRED',
    time: '07:20 AM · Today',
  },
}

const messages = [
  { role: 'system', text: 'Email received and queued for AI processing.' },
  { role: 'ai', text: 'Analyzing email content, intent, and sentiment...' },
  { role: 'ai', text: 'Intent detected: Meeting Inquiry · Confidence: 92% · Priority: Medium' },
  { role: 'ai', text: 'Drafting reply based on tone settings (Warm & Friendly)...' },
  { role: 'ai', text: 'Reply drafted. Safe to send automatically.' },
]

export default function AutomationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = mockData[id] || mockData[1]
  const [sent, setSent] = useState(false)

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-white">
          <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-on-surface font-bold text-base">{data.subject}</h1>
            <p className="text-on-surface-variant text-xs">{data.from} · {data.time}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {data.safe_to_reply ? (
              <span className="flex items-center gap-1 text-secondary text-xs bg-secondary-container px-3 py-1 rounded-full font-bold">
                <CheckCircle size={12} /> Auto-reply eligible
              </span>
            ) : (
              <span className="flex items-center gap-1 text-error text-xs bg-error-container px-3 py-1 rounded-full font-bold">
                <AlertCircle size={12} /> Review required
              </span>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto bg-background p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-start">
            {/* Left: Email + AI analysis */}
            <div className="space-y-6">
              {/* Original email */}
              <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
                  <User size={14} />
                  <span className="text-xs font-semibold tracking-wider">Original Email</span>
                </div>
                <p className="text-on-surface text-sm leading-relaxed bg-surface-container-low p-3 rounded-lg border border-outline-variant font-medium">{data.body}</p>
              </div>

              {/* AI Analysis */}
              <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Zap size={14} />
                  <span className="text-xs font-semibold tracking-wider">AI Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Intent', value: data.intent },
                    { label: 'Priority', value: data.priority },
                    { label: 'Sentiment', value: data.sentiment },
                    { label: 'Confidence', value: `${Math.round(data.confidence * 100)}%` },
                  ].map(item => (
                    <div key={item.label} className="bg-surface-container-low rounded-lg p-3 border border-outline-variant">
                      <p className="text-on-surface-variant text-[10px] mb-1">{item.label}</p>
                      <p className="text-on-surface text-sm font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                  <p className="text-on-surface-variant text-[10px] mb-1">Reason</p>
                  <p className="text-on-surface text-xs leading-relaxed font-medium">{data.reason}</p>
                </div>
              </div>
            </div>

            {/* Right: Conversation view */}
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="bg-white border border-outline-variant rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-2 text-primary">
                  <Bot size={14} />
                  <span className="text-xs font-semibold tracking-wider">AI Processing Log</span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`flex gap-2 ${msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      {msg.role === 'system' ? (
                        <span className="text-on-surface-variant text-xs bg-surface-container px-3 py-1 rounded-full font-medium">{msg.text}</span>
                      ) : (
                        <div className="flex items-start gap-2 max-w-[90%]">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot size={12} className="text-primary" />
                          </div>
                          <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
                            <p className="text-on-surface text-xs leading-relaxed font-medium">{msg.text}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Draft reply */}
                <div className="border-t border-outline-variant p-4 bg-surface-container-low">
                  <p className="text-on-surface-variant text-xs mb-2 font-semibold">Draft Reply</p>
                  {data.reply === 'REVIEW_REQUIRED' ? (
                    <div className="flex items-center gap-2 text-error text-xs p-3 bg-error-container/20 rounded-lg border border-error-container">
                      <AlertCircle size={14} /> This email requires human review before replying.
                    </div>
                  ) : (
                    <>
                      <textarea
                        defaultValue={data.reply}
                        rows={4}
                        className="w-full bg-white border border-outline-variant text-on-surface text-xs rounded-lg px-3 py-2 outline-none focus:border-primary resize-none leading-relaxed"
                      />
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSent(true)}
                        disabled={sent}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer border-none"
                      >
                        {sent ? <><CheckCircle size={13} /> Sent!</> : <><Send size={13} /> Send Reply</>}
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
