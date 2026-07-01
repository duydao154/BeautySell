import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '@/components/product-form/ProductForm'
import { useI18n } from '@/i18n/useI18n'
import { fetchProductById } from '@/utils/products'

export default function AdminProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, mapError } = useI18n()
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
          setError(mapError(queryError))
          setProduct(null)
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadProduct()
  }, [id, mapError])

  if (loading) {
    return <p className="text-sm text-muted">{t('admin.loadingProduct')}</p>
  }

  if (error || !product) {
    return (
      <div>
        <Link to="/admin/products" className="link text-sm">
          {t('admin.backToProducts')}
        </Link>
        <p className="field-error mt-4">{error || t('product.notFoundAdmin')}</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        {t('admin.backToProducts')}
      </Link>
      <h1 className="page-title mt-2">{t('admin.editProduct')}</h1>
      <div className="mt-6">
        <ProductForm product={product} onSaved={() => navigate('/admin/products')} />
      </div>
    </div>
  )
}
