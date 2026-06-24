import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShopProvider } from '@/context/ShopProvider'
import { useAuth } from '@/hooks/useAuth'
import { useShop } from '@/hooks/useShop'
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
            <p className="brand-label">Admin</p>
            {shop ? (
              <p className="mt-0.5 text-sm font-medium">{shop.name}</p>
            ) : (
              user?.email && <p className="mt-0.5 text-sm text-muted">{user.email}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="btn btn-outline"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>

        {shop && (
          <nav className="mt-4 flex gap-6 border-t border-[var(--color-border)] pt-4">
            <NavLink to="/admin" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass}>
              Categories
            </NavLink>
          </nav>
        )}
      </header>

      <main className="px-6 py-8">
        {loading ? (
          <p className="text-sm text-muted">Loading shop…</p>
        ) : error ? (
          <div role="alert" className="alert-error">
            Failed to load shop: {error}
          </div>
        ) : !shop ? (
          <div className="alert-info">No shop has been set up for your account yet.</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
