import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/products/ProductsTable'
import { deleteProduct, fetchAdminProducts } from '@/utils/products'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAdminProducts()
        if (!cancelled) setProducts(data)
      } catch (queryError) {
        if (!cancelled) {
          setError(queryError.message)
          setProducts([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(product.id)

    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading products…</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="page-title">Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-muted">No products yet.</p>
      ) : (
        <ProductsTable products={products} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
