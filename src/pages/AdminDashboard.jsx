import { Link } from 'react-router-dom'
import { useShop } from '@/hooks/useShop'

export default function AdminDashboard() {
  const { shop } = useShop()

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Managing {shop.name} ({shop.slug})
      </p>
      <div className="mt-6 flex gap-4">
        <Link to="/admin/products" className="card card-link px-4 py-3 text-sm font-medium">
          Manage products
        </Link>
        <Link to="/admin/products/import" className="card card-link px-4 py-3 text-sm font-medium">
          Bulk import
        </Link>
        <Link to="/admin/orders" className="card card-link px-4 py-3 text-sm font-medium">
          Orders
        </Link>
        <Link to="/admin/categories" className="card card-link px-4 py-3 text-sm font-medium">
          Manage categories
        </Link>
      </div>
    </div>
  )
}
