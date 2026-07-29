import { useState } from 'react'
import Layout from '../components/Layout'

const toneOptions = [
  { value: 'professional', icon: 'work', label: 'Professional' },
  { value: 'casual', icon: 'sentiment_satisfied', label: 'Casual' },
  { value: 'concise', icon: 'bolt', label: 'Concise' },
  { value: 'detailed', icon: 'edit_note', label: 'Detailed' },
]

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 cursor-pointer border-none ${
        value ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
          value ? 'left-[24px]' : 'left-[4px]'
        }`}
      />
    </button>
  )
}

export default function WorkspaceSettings() {
  const [tone, setTone] = useState('professional')
  const [autoSchedule, setAutoSchedule] = useState(true)
  const [categorization, setCategorization] = useState(false)
  const [language, setLanguage] = useState('English (United States)')
  const [frequency, setFrequency] = useState('Every hour')
  const [signature, setSignature] = useState('Best regards,\nAlex Rivera\nHead of Product at ReplyAssist AI')
  const [saveState, setSaveState] = useState('idle')

  const handleSave = () => {
    setSaveState('saving')
    setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    }, 1500)
  }

  return (
    <Layout>
      <div className="p-6 pb-28">
        <div className="max-w-[896px] mx-auto space-y-6">

          {/* Section 1: Connected Gmail */}
          <section>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm hover:scale-[1.005] hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                  <span className="material-symbols-outlined text-[#dc2626]">mail</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">Connected Account</h3>
                  <p className="text-sm text-on-surface-variant">Manage your email service integration</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-outline-variant p-4 bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-outline-variant bg-white">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-on-surface">alex.rivera@gmail.com</p>
                    <p className="text-xs font-semibold tracking-wider text-on-surface-variant">Last synced: 4 minutes ago</p>
                  </div>
                </div>
                <button className="rounded-lg border border-error text-error px-4 py-2 text-xs font-semibold tracking-wider hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent">
                  Disconnect
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Preferences */}
          <section>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm hover:scale-[1.005] hover:shadow-md transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-on-surface">Reading &amp; Sending Preferences</h3>
                <p className="text-sm text-on-surface-variant">Customize how AI interacts with your workflow</p>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 text-base text-on-surface font-medium">Inbox Scanning Frequency</label>
                    <p className="text-xs font-semibold tracking-wider text-on-surface-variant">How often should AI check for new priority emails?</p>
                  </div>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    className="rounded-lg border border-outline-variant outline-none p-2 bg-surface-container-low text-on-surface text-sm min-w-[180px]"
                  >
                    <option>Real-time</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant">
                  <div className="flex-1">
                    <label className="block mb-1 text-base text-on-surface font-medium">Auto-Schedule Drafts</label>
                    <p className="text-xs font-semibold tracking-wider text-on-surface-variant">Enable AI to automatically queue drafts for approval</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-primary tracking-wider">09:00 AM - 05:00 PM</span>
                    <Toggle value={autoSchedule} onChange={setAutoSchedule} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant">
                  <div className="flex-1">
                    <label className="block mb-1 text-base text-on-surface font-medium">Categorization Engine</label>
                    <p className="text-xs font-semibold tracking-wider text-on-surface-variant">Let AI automatically label incoming mail</p>
                  </div>
                  <Toggle value={categorization} onChange={setCategorization} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: AI Personalization */}
          <section>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm hover:scale-[1.005] hover:shadow-md transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-on-surface">AI Personalization</h3>
                <p className="text-sm text-on-surface-variant">Train the assistant to sound exactly like you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-base text-on-surface font-medium">Default Writing Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map(opt => {
                      const isSelected = tone === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setTone(opt.value)}
                          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold'
                              : 'border-outline-variant text-on-surface-variant bg-transparent hover:border-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                          <span className="text-[11px] font-semibold tracking-wider">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-base text-on-surface font-medium">Primary Language</label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant outline-none p-3 text-sm bg-surface-container-low text-on-surface"
                  >
                    <option>English (United States)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                    <option>German (DE)</option>
                    <option>Japanese (JP)</option>
                  </select>
                  <div className="pt-4">
                    <label className="block text-base text-on-surface font-medium">AI Context Training</label>
                    <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant mb-2">
                      Upload or link your past 50 sent emails to improve tone matching.
                    </p>
                    <button className="w-full rounded-lg flex items-center justify-center gap-2 p-2 border border-dashed border-primary text-primary text-sm hover:bg-primary/5 transition-colors cursor-pointer bg-transparent">
                      <span className="material-symbols-outlined text-[20px]">upload</span>
                      Upload Sent History
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant">
                <label className="block mb-2 text-base text-on-surface font-medium">AI-Generated Signature</label>
                <textarea
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  rows={4}
                  placeholder={'Best regards,\nAlex Rivera\nHead of Product'}
                  className="w-full rounded-lg border border-outline-variant outline-none resize-none p-4 text-sm bg-surface-container-low text-on-surface"
                />
                <p className="italic mt-2 text-[11px] font-semibold tracking-wider text-on-surface-variant">
                  This signature will be appended to all AI-generated drafts.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-center border-t border-outline-variant py-6 text-[11px] font-semibold tracking-wider text-on-surface-variant gap-2">
            <div className="flex gap-4 mb-2">
              {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(link => (
                <a key={link} href="#" className="transition-colors hover:underline text-on-surface-variant hover:text-primary no-underline">
                  {link}
                </a>
              ))}
            </div>
            <p>© 2024 Email Reply Assistance. Powered by Advanced AI.</p>
          </footer>

        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[280px] flex items-center justify-center border-t z-40 bg-white/80 backdrop-blur-md border-outline-variant py-4">
        <div className="flex justify-end gap-4 max-w-[896px] w-full px-6">
          <button className="transition-colors px-8 py-3 text-on-surface-variant hover:text-on-surface text-lg font-medium bg-transparent border-none cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={`flex items-center gap-2 rounded-full px-12 py-3 text-on-primary text-lg font-medium shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none ${
              saveState === 'saved' ? 'bg-[#16a34a]' : 'bg-primary shadow-primary/30'
            }`}
          >
            {saveState === 'saving' && (
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            )}
            {saveState === 'saved' && (
              <span className="material-symbols-outlined text-[18px]">check</span>
            )}
            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
