import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  Zap,
  Mail,
  PlayCircle,
  Inbox,
  Brain,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  Sparkles,
  FileEdit,
  ShieldCheck,
  Activity
} from 'lucide-react'

const pipeline = [
  { icon: Eye, label: 'Listen', desc: 'Watching Gmail for incoming priority messages.', progress: 80, active: false },
  { icon: Sparkles, label: 'Think', desc: 'Classifying intent and retrieving context.', progress: null, active: true },
  { icon: FileEdit, label: 'Draft', desc: 'Generating brand-aligned professional replies.', progress: 0, active: false },
  { icon: ShieldCheck, label: 'Send', desc: 'Auto-responding or saving to drafts for review.', progress: 0, active: false },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold tracking-wider w-fit border border-green-200">
              <Zap className="w-3.5 h-3.5 fill-green-600 stroke-green-600 animate-breath" />
              AI Powered Automation
            </div>
            <h2 className="text-4xl md:text-5xl leading-tight font-bold tracking-tight text-on-surface">
              AI Email Reply Assistance
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-[560px]">
              Connect your Gmail account and let AI automatically read, understand, generate and send professional replies using intelligent automation. Focus on growth while we handle your inbox.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 hover:shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none"
              >
                <Mail className="w-4 h-4" />
                Connect Gmail
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 hover:bg-primary/5 active:scale-95 transition-all cursor-pointer bg-transparent">
                <PlayCircle className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual: Floating Pipeline Display */}
          <div className="relative h-[400px] flex items-center justify-center w-full">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>
            <div className="relative z-10 w-full max-w-[448px] bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-lg transform rotate-2">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-wider text-primary uppercase">Active Intelligence</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-surface-container-low rounded-xl flex items-center px-4 gap-3 border border-outline-variant/40">
                  <Inbox className="w-5 h-5 text-primary" />
                  <div className="h-2 bg-outline-variant/80 rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-primary/5 border border-primary/20 rounded-xl flex items-center px-4 gap-3">
                  <Brain className="w-5 h-5 text-primary animate-breath" />
                  <div className="text-[13px] font-mono font-medium text-primary">Analysing sentiment...</div>
                </div>
                <div className="h-12 bg-surface-container-low rounded-xl flex items-center px-4 gap-3 border border-outline-variant/40">
                  <Send className="w-5 h-5 text-on-surface-variant" />
                  <div className="h-2 bg-outline-variant/80 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-[25%] -right-8 w-52 bg-white p-4 rounded-xl shadow-xl border border-outline-variant/60 hidden lg:block transform -rotate-6">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
                <span className="text-xs font-semibold">Replied: "Inquiry 241"</span>
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono">98% Accuracy score</div>
            </div>
          </div>
        </section>

        {/* Automation Pipeline Visualization */}
        <section className="py-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Intelligent Automation Pipeline</h3>
            <p className="text-body-md text-on-surface-variant mt-1">Observe your AI working in real-time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-outline-variant/40 -z-10"></div>
            
            {pipeline.map((step, i) => {
              const StepIcon = step.icon
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full border-4 border-background shadow-md flex items-center justify-center mb-4 relative z-10 transition-all ${step.active ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <StepIcon className={`w-6 h-6 ${step.active ? 'animate-breath' : ''}`} />
                  </div>
                  <div className={`bg-white p-6 rounded-xl text-center w-full transition-shadow duration-300 ${step.active ? 'border-2 border-primary shadow-md' : 'border border-outline-variant/60 shadow-sm'}`}>
                    <h4 className="text-base font-bold mb-1" style={{ color: step.active ? 'var(--color-primary)' : 'var(--color-on-surface)' }}>{step.label}</h4>
                    <p className="text-body-sm text-on-surface-variant">{step.desc}</p>
                    <div className="mt-4 h-1 bg-surface-container rounded-full overflow-hidden">
                      {step.active ? (
                        <div className="h-full rounded-full animate-progress-flow"></div>
                      ) : step.progress > 0 ? (
                        <div className="h-full bg-primary rounded-full" style={{ width: `${step.progress}%` }}></div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Monitoring Grid (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-on-surface">Live Process Log</span>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block status-pulse"></span>
                  Streaming
                </span>
              </div>
              <button onClick={() => navigate('/history')} className="text-primary text-sm font-semibold tracking-wide border-none bg-transparent cursor-pointer hover:underline">View All</button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/40">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-on-surface">New Partner Onboarding</p>
                    <p className="text-body-sm text-on-surface-variant">Sent at 14:22 • Priority: High</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-white border border-outline-variant/60 rounded text-green-700 bg-green-50">REPLIED</span>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-primary animate-breath" />
                  <div>
                    <p className="text-sm font-bold text-primary">Meeting Rescheduling Request</p>
                    <p className="text-body-sm text-on-surface-variant">Processing • AI Thinking...</p>
                  </div>
                </div>
                <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress-flow"></div>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/40">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="text-sm font-bold text-on-surface">Feature Inquiry: Enterprise API</p>
                    <p className="text-body-sm text-on-surface-variant">Queued • Waiting for trigger</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-on-surface-variant bg-surface-container-highest px-2.5 py-1 rounded">QUEUED</span>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-2xl p-6 md:p-8 border border-primary relative flex flex-col justify-between overflow-hidden shadow-lg shadow-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div>
              <h4 className="text-xs font-bold tracking-wider opacity-85 uppercase mb-6">Productivity Score</h4>
              <div className="text-4xl font-extrabold leading-none mb-1">854</div>
              <p className="text-body-md opacity-90">Emails handled this week</p>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-body-sm font-semibold mb-1 opacity-90">
                <span>Time Saved</span>
                <span>12.4 Hours</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/60 flex flex-col gap-4">
            <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">System Status</span>
            <div className="flex flex-col gap-3">
              {[
                { label: 'AI Latency', value: '240ms', color: 'text-green-600' },
                { label: 'Memory Usage', value: '1.2 GB', color: 'text-on-surface' },
                { label: 'Gmail Sync', value: 'Stable', color: 'text-green-600' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface">{s.label}</span>
                  <span className={`text-body-md font-mono font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-auto w-full p-3 bg-surface-container-highest text-on-surface hover:bg-surface-container-high rounded-xl text-xs font-semibold tracking-wide border-none cursor-pointer transition-colors">
              View Detailed Metrics
            </button>
          </div>

          {/* AI Personality Card */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 flex gap-4 items-center shadow-sm">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline-variant/40">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkhUcjd8_CkS8Vf87o46C-v1R5X_e1GRbe_L1vjWYNUKWi5lEIMCb9UxoRC3_pAnrDKXBs9XO9S4HLNTq-fdGbrxVWp2dwWmgYwZtXpQ6XYDxr8UExRmJaJwvycLNAHnqsNPhmEjMYJUuCp5Gs5wncJGn3Oyj_URgZ16Ts-95-kkhME-RiJMrGnZVlKc0DRcOzl_BKtSxGA2TbzVKb1A-MNz2H0wQhUoQYkAoN6T9aavDUMP_3bLIj"
                alt="AI"
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-primary uppercase">AI Personality</p>
              <p className="text-lg font-bold text-on-surface">"Professional Concierge"</p>
              <p className="text-body-sm text-on-surface-variant font-medium">Tone: Empathetic &amp; Efficient</p>
            </div>
          </div>

          {/* Gmail Account Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 flex items-center justify-between overflow-hidden shadow-sm hover:border-primary/40 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-body-lg font-bold text-on-surface">Gmail Account</p>
                <p className="text-xs font-bold tracking-wider text-green-600 uppercase">Synchronized</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </div>
        </section>
      </div>
    </Layout>
  )
}
