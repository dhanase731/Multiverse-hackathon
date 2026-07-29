import { useNavigate, useLocation } from 'react-router-dom'

const ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Home' },
  { path: '/queue',     icon: 'queue',     label: 'Queue' },
  { path: '/processing',icon: 'sync',      label: 'Active' },
  { path: '/settings',  icon: 'settings',  label: 'Settings' },
]

export default function MobileNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex items-center justify-around h-16 z-50">
      {ITEMS.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent ${
            pathname === item.path ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: pathname === item.path ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-label-lg">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
