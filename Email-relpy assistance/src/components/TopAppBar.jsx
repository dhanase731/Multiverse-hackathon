import { Lock, Search, Bell, HelpCircle, User } from 'lucide-react'

export default function TopAppBar({ placeholder = 'Search automation logs...' }) {
  return (
    <header className="layout-header bg-surface border-b border-outline-variant flex items-center justify-between px-md max-w-full">
      <div className="flex items-center gap-sm">
        <Lock className="text-primary w-5 h-5" />
        <span className="text-headline-sm font-headline-sm font-bold text-primary">Email Reply Assistance</span>
      </div>

      <div className="hidden md:flex items-center bg-surface-container-low px-md py-xs rounded-full border border-outline-variant w-96">
        <Search className="text-on-surface-variant w-4 h-4 mr-xs" />
        <input
          className="bg-transparent border-none focus:ring-0 text-body-md w-full focus:outline-none"
          placeholder={placeholder}
          type="text"
        />
      </div>

      <div className="flex items-center gap-sm">
        <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer border-none bg-transparent flex items-center justify-center">
          <Bell className="text-on-surface-variant w-5 h-5" />
        </button>
        <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer border-none bg-transparent flex items-center justify-center">
          <HelpCircle className="text-on-surface-variant w-5 h-5" />
        </button>
        <button className="hover:bg-surface-container-high rounded-full p-2 transition-all duration-150 ease-in-out cursor-pointer border-none bg-transparent flex items-center justify-center">
          <User className="text-on-surface-variant w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
