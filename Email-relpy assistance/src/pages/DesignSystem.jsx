import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const colors = [
  { name: 'Primary', value: '#005bbf' },
  { name: 'Secondary', value: '#006e2c' },
  { name: 'Tertiary', value: '#795900' },
  { name: 'Error', value: '#ba1a1a' },
  { name: 'Background', value: '#f7f9ff' },
  { name: 'Surface Lowest', value: '#ffffff' },
]

const typography = [
  { name: 'Headline Large', size: 'text-headline-lg', weight: 'font-bold', sample: 'Reply Smarter AI' },
  { name: 'Headline Medium', size: 'text-headline-md', weight: 'font-semibold', sample: 'AI Workspace' },
  { name: 'Headline Small', size: 'text-headline-sm', weight: 'font-semibold', sample: 'Email Drafts' },
  { name: 'Body Large', size: 'text-body-lg', weight: 'font-normal', sample: 'AI-powered email automation for your inbox.' },
  { name: 'Body Medium', size: 'text-body-md', weight: 'font-normal', sample: 'Confidence: 92% · Priority: High' },
]

const badges = [
  { label: 'Low', cls: 'text-on-surface-variant bg-surface-container' },
  { label: 'Medium', cls: 'text-tertiary-container bg-tertiary-fixed' },
  { label: 'High', cls: 'text-error bg-error-container' },
  { label: 'Urgent', cls: 'text-white bg-error font-bold' },
  { label: 'Sent', cls: 'text-secondary bg-secondary-container' },
  { label: 'Review', cls: 'text-error bg-error-container' },
  { label: 'AI Draft', cls: 'text-primary bg-primary-container/20' },
]

export default function DesignSystem() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-white">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-on-surface font-bold text-headline-sm">Design System</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Colors */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Colors</h2>
          <div className="flex flex-wrap gap-4">
            {colors.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-2 bg-white p-4 border border-outline-variant rounded-xl shadow-sm">
                <div className="w-16 h-16 rounded-xl shadow-inner border border-outline-variant" style={{ background: c.value }} />
                <span className="text-on-surface-variant text-xs font-bold">{c.name}</span>
                <span className="text-outline text-xs font-mono">{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Typography</h2>
          <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
            {typography.map(t => (
              <div key={t.name} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-outline-variant pb-4 last:border-0 last:pb-0">
                <span className="text-on-surface-variant text-xs w-28 flex-shrink-0 font-bold uppercase">{t.name}</span>
                <span className={`text-on-surface ${t.size} ${t.weight}`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Badges &amp; Status</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <span key={b.label} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${b.cls}`}>{b.label}</span>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Buttons</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-sm shadow-primary/20">Primary</button>
            <button className="bg-primary/10 border border-primary/20 text-primary font-bold px-6 py-2.5 rounded-full text-sm hover:bg-primary/20 active:scale-95 transition-all cursor-pointer">Secondary</button>
            <button className="bg-surface-container-low border border-outline-variant text-on-surface-variant font-bold px-6 py-2.5 rounded-full text-sm hover:bg-surface-container-high active:scale-95 transition-colors cursor-pointer">Ghost</button>
            <button className="bg-error-container border border-error/20 text-error font-bold px-6 py-2.5 rounded-full text-sm hover:bg-error-container/40 active:scale-95 transition-colors cursor-pointer">Danger</button>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm">
              <p className="text-on-surface font-bold mb-1">Default Card</p>
              <p className="text-on-surface-variant text-sm">Used for content sections and panels.</p>
            </div>
            <div className="bg-white border-2 border-primary rounded-xl p-5 shadow-md shadow-primary/5">
              <p className="text-primary font-bold mb-1">Highlighted Card</p>
              <p className="text-on-surface-variant text-sm">Used for selected or active states.</p>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-on-surface font-semibold mb-4 text-headline-sm">Inputs</h2>
          <div className="space-y-3 max-w-sm">
            <input type="text" placeholder="Default input" className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors placeholder-on-surface-variant/40" />
            <input type="text" placeholder="Focused input" className="w-full bg-surface-container-low border-2 border-primary text-on-surface text-sm rounded-xl px-4 py-3 outline-none" />
            <input type="text" placeholder="Error input" className="w-full bg-surface-container-low border-2 border-error text-on-surface text-sm rounded-xl px-4 py-3 outline-none" />
          </div>
        </section>
      </div>
    </div>
  )
}
