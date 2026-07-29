import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../services/historyService'
import { processEmail } from '../services/emailService'

const pipeline = [
  {
    icon: 'monitoring', label: 'Listen',
    desc: 'Watching Gmail for incoming priority messages.',
    progress: 100, active: false,
  },
  {
    icon: 'auto_awesome', label: 'Think',
    desc: 'Classifying intent and retrieving context.',
    progress: null, active: true,
  },
  {
    icon: 'edit_note', label: 'Draft',
    desc: 'Generating brand-aligned professional responses.',
    progress: 0, active: false,
  },
  {
    icon: 'verified', label: 'Send',
    desc: 'Auto-responding or saving to drafts for review.',
    progress: 0, active: false,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signIn } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchDashboardLogs = () => {
    if (!user?.sub) return
    getHistory(user.sub)
      .then(data => {
        setLogs(Array.isArray(data) ? data.slice(0, 3) : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLogs([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDashboardLogs()
  }, [user?.sub])

  const handleSync = async () => {
    if (!user?.sub) return
    setSyncing(true)
    try {
      await processEmail(user.sub)
      fetchDashboardLogs()
    } catch (err) {
      console.error(err)
    } finally {
      setSyncing(false)
    }
  }

  const timeSaved = logs.length * 5 // Estimate 5 mins saved per reply
  const hoursSaved = (timeSaved / 60).toFixed(1)

  return (
    <AppShell searchPlaceholder="Search automation logs...">
      <div className="p-md lg:p-lg">

        {/* Hero Section */}
        <section className="mb-xl text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-lg items-center">
          <div className="space-y-md">
            <div className="inline-flex items-center gap-xs px-sm py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-lg font-label-lg">
              <span className="material-symbols-outlined text-[16px] animate-breath" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              AI Powered Automation
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-background leading-tight">
              AI Email Reply Assistance
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Connect your Gmail account and let AI automatically read, understand, generate and send professional replies using intelligent automation. Focus on growth while we handle your inbox.
            </p>
            <div className="flex flex-wrap gap-md pt-md">
              {user ? (
                <div className="flex gap-md items-center">
                  <div className="bg-secondary-container text-on-secondary-container px-xl py-sm rounded-full font-label-lg flex items-center gap-sm">
                    <span className="material-symbols-outlined">check_circle</span>
                    Gmail Connected
                  </div>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-primary text-on-primary px-xl py-sm rounded-full font-label-lg flex items-center gap-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-none disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined ${syncing ? 'animate-spin' : ''}`}>sync</span>
                    {syncing ? 'Syncing...' : 'Sync Inbox'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="bg-primary text-on-primary px-xl py-sm rounded-full font-label-lg flex items-center gap-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined">link</span>
                  Connect Gmail
                </button>
              )}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative h-[300px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #005bbf 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>
            <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-lg transform rotate-2">
              <div className="flex items-center justify-between mb-md">
                <span className="text-label-lg font-label-lg text-primary uppercase tracking-widest">Active Intelligence</span>
                <div className="flex gap-xs">
                  <div className="w-2 h-2 rounded-full bg-error" />
                  <div className="w-2 h-2 rounded-full bg-tertiary" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
              </div>
              <div className="space-y-sm">
                <div className="h-12 bg-surface-container rounded-lg flex items-center px-sm gap-sm">
                  <span className="material-symbols-outlined text-primary">inbox</span>
                  <div className="text-body-md font-mono-data text-on-surface">Gmail Connector Status: Active</div>
                </div>
                <div className="h-12 bg-primary-container/10 border border-primary/20 rounded-lg flex items-center px-sm gap-sm">
                  <span className="material-symbols-outlined text-primary animate-breath">psychology</span>
                  <div className="text-body-md font-mono-data text-primary">Gemini reply routing enabled</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Pipeline */}
        <section className="py-xl">
          <div className="text-center mb-lg">
            <h3 className="text-headline-md font-headline-md text-on-background">Intelligent Automation Pipeline</h3>
            <p className="text-body-md text-on-surface-variant">Observe your AI working in real-time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -z-10 translate-y-[-50%]" />
            {pipeline.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-4 border-surface-bright shadow-sm flex items-center justify-center mb-sm relative z-10 ${step.active ? 'bg-primary-container glow-active' : 'bg-surface-container-highest'}`}>
                  <span className={`material-symbols-outlined text-headline-sm ${step.active ? 'text-on-primary-container animate-breath' : 'text-on-surface-variant'}`}>
                    {step.icon}
                  </span>
                </div>
                <div className={`bg-surface-container-lowest p-md rounded-xl text-center w-full transition-shadow ${step.active ? 'border-2 border-primary shadow-lg' : 'border border-outline-variant hover:shadow-md'}`}>
                  <h4 className={`font-headline-sm text-body-lg mb-xs ${step.active ? 'text-primary' : ''}`}>{step.label}</h4>
                  <p className="text-label-md text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Monitoring Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          {/* Live Process Log */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-md border border-outline-variant relative overflow-hidden group">
            <div className="flex justify-between items-center mb-md">
              <div className="flex items-center gap-sm">
                <span className="text-headline-sm font-headline-sm text-on-surface">Recent Process Logs</span>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-primary font-label-lg hover:underline cursor-pointer border-none bg-transparent"
              >
                View All
              </button>
            </div>
            {loading ? (
              <div className="space-y-sm">
                <div className="h-12 bg-surface-container rounded-lg animate-pulse" />
                <div className="h-12 bg-surface-container rounded-lg animate-pulse" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px]">sync_problem</span>
                <p className="text-xs mt-xs">No emails processed yet. Trigger sync to start!</p>
              </div>
            ) : (
              <div className="space-y-sm">
                {logs.map(log => (
                  <div key={log.id} className="p-sm bg-surface-container rounded-lg flex items-center justify-between transition-all hover:bg-surface-container-high">
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <div>
                        <p className="text-body-md font-bold truncate max-w-[250px]">{log.subject}</p>
                        <p className="text-label-md text-on-surface-variant">From: {log.from_email}</p>
                      </div>
                    </div>
                    <span className="font-mono-data text-label-md bg-white px-sm py-xs rounded border uppercase">{log.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Productivity Score */}
          <div className="bg-primary text-on-primary rounded-xl p-md border border-primary relative flex flex-col justify-between overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div>
              <h4 className="text-label-lg font-label-lg opacity-80 uppercase tracking-widest mb-md">Productivity Score</h4>
              <div className="text-headline-lg font-headline-lg mb-xs">{logs.length}</div>
              <p className="text-body-md opacity-90">Emails processed in workspace</p>
            </div>
            <div className="mt-lg">
              <div className="flex justify-between text-label-md mb-xs">
                <span>Time Saved</span>
                <span>{hoursSaved} Hours</span>
              </div>
              <div className="h-2 bg-on-primary/20 rounded-full">
                <div className="h-full bg-secondary-fixed rounded-full w-[100%] shadow-sm" style={{ width: logs.length ? '100%' : '0%' }} />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant flex flex-col gap-sm">
            <span className="text-label-lg font-label-lg text-on-surface-variant">System Status</span>
            <div className="flex flex-col gap-sm">
              {[
                { label: 'AI Engine',     value: 'Gemini 3.5 Flash', cls: 'text-secondary' },
                { label: 'Gmail Sync',    value: user ? 'Stable' : 'Not Connected', cls: user ? 'text-secondary' : 'text-error' },
                { label: 'Automation Mode', value: 'Manual Approval', cls: 'text-on-surface' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-body-md">{s.label}</span>
                  <span className={`text-body-md font-mono-data ${s.cls}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gmail Connection Indicator */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant flex items-center justify-between overflow-hidden col-span-3">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">mail</span>
              </div>
              <div>
                <p className="text-body-md font-bold">Gmail Account</p>
                <p className={`text-label-md ${user ? 'text-secondary' : 'text-on-surface-variant'}`}>
                  {user ? `Connected to ${user.email}` : 'Not Connected'}
                </p>
              </div>
            </div>
            {user ? (
              <span className="material-symbols-outlined text-secondary">verified</span>
            ) : (
              <button onClick={signIn} className="text-primary font-semibold hover:underline border-none bg-transparent">Connect Now</button>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
