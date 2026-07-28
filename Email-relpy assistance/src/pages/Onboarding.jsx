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
    else navigate('/onboarding/setup')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background font-body-md text-on-background">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 bg-primary/5 border-primary/20">
            <div className="w-2 h-2 rounded-full animate-breath bg-primary" />
            <span className="text-xs font-semibold text-primary">Building your AI Workspace</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface font-headline-lg">Let's get you set up</h1>
          <p className="text-sm mt-2 text-on-surface-variant">Complete these steps to activate your AI email assistant</p>
        </motion.div>

        <div className="space-y-3 mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i > current ? 0.5 : 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                i < current 
                  ? 'bg-primary/5 border-primary/30' 
                  : i === current 
                    ? 'bg-surface-container-lowest border-primary shadow-lg shadow-primary/10' 
                    : 'bg-surface-container-lowest border-outline-variant'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < current 
                    ? 'bg-primary text-white' 
                    : i === current 
                      ? 'bg-primary/10 border-2 border-primary text-primary' 
                      : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                }`}
              >
                {i < current ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${i <= current ? 'text-on-surface' : 'text-on-surface-variant'}`}>{step.label}</p>
                <p className="text-xs mt-0.5 text-on-surface-variant">{step.desc}</p>
              </div>
              {i === current && <div className="w-2 h-2 rounded-full animate-breath bg-primary" />}
            </motion.div>
          ))}
        </div>

        <div className="h-1.5 rounded-full mb-6 overflow-hidden bg-surface-container-highest">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((current + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={next}
          className="w-full py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 bg-primary text-on-primary font-headline-md cursor-pointer border-none"
        >
          {current < steps.length - 1 ? `Complete: ${steps[current].label}` : 'Launch Workspace →'}
        </motion.button>
      </div>
    </div>
  )
}
