import { Routes, Route, Navigate } from 'react-router-dom'
import Logo from './pages/Logo.jsx'
import GoogleSignIn from './pages/GoogleSignIn.jsx'
import Onboarding from './pages/Onboarding.jsx'
import OnboardingSetup from './pages/OnboardingSetup.jsx'
import LandingPage from './pages/LandingPage.jsx'
import WorkspaceAIDrafts from './pages/WorkspaceAIDrafts.jsx'
import WorkspaceSettings from './pages/WorkspaceSettings.jsx'
import WorkspaceReplyHistory from './pages/WorkspaceReplyHistory.jsx'
import AutomationHistory from './pages/AutomationHistory.jsx'
import AutomationDetails from './pages/AutomationDetails.jsx'
import UnifiedWorkspace from './pages/UnifiedWorkspace.jsx'
import DesignSystem from './pages/DesignSystem.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Logo />} />
      <Route path="/signin" element={<GoogleSignIn />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/onboarding/setup" element={<OnboardingSetup />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/workspace" element={<WorkspaceAIDrafts />} />
      <Route path="/workspace/settings" element={<WorkspaceSettings />} />
      <Route path="/workspace/reply-history" element={<WorkspaceReplyHistory />} />
      <Route path="/history" element={<AutomationHistory />} />
      <Route path="/automation/:id" element={<AutomationDetails />} />
      <Route path="/queue" element={<UnifiedWorkspace />} />
      <Route path="/design" element={<DesignSystem />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
