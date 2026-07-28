import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Logo() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/signin'), 2800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 bg-primary-container" />
          <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl bg-primary-container">
            <span className="material-symbols-outlined text-white text-[48px]">mail_lock</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline-lg">Reply Smarter</h1>
          <p className="text-lg font-semibold mt-1 text-primary">AI</p>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
          className="h-0.5 rounded-full bg-primary"
        />
        <p className="text-sm text-on-surface-variant">Intelligent email automation</p>
      </motion.div>
    </div>
  )
}
