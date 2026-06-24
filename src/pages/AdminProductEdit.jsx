import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '@/components/product-form/ProductForm'
import { fetchProductById } from '@/utils/products'

export default function AdminProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchProductById(id)
        if (!cancelled) setProduct(data)
      } catch (queryError) {
        if (!cancelled) {
          setError(queryError.message)
          setProduct(null)
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <p className="text-sm text-muted">Loading product…</p>
  }

  if (error || !product) {
    return (
      <div>
        <Link to="/admin/products" className="link text-sm">
          ← Back to products
        </Link>
        <p className="field-error mt-4">{error || 'Product not found.'}</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        ← Back to products
      </Link>
      <h1 className="page-title mt-2">Edit Product</h1>
      <div className="mt-6">
        <ProductForm product={product} onSaved={() => navigate('/admin/products')} />
      </div>
    </div>
  )
}
