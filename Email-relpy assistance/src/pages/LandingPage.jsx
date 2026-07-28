import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const pipeline = [
  { icon: 'monitoring', label: 'Listen', desc: 'Watching Gmail for incoming priority messages.', progress: 80, active: false },
  { icon: 'auto_awesome', label: 'Think', desc: 'Classifying intent and retrieving context.', progress: null, active: true },
  { icon: 'edit_note', label: 'Draft', desc: 'Generating brand-aligned professional responses.', progress: 0, active: false },
  { icon: 'verified', label: 'Send', desc: 'Auto-responding or saving to drafts for review.', progress: 0, active: false },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Hero Section */}
        <section className="mb-16 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#86f898] text-[#00722f] rounded-full text-xs font-semibold tracking-wider w-fit">
              <span className="material-symbols-outlined text-[16px] animate-breath" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              AI Powered Automation
            </div>
            <h2 className="text-[32px] leading-10 font-bold tracking-tight text-[#181c20]">
              AI Email Reply Assistance
            </h2>
            <p className="text-base leading-6 text-[#414754] max-w-[560px]">
              Connect your Gmail account and let AI automatically read, understand, generate and send professional replies using intelligent automation. Focus on growth while we handle your inbox.
            </p>
            <div className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/signin')}
                className="bg-[#005bbf] text-white px-16 py-3 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all cursor-pointer border-none"
              >
                <span className="material-symbols-outlined">link</span>
                Connect Gmail
              </button>
              <button className="border-2 border-[#005bbf] text-[#005bbf] px-16 py-3 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 hover:bg-[rgba(0,91,191,0.05)] transition-all cursor-pointer bg-transparent">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual: Floating Pipeline Display */}
          <div className="relative h-[400px] flex items-center justify-center w-full">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #005bbf 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>
            <div className="relative z-10 w-full max-w-[448px] bg-white rounded-xl p-6 border border-[#c1c6d6] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transform rotate-2">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold tracking-wider text-[#005bbf] uppercase">Active Intelligence</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ba1a1a]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#795900]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#006e2c]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-[#ebeef4] rounded-lg flex items-center px-3 gap-3 animate-pulse">
                  <span className="material-symbols-outlined text-[#005bbf]">inbox</span>
                  <div className="h-2 bg-[#c1c6d6] rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-[rgba(26,115,232,0.05)] border border-[rgba(0,91,191,0.2)] rounded-lg flex items-center px-3 gap-3">
                  <span className="material-symbols-outlined text-[#005bbf] animate-breath">psychology</span>
                  <div className="text-[13px] font-mono text-[#005bbf]">Analysing sentiment...</div>
                </div>
                <div className="h-12 bg-[#ebeef4] rounded-lg flex items-center px-3 gap-3">
                  <span className="material-symbols-outlined text-[#414754]">send</span>
                  <div className="h-2 bg-[#c1c6d6] rounded w-1/2"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-[25%] -right-8 w-48 bg-white p-3 rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-[#c1c6d6] hidden lg:block transform -rotate-6">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#006e2c] inline-block"></span>
                <span className="text-[11px] font-medium">Replied: "Inquiry 241"</span>
              </div>
              <div className="text-[10px] text-[#414754] font-mono">98% Accuracy score</div>
            </div>
          </div>
        </section>

        {/* Automation Pipeline Visualization */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl leading-8 font-semibold tracking-tight text-[#181c20]">Intelligent Automation Pipeline</h3>
            <p className="text-sm text-[#414754] mt-1">Observe your AI working in real-time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-[#c1c6d6] -z-10 translate-y-[-50%]"></div>
            
            {pipeline.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-4 border-[#f7f9ff] shadow-sm flex items-center justify-center mb-3 relative z-10 ${step.active ? 'bg-[#1a73e8] glow-active' : 'bg-[#dfe3e8]'}`}>
                  <span className={`material-symbols-outlined ${step.active ? 'animate-breath' : ''}`} style={{ color: step.active ? '#ffffff' : '#414754', fontSize: '26px' }}>{step.icon}</span>
                </div>
                <div className={`bg-white p-6 rounded-xl text-center w-full transition-shadow ${step.active ? 'border-2 border-[#005bbf] shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'border border-[#c1c6d6]'}`}>
                  <h4 className="text-base font-semibold mb-1" style={{ color: step.active ? '#005bbf' : '#181c20' }}>{step.label}</h4>
                  <p className="text-[11px] font-medium text-[#414754]">{step.desc}</p>
                  <div className="mt-3 h-1 bg-[#dfe3e8] rounded-full overflow-hidden">
                    {step.active ? (
                      <div className="h-full rounded-full animate-progress-flow"></div>
                    ) : step.progress > 0 ? (
                      <div className="h-full bg-[#005bbf] rounded-full" style={{ width: `${step.progress}%` }}></div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monitoring Grid (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 bg-white rounded-xl p-6 border border-[#c1c6d6] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-[#181c20]">Live Process Log</span>
                <span className="px-3 py-1 bg-[#86f898] text-[#00722f] rounded-full text-[11px] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006e2c] inline-block animate-breath"></span>
                  Streaming
                </span>
              </div>
              <button onClick={() => navigate('/history')} className="text-[#005bbf] text-xs font-semibold tracking-wide border-none bg-none cursor-pointer">View All</button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#ebeef4] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-[#006e2c]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="text-sm font-bold">New Partner Onboarding</p>
                    <p className="text-[11px] font-medium text-[#414754]">Sent at 14:22 • Priority: High</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-medium px-3 py-1 bg-white border border-[#c1c6d6] rounded">REPLIED</span>
              </div>
              
              <div className="p-3 bg-[rgba(26,115,232,0.05)] border border-[rgba(0,91,191,0.2)] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-[#005bbf] animate-breath">pending</span>
                  <div>
                    <p className="text-sm font-bold text-[#005bbf]">Meeting Rescheduling Request</p>
                    <p className="text-[11px] font-medium text-[#414754]">Processing • AI Thinking...</p>
                  </div>
                </div>
                <div className="w-24 h-1 bg-[#dfe3e8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#005bbf] animate-progress-flow"></div>
                </div>
              </div>

              <div className="p-3 bg-[#ebeef4] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-[#414754]">schedule</span>
                  <div>
                    <p className="text-sm font-bold">Feature Inquiry: Enterprise API</p>
                    <p className="text-[11px] font-medium text-[#414754]">Queued • Waiting for trigger</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-medium text-[#414754]">QUEUED</span>
              </div>
            </div>
          </div>

          <div className="bg-[#005bbf] text-white rounded-xl p-6 border border-[#005bbf] relative flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,91,191,0.3)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(255,255,255,0.1)] rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider opacity-80 uppercase mb-6">Productivity Score</h4>
              <div className="text-[32px] font-bold leading-10 mb-1">854</div>
              <p className="text-base opacity-90">Emails handled this week</p>
            </div>
            <div className="mt-10">
              <div className="flex justify-between text-[11px] mb-1">
                <span>Time Saved</span>
                <span>12.4 Hours</span>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.2)] rounded-full">
                <div className="h-full w-[72%] bg-[#89fa9b] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-[#f1f4fa] rounded-xl p-6 border border-[#c1c6d6] flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-wider text-[#414754]">System Status</span>
            <div className="flex flex-col gap-3">
              {[
                { label: 'AI Latency', value: '240ms', color: '#006e2c' },
                { label: 'Memory Usage', value: '1.2 GB', color: '#181c20' },
                { label: 'Gmail Sync', value: 'Stable', color: '#006e2c' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#181c20]">{s.label}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-auto w-full p-3 bg-[#dfe3e8] rounded-lg text-xs font-semibold tracking-wider border-none cursor-pointer transition-colors hover:bg-[#e5e8ee]">
              View Detailed Metrics
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#c1c6d6] flex gap-6 items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#ebeef4] flex-shrink-0">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkhUcjd8_CkS8Vf87o46C-v1R5X_e1GRbe_L1vjWYNUKWi5lEIMCb9UxoRC3_pAnrDKXBs9XO9S4HLNTq-fdGbrxVWp2dwWmgYwZtXpQ6XYDxr8UExRmJaJwvycLNAHnqsNPhmEjMYJUuCp5Gs5wncJGn3Oyj_URgZ16Ts-95-kkhME-RiJMrGnZVlKc0DRcOzl_BKtSxGA2TbzVKb1A-MNz2H0wQhUoQYkAoN6T9aavDUMP_3bLIj"
                alt="AI"
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#005bbf]">AI Personality</p>
              <p className="text-xl font-semibold text-[#181c20]">"Professional Concierge"</p>
              <p className="text-[11px] font-medium text-[#414754]">Tone: Empathetic &amp; Efficient</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#c1c6d6] flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#fef2f2] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#dc2626]">mail</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#181c20]">Gmail Account</p>
                <p className="text-xs font-semibold tracking-wider text-[#006e2c]">Synchronized</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#414754]">chevron_right</span>
          </div>
        </section>
      </div>
    </Layout>
  )
}
