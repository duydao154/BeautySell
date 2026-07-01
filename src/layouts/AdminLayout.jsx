import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import LanguageSelect from '@/components/ui/LanguageSelect'
import { ShopProvider } from '@/context/ShopProvider'
import { useAuth } from '@/hooks/useAuth'
import { useShop } from '@/hooks/useShop'
import { useI18n } from '@/i18n/useI18n'
import { signOut } from '@/utils/auth'

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`

export default function AdminLayout() {
  return (
    <ShopProvider>
      <AdminLayoutShell />
    </ShopProvider>
  )
}

function AdminLayoutShell() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { shop, loading, error } = useShop()
  const { t, mapError } = useI18n()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-[60vh]">
      <header className="page-header px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="brand-label">{t('app.admin')}</p>
            {shop ? (
              <p className="mt-0.5 text-sm font-medium">{shop.name}</p>
            ) : (
              user?.email && <p className="mt-0.5 text-sm text-muted">{user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelect />
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn btn-outline"
            >
              {signingOut ? t('common.signingOut') : t('nav.signOut')}
            </button>
          </div>
        </div>

        {shop && (
          <nav className="mt-4 flex gap-6 border-t border-[var(--color-border)] pt-4">
            <NavLink to="/admin" end className={navLinkClass}>
              {t('nav.dashboard')}
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              {t('nav.products')}
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              {t('nav.orders')}
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass}>
              {t('nav.categories')}
            </NavLink>
          </nav>
        )}
      </header>

      <main className="px-6 py-8">
        {loading ? (
          <p className="text-sm text-muted">{t('admin.loadingShop')}</p>
        ) : error ? (
          <div role="alert" className="alert-error">
            {t('errors.failedLoadShop')} {mapError(error)}
          </div>
        ) : !shop ? (
          <div className="alert-info">{t('admin.noShop')}</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
