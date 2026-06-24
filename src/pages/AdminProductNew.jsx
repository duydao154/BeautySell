import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '@/components/product-form/ProductForm'

export default function AdminProductNew() {
  const navigate = useNavigate()

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        ← Back to products
      </Link>
      <h1 className="page-title mt-2">Add Product</h1>
      <div className="mt-6">
        <ProductForm onSaved={() => navigate('/admin/products')} />
      </div>
    </div>
  )
}
