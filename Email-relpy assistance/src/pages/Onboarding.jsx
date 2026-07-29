import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const steps = [
  { id: 1, label: 'Connect Gmail', desc: 'Link your Google account to start reading emails' },
  { id: 2, label: 'Configure AI', desc: 'Set your tone, language and reply preferences' },
  { id: 3, label: 'Set Schedule', desc: 'Choose when the AI checks and replies to emails' },
  { id: 4, label: 'Go Live', desc: 'Activate your AI email assistant' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  const next = () => {
    if (current < steps.length - 1) setCurrent(c => c + 1)
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen grid grid-cols-2 bg-background text-on-background">
      {/* Left panel - visual/info */}
      <div className="bg-primary/5 border-r border-primary/10 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-primary/5 border-primary/20">
            <div className="w-2 h-2 rounded-full animate-breath bg-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-primary whitespace-nowrap">Building your AI Workspace</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-on-surface leading-tight mb-4">Let's get<br />you set up</h1>
            <p className="text-base text-on-surface-variant">Complete these steps to activate your AI email assistant</p>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs text-on-surface-variant mb-2">
              <span>Progress</span>
              <span>{Math.round(((current + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-surface-container-highest">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((current + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - steps */}
      <div className="flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          {/* Steps */}
          <div className="space-y-4 mb-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: i > current ? 0.45 : 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${
                  i < current
                    ? 'bg-primary/5 border-primary/30'
                    : i === current
                      ? 'bg-surface-container-lowest border-primary shadow-lg shadow-primary/10'
                      : 'bg-surface-container-lowest border-outline-variant'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < current
                      ? 'bg-primary text-white'
                      : i === current
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                  }`}
                >
                  {i < current ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    <span className="text-base font-bold">{step.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-base ${i <= current ? 'text-on-surface' : 'text-on-surface-variant'}`}>{step.label}</p>
                  <p className="text-sm mt-0.5 text-on-surface-variant">{step.desc}</p>
                </div>
                {i === current && <div className="w-2.5 h-2.5 rounded-full animate-breath bg-primary flex-shrink-0" />}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={next}
            className="w-full py-4 rounded-2xl font-semibold text-base hover:opacity-90 bg-primary text-white transition-opacity cursor-pointer border-none"
          >
            {current < steps.length - 1 ? `Complete: ${steps[current].label}` : 'Launch Workspace →'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
