import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function formatPrice(price) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(price)
}

function StatusBadge({ status }) {
  const isAvailable = status === 'available'

  return (
    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-sold-out'}`}>
      {isAvailable ? 'Available' : 'Sold out'}
    </span>
  )
}

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

      const { data, error: queryError } = await supabase
        .from('products')
        .select('id, name, price, quantity, status')
        .order('name')

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setProducts([])
      } else {
        setProducts(data ?? [])
      }

      setLoading(false)
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

    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)

    setDeletingId(null)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setProducts((current) => current.filter((item) => item.id !== product.id))
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
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium">{product.name}</td>
                  <td className="text-muted">{formatPrice(product.price)}</td>
                  <td className="text-muted">{product.quantity}</td>
                  <td>
                    <StatusBadge status={product.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/admin/products/${product.id}/edit`} className="link text-sm">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className="text-danger-btn ml-4"
                    >
                      {deletingId === product.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
