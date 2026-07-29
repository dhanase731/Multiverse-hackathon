import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Inbox, 
  Layers, 
  RefreshCw, 
  History, 
  Settings, 
  Mail, 
  Brain, 
  Network, 
  Lock 
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',          path: '/dashboard' },
  { icon: Inbox,           label: 'Inbox',             path: '/inbox' },
  { icon: Layers,          label: 'Automation Queue',  path: '/queue' },
  { icon: RefreshCw,       label: 'Processing',        path: '/processing' },
  { icon: History,         label: 'History',           path: '/history' },
  { icon: Settings,        label: 'Settings',          path: '/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="layout-sidebar border-r border-outline-variant bg-surface-container-low flex flex-col py-md z-50">
      <div className="px-md mb-lg">
        <div 
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 mb-sm rounded-xl bg-primary flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Lock className="text-white w-6 h-6" />
        </div>
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary">Control Center</h1>
        <p className="text-label-lg font-label-lg text-on-surface-variant">AI Email Automation</p>
      </div>

      <nav className="flex-1 space-y-xs overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.path
          const IconComponent = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-[calc(100%-16px)] flex items-center gap-sm rounded-lg px-md py-sm mx-sm text-left transition-all duration-200 cursor-pointer border-none ${
                active
                  ? 'bg-primary-container text-on-primary-container opacity-90 shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest bg-transparent'
              }`}
            >
              <IconComponent className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
              <span className="font-label-lg">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-md mt-auto pt-md border-t border-outline-variant pb-md">
        <button className="w-full bg-primary text-on-primary font-label-lg py-sm rounded-full mb-lg hover:shadow-lg transition-all cursor-pointer border-none font-semibold">
          New Workflow
        </button>
        <div className="space-y-sm">
          {[
            { icon: Mail,       label: 'Gmail Connected', color: 'text-green-600' },
            { icon: Brain,      label: 'AI System Ready', color: 'text-purple-600' },
            { icon: Network,    label: 'n8n Active', color: 'text-blue-600' },
          ].map(s => {
            const StatusIcon = s.icon
            return (
              <div key={s.label} className="flex items-center gap-sm text-on-surface-variant">
                <StatusIcon className={`w-4 h-4 ${s.color}`} />
                <span className="text-label-md font-medium">{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
