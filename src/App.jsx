import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LiveSession from './pages/LiveSession'
import Summary from './pages/Summary'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/session" element={<LiveSession />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  )
}
