import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { usePolling } from '../hooks/usePolling'
import { getProcessing } from '../services/workflowService'

const STEPS = [
  { key: 'reading',    icon: 'mail',          label: 'Reading Email' },
  { key: 'generating', icon: 'psychology',     label: 'Generating AI Reply' },
  { key: 'saving',     icon: 'drafts',         label: 'Saving Draft' },
  { key: 'sending',    icon: 'send',           label: 'Sending Email' },
  { key: 'delivered',  icon: 'check_circle',   label: 'Delivered' },
]

const STEP_INDEX = { reading: 0, generating: 1, saving: 2, sending: 3, delivered: 4 }

function ProcessingCard({ item, selected, onClick }) {
  const activeIdx = STEP_INDEX[item.status] ?? 0

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-6 border transition-all cursor-pointer relative overflow-hidden ${
        selected
          ? 'border-primary ring-2 ring-primary/20 shadow-md'
          : 'border-outline-variant hover:border-primary shadow-sm'
      }`}
    >
      {selected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}

      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm text-on-surface-variant">
            {item.from?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface truncate max-w-[160px]">{item.from}</p>
            <p className="text-xs text-on-surface-variant truncate max-w-[160px]">{item.subject}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
          item.status === 'delivered' ? 'bg-secondary-container text-on-secondary-container' :
          item.status === 'sending'   ? 'bg-primary-container text-on-primary' :
          'bg-surface-container text-on-surface-variant'
        }`}>
          {item.status}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {STEPS.map((step, i) => (
          <div key={step.key} className={`flex items-center gap-3 ${i > activeIdx ? 'opacity-30' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative ${
              i < activeIdx  ? 'bg-secondary text-white' :
              i === activeIdx ? 'bg-primary text-white' :
              'bg-surface-container text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: i <= activeIdx ? "'FILL' 1" : "'FILL' 0" }}>
                {step.icon}
              </span>
              {i === activeIdx && item.status !== 'delivered' && (
                <div className="animate-ping absolute inset-0 rounded-full border-2 border-primary opacity-30" />
              )}
            </div>
            <span className={`text-xs font-semibold ${
              i === activeIdx ? 'text-primary' : 'text-on-surface'
            }`}>{step.label}</span>
          </div>
        ))}
      </div>

      {item.status !== 'delivered' && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
          <div className="h-full bg-primary animate-progress-flow" style={{ width: `${((activeIdx + 1) / STEPS.length) * 100}%` }} />
        </div>
      )}
    </div>
  )
}

export default function Processing() {
  const { user } = useAuth()
  const { data: items, loading } = usePolling(() => getProcessing(user?.sub))
  const [selectedId, setSelectedId] = useState(null)

  const selected = items.find(i => i.id === selectedId) ?? items[0]
  const processing = items.filter(i => i.status !== 'delivered').length

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-64px)] overflow-hidden">
        {/* Left: cards */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Processing</h2>
            <div className="flex gap-2">
              {processing > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium">
                  <span className="animate-breath w-2 h-2 bg-secondary rounded-full" />
                  {processing} Active
                </span>
              )}
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium">
                {items.filter(i => i.status === 'delivered').length} Done Today
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-outline-variant animate-pulse h-48" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px]">hourglass_empty</span>
              <p className="text-base font-medium">No emails being processed</p>
              <p className="text-sm">Go to Inbox and click an email to start</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {items.map(item => (
                <ProcessingCard
                  key={item.id}
                  item={item}
                  selected={selected?.id === item.id}
                  onClick={() => setSelectedId(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: detail panel */}
        {selected && (
          <aside className="w-full lg:w-[380px] flex-shrink-0 rounded-xl border border-outline-variant flex flex-col overflow-hidden bg-white shadow-md">
            <div className="p-5 border-b border-outline-variant">
              <h3 className="text-lg font-semibold text-on-surface">Automation Details</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{selected.from}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Subject</h4>
                <p className="text-sm text-on-surface">{selected.subject}</p>
              </div>

              {selected.preview && (
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Preview</h4>
                  <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant">
                    <p className="text-sm text-on-surface-variant">{selected.preview}</p>
                  </div>
                </div>
              )}

              {selected.aiReply && (
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-2">AI Draft</h4>
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <p className="text-sm text-on-surface">{selected.aiReply}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                      <span className="text-[10px] italic text-on-surface-variant">Generated by Gemini</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Execution Timeline</h4>
                <div className="relative pl-5 flex flex-col gap-5">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-outline-variant" />
                  {STEPS.map((step, i) => {
                    const activeIdx = STEP_INDEX[selected.status] ?? 0
                    const done = i < activeIdx
                    const active = i === activeIdx
                    return (
                      <div key={step.key} className={`relative ${i > activeIdx ? 'opacity-30' : ''}`}>
                        <div className={`absolute left-[-19px] top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                          done ? 'bg-secondary text-white' : active ? 'bg-primary text-white' : 'bg-surface-container border-2 border-dashed border-outline'
                        }`}>
                          {done && <span className="material-symbols-outlined text-[10px]">check</span>}
                          {active && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                        </div>
                        <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-on-surface'}`}>{step.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </Layout>
  )
}
