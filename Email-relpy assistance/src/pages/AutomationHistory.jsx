import { useState } from 'react'
import Layout from '../components/Layout'

const logs = [
  {
    id: 1, time: '09:12', name: 'Sarah Jenkins',
    subject: 'Re: Q4 Project Update & Delivery Timeline',
    status: 'delivered', processing: '4.2s AI Processing',
    pipeline: [
      { icon: 'mail', done: true }, { icon: 'psychology', done: true },
      { icon: 'edit_note', done: true }, { icon: 'send', done: true },
    ],
  },
  {
    id: 2, time: '09:45', name: 'Cloud Solutions Corp',
    subject: 'New Service Request: API Enterprise Scaling',
    status: 'processing', processing: '2.1s so far',
    pipeline: [
      { icon: 'check', done: true }, { icon: 'psychology', done: false, active: true },
      { icon: 'edit_note', done: false }, { icon: 'send', done: false },
    ],
  },
  {
    id: 3, time: '08:30', name: 'Marketing Team',
    subject: 'URGENT: Asset Approval for Monday Launch',
    status: 'failed', processing: null,
    pipeline: [
      { icon: 'mail', done: true }, { icon: 'close', done: false, failed: true },
      { icon: 'edit_note', done: false }, { icon: 'send', done: false },
    ],
  },
  {
    id: 4, time: '07:55', name: 'Auto-Generated: Weekly Stats',
    subject: 'Your automation report for Oct 14-21',
    status: 'delivered', processing: '1.8s AI Processing',
    pipeline: [
      { icon: 'check', done: true }, { icon: 'check', done: true },
      { icon: 'check', done: true }, { icon: 'send', done: true },
    ],
  },
]

const yesterday = [{
  id: 5, time: '22:15', name: 'Support Ticket #9921',
  subject: 'Inquiry regarding Enterprise SSO configuration',
  status: 'delivered', processing: '6.8s Processing',
}]

const badge = {
  delivered: { bg: 'bg-[#86f898] text-[#00722f]', icon: 'check_circle', label: 'Delivered' },
  processing: { bg: 'bg-primary text-white', icon: 'sync', label: 'AI Drafting...' },
  failed: { bg: 'bg-error-container text-on-error-container', icon: 'error', label: 'Retry Failed' },
}

const dotColor = { 
  delivered: 'bg-secondary', 
  processing: 'bg-primary', 
  failed: 'bg-error' 
}

function PipelineNode({ icon, done, active, failed, last }) {
  const bgClass = failed 
    ? 'bg-error text-white' 
    : done 
      ? 'bg-secondary text-white' 
      : active 
        ? 'bg-primary text-white animate-pulse' 
        : 'bg-surface-container-highest text-on-surface-variant border-2 border-dashed border-outline'

  const lineClass = done ? 'bg-secondary' : 'bg-outline-variant'

  return (
    <div className={`flex items-center ${last ? 'flex-none' : 'flex-1'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${bgClass}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      {!last && <div className={`flex-1 h-[2px] mx-1 ${lineClass}`} />}
    </div>
  )
}

export default function AutomationHistory() {
  const [activeFilter, setActiveFilter] = useState('Today')

  return (
    <Layout>
      <div className="p-6 flex flex-col gap-6">

        {/* Filter Bar */}
        <section className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-on-surface">Automation History</h1>
            <p className="text-sm text-on-surface-variant mt-1">Observability into every action your AI assistant takes.</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-outline-variant bg-surface-container-low">
            {['Today', 'Yesterday', 'Last 7 Days'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer border-none ${
                  activeFilter === f 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high bg-transparent'
                }`}
              >{f}</button>
            ))}
            <div className="w-[1px] h-6 bg-outline-variant mx-1" />
            <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer bg-transparent border-none">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Status
            </button>
          </div>
        </section>

        {/* Log Entries */}
        <div className="flex flex-col gap-3">
          {logs.map(log => {
            const b = badge[log.status]
            const isProcessing = log.status === 'processing'
            return (
              <div
                key={log.id}
                className={`bg-white rounded-xl p-6 transition-all duration-300 ${
                  isProcessing 
                    ? 'border-2 border-primary shadow-lg scale-[1.01]' 
                    : 'border border-outline-variant hover:shadow-md'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  {/* Left */}
                  <div className="lg:col-span-1 flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-semibold tracking-wider ${isProcessing ? 'text-primary' : 'text-on-surface-variant'}`}>{log.time}</span>
                      <span className={`w-2 h-2 rounded-full ${dotColor[log.status]} ${isProcessing ? 'animate-breath' : ''}`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-on-surface">{log.name}</h3>
                      <p className="text-sm text-on-surface-variant">{log.subject}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 ${b.bg}`}>
                          <span className={`material-symbols-outlined text-[14px] ${isProcessing ? 'status-pulse' : ''}`}>{b.icon}</span>
                          {b.label}
                        </span>
                        {log.processing && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">timer</span>
                            {log.processing}
                          </span>
                        )}
                        {log.status === 'failed' && (
                          <span className="text-[11px] font-bold text-error cursor-pointer hover:underline">
                            Manual Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pipeline */}
                  <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex items-center w-full max-w-lg mx-auto px-4">
                      {log.pipeline.map((node, idx) => (
                        <PipelineNode
                          key={idx}
                          icon={node.icon}
                          done={node.done}
                          active={node.active}
                          failed={node.failed}
                          last={idx === log.pipeline.length - 1}
                        />
                      ))}
                    </div>
                    {isProcessing && (
                      <div className="w-full bg-[#dfe3e8] rounded-full h-1 overflow-hidden mt-3">
                        <div className="h-full w-[45%] bg-primary rounded-full animate-[progress-move_2s_infinite_ease-in-out]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Yesterday */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-[1px] bg-outline-variant" />
            <span className="text-xs font-semibold tracking-wider text-on-surface-variant bg-background px-4">Yesterday, Oct 24</span>
            <div className="flex-1 h-[1px] bg-outline-variant" />
          </div>
          
          {yesterday.map(log => (
            <div key={log.id} className="bg-white rounded-xl p-6 border border-outline-variant opacity-80 hover:opacity-100 transition-opacity duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-1 flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold tracking-wider text-on-surface-variant">{log.time}</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-on-surface">{log.name}</h3>
                    <p className="text-sm text-on-surface-variant">{log.subject}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#86f898] text-[#00722f]">Delivered</span>
                      <span className="text-[11px] font-medium text-on-surface-variant">{log.processing}</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-4 flex items-center justify-center">
                  <p className="text-sm italic text-on-surface-variant">
                    Timeline view collapsed for historical entries.{' '}
                    <button className="font-semibold text-primary bg-transparent border-none cursor-pointer hover:underline">
                      View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center pt-4 pb-16">
          <button className="px-16 py-3 rounded-full text-xs font-semibold tracking-wider bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer">
            Load More History
          </button>
        </div>
      </div>
    </Layout>
  )
}
