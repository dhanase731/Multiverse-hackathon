import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-primary text-[48px] animate-spin">sync</span>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
