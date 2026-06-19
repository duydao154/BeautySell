import { Link, Outlet } from 'react-router-dom'
import CartLink from '../components/CartLink'

export default function ShopLayout() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="page-header flex items-center justify-between px-6 py-4">
        <Link to="/" className="brand-label">
          Product Store
        </Link>
        <CartLink />
      </header>
      <Outlet />
    </div>
  )
}
