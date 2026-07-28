import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const queueCards = [
  {
    id: 1, name: 'John Smith', subject: 'Meeting Tomorrow', status: 'PROCESSING',
    statusBg: 'bg-primary-container text-on-primary-container',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7Tj60RGr_l_B930atkgdXVdmXtp1Ki7BssE7FCIK6BYeDM4k9-etMVArnTjbIZ6oyzB1S-tKcOfAmT3nxMi_jRIkdLCqJCu-9GZCVVusEMSM5n9On0BQX-aMNOXXn061sJf7kBIzo9mV7T5oBo0TAXIg0UZfsd6w5YDRMXwdNvjZ7YaBdQmrKHj2t3jbCMOfX5W0cqQehLNv9WMhC-5ewbRxuGjvESq3XsMevnBIA6J4OZ5lbidf',
    steps: [
      { icon: 'check_circle', label: 'Reading Email', done: true, active: false },
      { icon: 'psychology', label: 'Generating Reply (Gemini)', done: false, active: true },
      { icon: 'drafts', label: 'Saving Draft', done: false, active: false },
      { icon: 'airplanemode_active', label: 'Sending Email', done: false, active: false },
    ],
    active: true,
  },
  {
    id: 2, name: 'Elena Rodriguez', subject: 'Project Milestone Update', status: 'WAITING',
    statusBg: 'bg-tertiary-container text-on-tertiary-container',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8bwZjnfrX5AWHgPoE-xZ3TdE099W20Ev4lFeI0EogWDtJPrYcMoRnG0yvBIp4yJdmm_QL-4hMMaBbbvPiKChvqN75uqZ3qL4abl7wNOjfWeU2lXRZtPTH7bvcp9Ah3nKj9cRbXfOxZ5lMFj0MnpnmB7N4wTE_emB2WIZZmAw3E-1mJ13cebetGd7G-hElARTT03KQXZzx4zN37SWSzOVQbbc2zz9Hl_7GEg7S3xSQgh7tsFG5NQwp',
    steps: [
      { icon: 'check_circle', label: 'Reading Email', done: true, active: false },
      { icon: 'check_circle', label: 'Generating Reply', done: true, active: false },
      { icon: 'pause', label: 'Saving Draft (Pending Connection)', done: false, active: true, warning: true },
    ],
    active: false,
  },
  {
    id: 3, name: 'Kevin Wong', subject: 'Partnership Inquiry', status: 'QUEUED',
    statusBg: 'bg-surface-container-highest text-on-surface-variant',
    avatar: null, initials: 'KW', steps: null, active: false,
  },
]

const originalEmail = `"Hi team, I would like to schedule a quick sync for tomorrow at 2 PM EST to discuss the new project timeline. Please let me know if this works for you."`

const timeline = [
  { label: 'Email Received & Triggered', sub: '14:02:11 • Completed (0.4s)', done: true },
  { label: 'Parsing Content', sub: '14:02:12 • Completed (1.2s)', done: true },
  { label: 'Gemini Draft Generation', sub: '14:02:14 • In Progress (2.5s elapsed)', done: false, active: true },
  { label: 'Draft Verification', sub: 'Upcoming...', done: false, active: false },
]

