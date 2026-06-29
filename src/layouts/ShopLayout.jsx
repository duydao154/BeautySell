import { Link, Outlet } from 'react-router-dom'
import CartLink from '@/components/ui/CartLink'
import CurrencySelect from '@/components/ui/CurrencySelect'

export default function ShopLayout() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="page-header flex items-center gap-4 px-6 py-4">
        <Link to="/" className="brand-label">
          Product Store
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <CurrencySelect />
          <CartLink />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
