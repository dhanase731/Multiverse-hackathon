import Sidebar from './Sidebar'
import TopAppBar from './TopAppBar'

export default function AppShell({ children, searchPlaceholder }) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopAppBar placeholder={searchPlaceholder} />
      <Sidebar />

      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}
