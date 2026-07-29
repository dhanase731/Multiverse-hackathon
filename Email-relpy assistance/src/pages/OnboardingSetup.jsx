import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const logEntries = [
  { cmd: 'GET /api/v1/auth', status: '200 OK', statusClass: 'text-secondary' },
  { cmd: 'WEBHOOK_RECVD', status: 'SYNCING', statusClass: 'text-primary' },
  { cmd: 'MEM_ALLOC', status: '1.2GB', statusClass: 'text-on-surface-variant' },
  { cmd: 'OAUTH_HANDSHAKE', status: 'SUCCESS', statusClass: 'text-secondary' },
  { cmd: 'IMAP_STREAM_OPEN', status: 'ACTIVE', statusClass: 'text-primary' },
]

const steps = [
  { num: 1, label: 'Welcome', desc: 'System environment verified and ready.', state: 'done', extra: null },
  { num: 2, label: 'Connect Gmail', desc: null, state: 'done', extra: 'workspace-admin@company.com' },
  { num: 3, label: 'Synchronizing Gmail', desc: 'Mapping folder structure and label hierarchy...', state: 'active', extra: null },
  { num: 4, label: 'Reading Inbox', desc: null, state: 'pending', extra: null },
  { num: 5, label: 'Building AI Workspace', desc: null, state: 'pending', extra: null },
  { num: 6, label: 'Automation Ready', desc: null, state: 'final', extra: null },
]

export default function OnboardingSetup() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState(logEntries.slice(0, 3))
  const [logIdx, setLogIdx] = useState(3)

  useEffect(() => {
    const t = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, logEntries[logIdx % logEntries.length]]
        return next.length > 5 ? next.slice(1) : next
      })
      setLogIdx(i => i + 1)
    }, 3000)
    return () => clearInterval(t)
  }, [logIdx])

  // Automatically navigate to queue / workspace after onboarding finishes (for demo purposes we can let Cancel Setup go back and we can add a Launch button or auto-navigate)
  const handleLaunch = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-16 py-16 bg-background font-body-md text-on-background relative">
      {/* Global Background Ornamentation (Subtle Shader/Texture) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-0"></div>
      
      <main className="relative z-10 w-full max-w-3xl">
        {/* Brand Identity Section (Top) */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 cursor-pointer" onClick={handleLaunch}>
            <span className="material-symbols-outlined text-white text-[32px]">hub</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface text-center">Configuring n8n Workspace</h1>
          <p className="text-sm text-on-surface-variant text-center mt-2">Setting up your professional AI email automation</p>
        </div>

        {/* Main Task Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-md">
          {/* Real-time Progress Bar at Top Edge */}
          <div className="w-full h-1 bg-[#ebeef4] relative overflow-hidden">
            <div className="absolute h-full w-[30%] bg-primary rounded-[2px] animate-[progress-move_2s_infinite_ease-in-out]"></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary pulse-soft text-[22px]">sync</span>
                <h2 className="font-headline-sm text-headline-sm">Initialization Status</h2>
              </div>
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-label-lg font-label-lg rounded-full">35% Complete</span>
            </div>

            {/* Automation Timeline */}
            <div className="space-y-8 relative">
              {steps.map((step, i) => {
                const isDone = step.state === 'done'
                const isActive = step.state === 'active'
                const isPending = step.state === 'pending' || step.state === 'final'
                const isLast = i === steps.length - 1

                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    {/* Connector Line */}
                    {!isLast && (
                      <div className={`w-[2px] absolute left-[11px] top-6 bottom-[-40px] z-0 ${
                        isDone ? 'bg-primary' : isActive ? 'bg-gradient-to-b from-primary to-[#dfe3e8]' : 'bg-[#dfe3e8]'
                      }`}></div>
                    )}

                    {/* Node */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                      isDone 
                        ? 'bg-primary text-white' 
                        : isActive 
                          ? 'border-2 border-primary bg-white' 
                          : 'border-2 border-outline-variant bg-surface-container'
                    }`}>
                      {isDone && <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                      {isActive && <div className="w-2 h-2 bg-primary rounded-full pulse-soft"></div>}
                      {step.state === 'final' && <span className="material-symbols-outlined text-outline text-[14px]">rocket_launch</span>}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className={`text-xs font-semibold tracking-wider mb-1 uppercase ${isPending ? 'text-outline' : 'text-primary'}`}>Step {step.num}</p>
                      <h3 className={`font-headline-sm text-headline-sm ${isPending ? 'text-outline' : isActive ? 'text-primary' : 'text-on-surface'}`}>{step.label}</h3>
                      {step.desc && <p className="font-body-md text-on-surface-variant mt-0.5">{step.desc}</p>}
                      
                      {step.extra && (
                        <div className="flex items-center gap-1 mt-1 text-on-secondary-container bg-secondary-container px-3 py-1 rounded-lg w-fit">
                          <span className="material-symbols-outlined text-[14px]">verified_user</span>
                          <span className="text-label-md font-label-md">{step.extra}</span>
                        </div>
                      )}

                      {isActive && (
                        <div className="space-y-3 mt-3">
                          <div className="h-10 w-full bg-surface-container rounded-lg flex items-center px-3 gap-3 shimmer-anim">
                            <div className="w-6 h-6 rounded bg-outline-variant/30"></div>
                            <div className="h-3 w-32 bg-outline-variant/30 rounded"></div>
                          </div>
                          <div className="h-10 w-[85%] bg-surface-container rounded-lg flex items-center px-3 gap-3 shimmer-anim">
                            <div className="w-6 h-6 rounded bg-outline-variant/30"></div>
                            <div className="h-3 w-24 bg-outline-variant/30 rounded"></div>
                          </div>
                        </div>
                      )}

                      {isPending && step.state !== 'final' && (
                        <div className="h-3 w-48 bg-surface-container rounded-full mt-3"></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card Footer Action */}
          <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
              <span className="text-label-md font-label-md text-on-surface-variant">Estimated time remaining: 2m 14s</span>
            </div>
            <button 
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 rounded-full bg-surface-variant text-on-surface-variant font-label-lg text-label-lg hover:bg-outline-variant transition-colors cursor-pointer border-none"
            >
              Cancel Setup
            </button>
          </div>
        </div>

        {/* System Logs / Debug Preview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant rounded-xl p-6">
            <div className="flex items-center gap-1 mb-3">
              <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
              <span className="text-label-lg font-label-lg text-on-surface">n8n Execution Log</span>
            </div>
            <div className="font-mono-data text-mono-data text-on-surface-variant space-y-1 opacity-70">
              {logs.map((entry, i) => (
                <div key={i} className="flex justify-between">
                  <span>{entry.cmd}</span> 
                  <span className={entry.statusClass}>{entry.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-8 h-8 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_image_left</span>
            </div>
            <p className="font-label-lg text-label-lg text-on-surface">Secure Protocol</p>
            <p className="text-[10px] text-on-surface-variant mt-1">AES-256 Encrypted Tunnel</p>
          </div>
        </div>
      </main>

      {/* Contextual Footer */}
      <footer className="mt-16 text-center pb-6 relative z-10 w-full">
        <p className="text-label-md font-label-md text-outline">Powered by n8n Workflow Engine &amp; GPT-4o</p>
        <div className="flex items-center justify-center gap-6 mt-3">
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Security Policy</a>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">API Status</a>
        </div>
      </footer>
    </div>
  )
}
