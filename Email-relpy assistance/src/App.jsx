import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Public
import LoginPage      from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'

// Workspace
import DashboardPage  from './pages/DashboardPage.jsx'
import QueuePage      from './pages/QueuePage.jsx'
import HistoryPage    from './pages/HistoryPage.jsx'
import DraftsPage     from './pages/DraftsPage.jsx'
import SettingsPage   from './pages/SettingsPage.jsx'

// Legacy pages kept intact
import Inbox          from './pages/Inbox.jsx'
import Processing     from './pages/Processing.jsx'
import History        from './pages/History.jsx'
import Drafts         from './pages/Drafts.jsx'
import Settings       from './pages/Settings.jsx'
import AutomationDetails from './pages/AutomationDetails.jsx'

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Reconstructed workspace pages */}
      <Route path="/dashboard"  element={<P><DashboardPage /></P>} />
      <Route path="/queue"      element={<P><QueuePage /></P>} />
      <Route path="/history"    element={<P><HistoryPage /></P>} />
      <Route path="/drafts"     element={<P><DraftsPage /></P>} />
      <Route path="/settings"   element={<P><SettingsPage /></P>} />

      {/* Connected workspace pages */}
      <Route path="/inbox"      element={<P><Inbox /></P>} />
      <Route path="/processing" element={<P><Processing /></P>} />
      <Route path="/sent"       element={<P><History /></P>} />
      <Route path="/ai-drafts"  element={<P><Drafts /></P>} />
      <Route path="/preferences"element={<P><Settings /></P>} />

      <Route path="/automation/:id" element={<P><AutomationDetails /></P>} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
