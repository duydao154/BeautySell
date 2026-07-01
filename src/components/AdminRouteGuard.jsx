import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/i18n/useI18n'

export default function AdminRouteGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <p className="text-sm text-muted">{t('admin.checkingSession')}</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