export default function UnifiedWorkspace() {
  const [selectedId, setSelectedId] = useState(1)
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-64px)] overflow-hidden">
        {/* Queue Cards */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Live Automation Queue</h2>
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium">
                <span className="animate-breath w-2 h-2 bg-secondary rounded-full inline-block" />
                3 Processing
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#dfe3e8] text-[#414754] rounded-full text-xs font-medium">
                12 Completed Today
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {queueCards.map(card => {
              const isSelected = selectedId === card.id
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedId(card.id)}
                  className={`bg-white rounded-xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                      : 'border-outline-variant hover:border-primary shadow-sm'
                  } ${card.id === 3 ? 'opacity-80' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {card.avatar ? (
                          <img src={card.avatar} alt={card.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-surface-container text-on-surface-variant">{card.initials}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-on-surface">{card.name}</h3>
                        <p className="text-xs font-semibold tracking-wider text-on-surface-variant">{card.subject}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${card.statusBg}`}>{card.status}</span>
                  </div>

                  {card.steps ? (
                    <div className="flex flex-col gap-3">
                      {card.steps.map((step, i) => (
                        <div key={i} className={`flex items-center gap-3 ${(!step.done && !step.active) ? 'opacity-40' : 'opacity-100'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative ${
                            step.done 
                              ? 'bg-secondary text-white' 
                              : step.active 
                                ? step.warning 
                                  ? 'bg-tertiary text-white' 
                                  : 'bg-primary text-white' 
                                : 'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                            <span className={`material-symbols-outlined text-[18px]`} style={{ fontVariationSettings: step.done ? "'FILL' 1" : "'FILL' 0" }}>{step.icon}</span>
                            {step.active && !step.warning && (
                              <div className="animate-ping absolute inset-0 rounded-full border-2 border-primary-fixed-dim opacity-25" />
                            )}
                          </div>
                          <span className={`text-xs font-semibold tracking-wider ${
                            step.active 
                              ? step.warning 
                                ? 'text-tertiary font-bold' 
                                : 'text-primary font-bold' 
                              : 'text-on-surface'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-on-surface-variant">Waiting for processing slot...</p>
                  )}

                  {card.active && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                      <div className="h-full w-[45%] bg-primary animate-[ai-shimmer_1.5s_infinite_linear]" style={{ backgroundSize: '200% 100%' }}></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Details Panel */}
        <aside className="w-full lg:w-[400px] flex-shrink-0 rounded-xl border border-outline-variant flex flex-col overflow-hidden bg-white shadow-md h-full">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-xl font-semibold text-on-surface">Automation Details</h3>
            <button className="rounded-full p-1 bg-transparent hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer border-none">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Original Email */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-3">Original Email</h4>
              <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant">
                <p className="text-sm leading-5 text-on-surface">{originalEmail}</p>
                <div className="mt-3 pt-3 border-t border-outline-variant flex justify-between text-[11px] text-on-surface-variant font-medium">
                  <span>From: john.smith@example.com</span>
                  <span>Received: 2m ago</span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-3">AI Summary</h4>
              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <p className="text-sm italic text-on-surface-variant">
                  Sender is requesting a meeting for tomorrow at 2 PM EST. Sentiment is neutral/professional. Priority: High.
                </p>
              </div>
            </div>

            {/* Full Conversation */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-3">Full Conversation</h4>
              <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-primary">John Smith</span>
                    <span className="text-[10px] text-on-surface-variant">14:02:11</span>
                  </div>
                  <div className="p-3 rounded-lg rounded-tl-none text-sm bg-surface-container border border-outline-variant">
                    <p className="font-bold mb-1 text-xs text-on-surface">Subject: Project Sync</p>
                    <p className="text-on-surface">Hi team, I would like to schedule a quick sync for tomorrow at 2 PM EST to discuss the new project timeline. Please let me know if this works for you.</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-on-surface-variant">14:02:14</span>
                    <span className="text-xs font-bold text-secondary">AI Assistant (Draft)</span>
                  </div>
                  <div className="p-3 rounded-lg rounded-tr-none text-sm bg-primary text-white ml-4">
                    Hi John, thanks for reaching out. 2 PM EST tomorrow works perfectly for the team. I've added it to the calendar. Looking forward to discussing the timeline.
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                    <span className="text-[10px] italic text-on-surface-variant">Generated by Gemini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Timeline */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-3">Execution Timeline</h4>
              <div className="relative pl-6 flex flex-col gap-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-outline-variant" />
                {timeline.map((item, i) => (
                  <div key={i} className={`relative ${(!item.done && !item.active) ? 'opacity-40' : 'opacity-100'}`}>
                    <div className={`absolute left-[-23px] top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                      item.done ? 'bg-secondary text-white' : item.active ? 'bg-primary text-white' : 'bg-surface-container-highest border-2 border-dashed border-outline'
                    }`}>
                      {item.done && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                      {item.active && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </div>
                    <p className={`text-sm font-bold ${item.active ? 'text-primary' : 'text-on-surface'}`}>{item.label}</p>
                    <p className={`text-[11px] font-mono mt-0.5 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-outline-variant bg-surface-container-low flex gap-3">
            <button className="flex-1 py-3 rounded-lg bg-primary text-white text-xs font-semibold tracking-wider hover:opacity-95 transition-opacity cursor-pointer border-none">
              Approve &amp; Send
            </button>
            <button className="py-3 px-6 rounded-lg bg-transparent text-primary text-xs font-semibold tracking-wider border border-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
              Edit Draft
            </button>
          </div>
        </aside>
      </div>
    </Layout>
  )
}
