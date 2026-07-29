import { useState, useCallback } from 'react'
import AppShell from '../components/AppShell'
import { 
  Mail, 
  Briefcase, 
  Smile, 
  Zap, 
  FileText, 
  Upload, 
  RefreshCw, 
  Check,
  ShieldAlert,
  ChevronDown
} from 'lucide-react'

const TONES = [
  { value: 'professional', icon: Briefcase, label: 'Professional' },
  { value: 'casual',       icon: Smile,     label: 'Casual' },
  { value: 'concise',      icon: Zap,       label: 'Concise' },
  { value: 'detailed',     icon: FileText,  label: 'Detailed' },
]

function Toggle({ on }) {
  const [value, setValue] = useState(on)
  return (
    <button
      onClick={() => setValue(v => !v)}
      className={`w-12 h-6 rounded-full relative transition-all duration-200 cursor-pointer border-none ${value ? 'bg-primary' : 'bg-outline-variant'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${value ? 'left-7' : 'left-1'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const [tone, setTone] = useState('professional')
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved

  const handleSave = useCallback(() => {
    setSaveState('saving')
    setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    }, 1500)
  }, [])

  return (
    <AppShell searchPlaceholder="Search settings...">
      <div className="max-w-4xl mx-auto py-8 px-6 pb-36">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Settings</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">Configure your email assistant and automation preferences</p>
        </div>

        {/* Section 1: Connected Account */}
        <section className="mb-8">
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface">Connected Account</h3>
                <p className="text-body-md text-on-surface-variant">Manage your email service integration</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-outline-variant/60 shadow-sm">
                  <img
                    className="w-6 h-6"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD3-_IEiM2_YBJ1vBSK0yKn1i7liUsxfGC2DyJY7tJa4TQlLt7QoXDSYHHfzuNXI2-sNcC1B6Hlk_eggS2gwjwwjoMrpDBS1M-h_HlFtz9EepHBPA0vKLEvs7hy_Gtda4gM-8bARQELVVsgLb5vq8ApFMoQic_1xUIIYeHXGda0v1PpJlPKXPEadLLFQRX-CCiMeZWOgXDh8agnA7vXnFp1j_JijfQX_jZYCqurzSFlf1E5fbszrWA"
                    alt="Google"
                  />
                </div>
                <div>
                  <p className="text-body-lg font-semibold text-on-surface">dhanase731@gmail.com</p>
                  <p className="text-label-md text-on-surface-variant">Last synced: 4 minutes ago</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-5 py-2.5 border border-error text-error font-semibold rounded-lg hover:bg-error-container/20 active:scale-95 transition-all cursor-pointer bg-transparent">
                Disconnect
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Preferences */}
        <section className="mb-8">
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-on-surface">Reading &amp; Sending Preferences</h3>
              <p className="text-body-md text-on-surface-variant">Customize how AI interacts with your workflow</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-body-lg font-semibold text-on-surface block mb-1">Inbox Scanning Frequency</label>
                  <p className="text-body-md text-on-surface-variant">How often should AI check for new priority emails?</p>
                </div>
                <div className="relative min-w-[200px]">
                  <select className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer pr-10">
                    <option>Real-time</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option defaultValue>Every hour</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/50">
                <div className="flex-1">
                  <label className="text-body-lg font-semibold text-on-surface block mb-1">Auto-Schedule Drafts</label>
                  <p className="text-body-md text-on-surface-variant">Enable AI to automatically queue drafts for approval</p>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-start">
                  <span className="text-body-md font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20">09:00 AM - 05:00 PM</span>
                  <Toggle on={true} />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/50">
                <div className="flex-1">
                  <label className="text-body-lg font-semibold text-on-surface block mb-1">Categorization Engine</label>
                  <p className="text-body-md text-on-surface-variant">Let AI automatically label incoming mail</p>
                </div>
                <div className="flex justify-end">
                  <Toggle on={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: AI Personalization */}
        <section className="mb-8">
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-on-surface">AI Personalization</h3>
              <p className="text-body-md text-on-surface-variant">Train the assistant to sound exactly like you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-body-lg font-semibold text-on-surface block">Default Writing Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {TONES.map(t => {
                    const ToneIcon = t.icon
                    const isSelected = tone === t.value
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-2 border-primary bg-primary/5 text-primary font-bold shadow-sm'
                            : 'border border-outline-variant/60 text-on-surface-variant hover:border-primary/60 bg-transparent'
                        }`}
                      >
                        <ToneIcon className={`w-5 h-5 ${isSelected ? 'stroke-[2.5px]' : ''}`} />
                        <span className="text-body-md font-medium">{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-body-lg font-semibold text-on-surface block">Primary Language</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer pr-10">
                      <option>English (United States)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                      <option>German (DE)</option>
                      <option>Japanese (JP)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="text-body-lg font-semibold text-on-surface block mb-1">AI Context Training</label>
                  <p className="text-body-sm text-on-surface-variant mb-3">Upload your past sent emails to improve tone matching accuracy.</p>
                  <button className="w-full py-3 border border-dashed border-primary text-primary rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all duration-200 cursor-pointer bg-transparent font-semibold">
                    <Upload className="w-4 h-4" />
                    Upload Sent History
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/50">
              <label className="text-body-lg font-semibold text-on-surface block mb-2">AI-Generated Signature</label>
              <textarea
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-all"
                placeholder={"Best regards,\nAlex Rivera\nHead of Product"}
                rows={4}
                defaultValue={"Best regards,\nAlex Rivera\nHead of Product at ReplyAssist AI"}
              />
              <p className="text-body-sm text-on-surface-variant mt-2 italic">This signature will be appended to all AI-generated drafts.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 border-t border-outline-variant/50 flex flex-col items-center justify-center gap-2 text-on-surface-variant text-body-sm mt-12">
          <div className="flex gap-6 mb-2 font-medium">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
          </div>
          <p>© 2026 Email Reply Assistance. Powered by Advanced AI.</p>
        </footer>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[280px] bg-white/90 backdrop-blur-md border-t border-outline-variant/60 p-4 flex items-center justify-center z-40">
        <div className="max-w-4xl w-full flex justify-end gap-4">
          <button className="px-6 py-2.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border-none bg-transparent font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={`px-8 py-2.5 rounded-full text-white font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none flex items-center gap-2 ${
              saveState === 'saved' ? 'bg-green-600' : 'bg-primary hover:shadow-lg shadow-primary/20'
            } disabled:opacity-70`}
          >
            {saveState === 'saving' && <RefreshCw className="w-4 h-4 animate-spin" />}
            {saveState === 'saved'  && <Check className="w-4 h-4" />}
            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
