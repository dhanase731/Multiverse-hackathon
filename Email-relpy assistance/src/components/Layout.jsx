import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'queue', label: 'Automation Queue', path: '/queue' },
  { icon: 'sync', label: 'Processing', path: '/workspace' },
  { icon: 'history', label: 'History', path: '/history' },
  { icon: 'send', label: 'Sent Emails', path: '/workspace/reply-history' },
  { icon: 'settings', label: 'Settings', path: '/workspace/settings' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      {/* Top App Bar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-md max-w-full">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-headline-sm">mail_lock</span>
          <span className="text-headline-sm font-headline-sm font-bold text-primary">Email Reply Assistance</span>
        </div>
        
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center bg-surface-container-low px-md py-xs rounded-full border border-outline-variant w-96">
          <span className="material-symbols-outlined text-on-surface-variant mr-xs">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-body-md w-full focus:outline-none" 
            placeholder="Search automation logs..." 
            type="text"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-sm">
          <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">help_outline</span>
          </button>
          <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop Only */}
      <aside className="w-[280px] h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface-container-low flex flex-col py-md hidden md:flex">
        {/* Brand/Logo */}
        <div className="px-md mb-lg">
          <img 
            alt="Logo" 
            className="w-12 h-12 mb-sm rounded-xl cursor-pointer" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLv2da-AtKovcsyyKdBQaNXoqqhSgyjUJ0_MVu-jR7m-QoJQ7f0STqS_7CIJkJFugKVur6UhB1g0JrE5qWIe2JfMpJ5h3oI0RGFbbzid40tQwkAODXUpFfEqwQMGgg20gPczdz6Y5pnr-BM9ReaKhdVDi3Bk_UnFX9OTtcPAZnVlrS9tBkJBlBekNA4N_EDZkTWtvyDKe9zKq3CGKGf79asPBTETZQfDxnNOY-4AE7qV4ZT_HtFKMa05MbM"
            onClick={() => navigate('/')}
          />
          <h1 className="text-headline-sm font-headline-sm font-bold text-primary">Control Center</h1>
          <p className="text-label-lg font-label-lg text-on-surface-variant">AI Email Automation</p>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-xs overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-[calc(100%-16px)] flex items-center gap-sm rounded-lg px-md py-sm mx-2 text-left transition-all duration-200 cursor-pointer ${
                  active 
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-lg">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-md mt-auto pt-md border-t border-outline-variant">
          <button className="w-full bg-primary text-on-primary font-label-lg py-sm rounded-full mb-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            New Workflow
          </button>
          <div className="space-y-sm">
            {[
              { icon: 'mail', label: 'Gmail Connected' },
              { icon: 'psychology', label: 'AI System Ready' },
              { icon: 'hub', label: 'n8n Active' },
            ].map(status => (
              <div key={status.label} className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">{status.icon}</span>
                <span className="text-label-md">{status.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pt-16 md:ml-[280px] min-h-screen pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <button className="fixed bottom-20 right-lg w-14 h-14 bg-primary-container text-on-primary-container rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 md:hidden cursor-pointer">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex items-center justify-around h-16 z-50">
        <button 
          onClick={() => navigate('/')} 
          className={`flex flex-col items-center gap-1 cursor-pointer ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span className="text-[10px] font-label-lg font-medium">Home</span>
        </button>
        <button 
          onClick={() => navigate('/queue')} 
          className={`flex flex-col items-center gap-1 cursor-pointer ${pathname === '/queue' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/queue' ? "'FILL' 1" : "'FILL' 0" }}>queue</span>
          <span className="text-[10px] font-label-lg font-medium">Queue</span>
        </button>
        <button 
          onClick={() => navigate('/workspace')} 
          className={`flex flex-col items-center gap-1 cursor-pointer ${pathname === '/workspace' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/workspace' ? "'FILL' 1" : "'FILL' 0" }}>sync</span>
          <span className="text-[10px] font-label-lg font-medium">Active</span>
        </button>
        <button 
          onClick={() => navigate('/workspace/settings')} 
          className={`flex flex-col items-center gap-1 cursor-pointer ${pathname === '/workspace/settings' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/workspace/settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          <span className="text-[10px] font-label-lg font-medium">Settings</span>
        </button>
      </nav>
    </div>
  )
}
