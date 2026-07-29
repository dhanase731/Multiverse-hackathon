import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_LOGS = [
  { cmd: 'GET /api/v1/auth', status: '200 OK',  statusCls: 'text-secondary' },
  { cmd: 'WEBHOOK_RECVD',    status: 'SYNCING', statusCls: 'text-primary' },
  { cmd: 'MEM_ALLOC',        status: '1.2GB',   statusCls: '' },
]

const LOG_POOL = [
  { cmd: 'FETCHING_META',   status: 'PENDING',  statusCls: 'text-primary' },
  { cmd: 'OAUTH_HANDSHAKE', status: 'SUCCESS',  statusCls: 'text-secondary' },
  { cmd: 'IMAP_STREAM_OPEN',status: 'ACTIVE',   statusCls: 'text-primary' },
  { cmd: 'BATCH_INDEXING',  status: 'RUNNING',  statusCls: 'text-primary' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [currentStep, setCurrentStep] = useState(3)
  const [percent, setPercent] = useState(35)
  const idxRef = useRef(0)

  useEffect(() => {
    const logInterval = setInterval(() => {
      const entry = LOG_POOL[idxRef.current % LOG_POOL.length]
      idxRef.current++
      setLogs(prev => {
        const next = [...prev, entry]
        return next.length > 5 ? next.slice(1) : next
      })
    }, 2000)

    const stepInterval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= 6) {
          clearInterval(stepInterval)
          return 6
        }
        const nextStep = s + 1
        setPercent(Math.round((nextStep / 6) * 100))
        return nextStep
      })
    }, 1500)

    return () => {
      clearInterval(logInterval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col items-center justify-center p-md">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-0" />

      <main className="relative z-10 w-full max-w-[560px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-xl">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-md shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-[32px]">hub</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface text-center">Configuring n8n Workspace</h1>
          <p className="font-body-md text-on-surface-variant text-center mt-xs">Setting up your professional AI email automation</p>
        </div>

        {/* Main Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-md">
          <div className="progress-indeterminate" />
          <div className="p-lg">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary pulse-soft">sync</span>
                <h2 className="font-headline-sm text-headline-sm">Initialization Status</h2>
              </div>
              <span className="px-sm py-xs bg-primary-container text-on-primary-container text-label-lg font-label-lg rounded-full">{percent}% Complete</span>
            </div>

            {/* Timeline */}
            <div className="space-y-xl relative">
              {/* Step 1 — done */}
              <div className="flex items-start gap-md relative">
                <div className="node-line completed" />
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-lg text-label-lg text-primary mb-xs uppercase">Step 1</p>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Welcome</h3>
                  <p className="font-body-md text-on-surface-variant">System environment verified and ready.</p>
                </div>
              </div>

              {/* Step 2 — done */}
              <div className="flex items-start gap-md relative">
                <div className="node-line completed" />
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-lg text-label-lg text-primary mb-xs uppercase">Step 2</p>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Connect Gmail</h3>
                  <div className="flex items-center gap-xs mt-xs text-on-secondary-container bg-secondary-container px-sm py-xs rounded-lg w-fit">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    <span className="text-label-md font-label-md">Connected via OAuth</span>
                  </div>
                </div>
              </div>

              {/* Step 3 — active/done */}
              <div className="flex items-start gap-md relative">
                <div className={`node-line ${currentStep > 3 ? 'completed' : 'active'}`} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${currentStep > 3 ? 'bg-primary text-white' : 'border-2 border-primary bg-white'}`}>
                  {currentStep > 3 ? (
                    <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : (
                    <div className="w-2 h-2 bg-primary rounded-full pulse-soft" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-label-lg text-label-lg text-primary mb-xs uppercase">Step 3</p>
                  <h3 className={`font-headline-sm text-headline-sm ${currentStep >= 3 ? 'text-primary' : 'text-outline'}`}>Synchronizing Gmail</h3>
                  {currentStep === 3 && (
                    <>
                      <p className="font-body-md text-on-surface-variant mb-sm">Mapping folder structure and label hierarchy...</p>
                      <div className="space-y-sm">
                        <div className="h-10 w-full bg-surface-container rounded-lg flex items-center px-sm gap-sm shimmer">
                          <div className="w-6 h-6 rounded bg-outline-variant/30" />
                          <div className="h-3 w-32 bg-outline-variant/30 rounded" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 4 — active/done */}
              <div className="flex items-start gap-md relative">
                <div className={`node-line ${currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : ''}`} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  currentStep > 4 
                    ? 'bg-primary text-white' 
                    : currentStep === 4 
                      ? 'border-2 border-primary bg-white' 
                      : 'border-2 border-outline-variant bg-surface-container'
                }`}>
                  {currentStep > 4 ? (
                    <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : currentStep === 4 ? (
                    <div className="w-2 h-2 bg-primary rounded-full pulse-soft" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className={`font-label-lg text-label-lg mb-xs uppercase ${currentStep >= 4 ? 'text-primary' : 'text-outline'}`}>Step 4</p>
                  <h3 className={`font-headline-sm text-headline-sm ${currentStep > 4 ? 'text-on-surface' : currentStep === 4 ? 'text-primary' : 'text-outline'}`}>Reading Inbox</h3>
                  {currentStep === 4 && <p className="font-body-md text-on-surface-variant mt-sm">Fetching and processing unread priority messages...</p>}
                </div>
              </div>

              {/* Step 5 — active/done */}
              <div className="flex items-start gap-md relative">
                <div className={`node-line ${currentStep > 5 ? 'completed' : currentStep === 5 ? 'active' : ''}`} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  currentStep > 5 
                    ? 'bg-primary text-white' 
                    : currentStep === 5 
                      ? 'border-2 border-primary bg-white' 
                      : 'border-2 border-outline-variant bg-surface-container'
                }`}>
                  {currentStep > 5 ? (
                    <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : currentStep === 5 ? (
                    <div className="w-2 h-2 bg-primary rounded-full pulse-soft" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className={`font-label-lg text-label-lg mb-xs uppercase ${currentStep >= 5 ? 'text-primary' : 'text-outline'}`}>Step 5</p>
                  <h3 className={`font-headline-sm text-headline-sm ${currentStep > 5 ? 'text-on-surface' : currentStep === 5 ? 'text-primary' : 'text-outline'}`}>Building AI Workspace</h3>
                  {currentStep === 5 && <p className="font-body-md text-on-surface-variant mt-sm">Calibrating personality models and settings...</p>}
                </div>
              </div>

              {/* Step 6 — final */}
              <div className="flex items-start gap-md">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${currentStep === 6 ? 'bg-secondary border-secondary text-white' : 'border-outline-variant bg-surface-container text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                </div>
                <div className="flex-1">
                  <p className={`font-label-lg text-label-lg mb-xs uppercase ${currentStep === 6 ? 'text-secondary' : 'text-outline'}`}>Step 6</p>
                  <h3 className={`font-headline-sm text-headline-sm ${currentStep === 6 ? 'text-on-surface font-bold' : 'text-outline'}`}>Automation Ready</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-surface-container-low px-lg py-md flex items-center justify-between border-t border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
              <span className="text-label-md font-label-md text-on-surface-variant">
                {currentStep === 6 ? 'Setup complete!' : 'Synchronizing credentials with n8n...'}
              </span>
            </div>
            {currentStep === 6 ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-xl py-sm rounded-full bg-secondary text-white font-label-lg text-label-lg hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border-none"
              >
                Launch Workspace →
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-md py-sm rounded-full bg-surface-variant text-on-surface-variant font-label-lg text-label-lg hover:bg-outline-variant transition-colors cursor-pointer border-none"
              >
                Cancel Setup
              </button>
            )}
          </div>
        </div>

        {/* System Logs */}
        <div className="mt-gutter grid grid-cols-2 gap-gutter">
          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant rounded-xl p-md">
            <div className="flex items-center gap-xs mb-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
              <span className="text-label-lg font-label-lg">n8n Execution Log</span>
            </div>
            <div className="font-mono-data text-mono-data text-on-surface-variant space-y-xs opacity-70">
              {logs.map((entry, i) => (
                <div key={i} className="flex justify-between">
                  <span>{entry.cmd}</span>
                  <span className={entry.statusCls}>{entry.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant rounded-xl p-md flex flex-col justify-center items-center text-center">
            <div className="w-8 h-8 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_image_left</span>
            </div>
            <p className="font-label-lg text-label-lg">Secure Protocol</p>
            <p className="text-[10px] text-on-surface-variant mt-xs">AES-256 Encrypted Tunnel</p>
          </div>
        </div>
      </main>

      <footer className="mt-xl text-center pb-lg relative z-10">
        <p className="text-label-md font-label-md text-outline">Powered by n8n Workflow Engine &amp; GPT-4o</p>
        <div className="flex items-center justify-center gap-md mt-sm">
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Security Policy</a>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">API Status</a>
        </div>
      </footer>
    </div>
  )
}
