import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getSettings, saveSettings } from '../services/settingsService'

const toneOptions = [
  { value: 'professional', icon: 'work',             label: 'Professional' },
  { value: 'casual',       icon: 'sentiment_satisfied', label: 'Casual' },
  { value: 'concise',      icon: 'bolt',             label: 'Concise' },
  { value: 'detailed',     icon: 'edit_note',        label: 'Detailed' },
]

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 cursor-pointer border-none ${value ? 'bg-primary' : 'bg-outline-variant'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-[24px]' : 'left-[4px]'}`} />
    </button>
  )
}

const DEFAULT = {
  tone: 'professional',
  autoSchedule: true,
  categorization: false,
  language: 'English (United States)',
  frequency: 'Every hour',
  autoReply: false,
  manualApproval: true,
  signature: '',
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const [settings, setSettings] = useState(DEFAULT)
  const [saveState, setSaveState] = useState('idle')

  useEffect(() => {
    if (!user?.sub) return
    getSettings(user.sub)
      .then(data => { if (data && !data.error) setSettings(s => ({ ...s, ...data })) })
      .catch(() => {})
  }, [user?.sub])

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const handleSave = async () => {
    setSaveState('saving')
    try {
      await saveSettings(user.sub, settings)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('idle')
    }
  }

  return (
    <Layout>
      <div className="p-6 pb-28">
        <div className="max-w-[896px] mx-auto space-y-6">

          {/* Connected Account */}
          <section className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Connected Account</h3>
            <div className="flex items-center justify-between rounded-lg border border-outline-variant p-4 bg-surface-container-low">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user?.name?.charAt(0) ?? 'U'}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-on-surface">{user?.email}</p>
                  <p className="text-xs text-on-surface-variant">Gmail Connected</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="rounded-lg border border-error text-error px-4 py-2 text-xs font-semibold hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent"
              >
                Disconnect
              </button>
            </div>
          </section>

          {/* Reply Mode */}
          <section className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Reply Mode</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">Automatic Reply</p>
                  <p className="text-xs text-on-surface-variant">AI sends replies without approval</p>
                </div>
                <Toggle value={settings.autoReply} onChange={v => set('autoReply', v)} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <div>
                  <p className="text-sm font-medium text-on-surface">Manual Approval</p>
                  <p className="text-xs text-on-surface-variant">Review drafts before sending</p>
                </div>
                <Toggle value={settings.manualApproval} onChange={v => set('manualApproval', v)} />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Reading &amp; Sending Preferences</h3>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-on-surface">Inbox Scanning Frequency</p>
                  <p className="text-xs text-on-surface-variant">How often AI checks for new emails</p>
                </div>
                <select
                  value={settings.frequency}
                  onChange={e => set('frequency', e.target.value)}
                  className="rounded-lg border border-outline-variant outline-none p-2 bg-surface-container-low text-on-surface text-sm min-w-[180px]"
                >
                  <option>Real-time</option>
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every hour</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <div>
                  <p className="text-sm font-medium text-on-surface">Auto-Schedule Drafts</p>
                  <p className="text-xs text-on-surface-variant">Queue drafts for approval automatically</p>
                </div>
                <Toggle value={settings.autoSchedule} onChange={v => set('autoSchedule', v)} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <div>
                  <p className="text-sm font-medium text-on-surface">Categorization Engine</p>
                  <p className="text-xs text-on-surface-variant">Auto-label incoming mail</p>
                </div>
                <Toggle value={settings.categorization} onChange={v => set('categorization', v)} />
              </div>
            </div>
          </section>

          {/* AI Personalization */}
          <section className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">AI Personalization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-on-surface mb-2">Default Writing Tone</p>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('tone', opt.value)}
                      className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                        settings.tone === opt.value
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant text-on-surface-variant bg-transparent hover:border-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                      <span className="text-[11px] font-semibold tracking-wider">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface mb-2">Primary Language</p>
                <select
                  value={settings.language}
                  onChange={e => set('language', e.target.value)}
                  className="w-full rounded-lg border border-outline-variant outline-none p-3 text-sm bg-surface-container-low text-on-surface"
                >
                  <option>English (United States)</option>
                  <option>Spanish (ES)</option>
                  <option>French (FR)</option>
                  <option>German (DE)</option>
                  <option>Japanese (JP)</option>
                </select>
                <div className="mt-4">
                  <p className="text-sm font-medium text-on-surface mb-1">AI Signature</p>
                  <textarea
                    value={settings.signature}
                    onChange={e => set('signature', e.target.value)}
                    rows={3}
                    placeholder="Best regards,&#10;Your Name"
                    className="w-full rounded-lg border border-outline-variant outline-none resize-none p-3 text-sm bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[280px] flex items-center justify-center border-t z-40 bg-white/80 backdrop-blur-md border-outline-variant py-4">
        <div className="flex justify-end gap-4 max-w-[896px] w-full px-6">
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={`flex items-center gap-2 rounded-full px-10 py-3 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none ${
              saveState === 'saved' ? 'bg-secondary' : 'bg-primary'
            } disabled:opacity-60`}
          >
            {saveState === 'saving' && <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
            {saveState === 'saved' && <span className="material-symbols-outlined text-[16px]">check</span>}
            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
