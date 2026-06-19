import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRouteGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <p className="text-sm text-muted">Checking session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
