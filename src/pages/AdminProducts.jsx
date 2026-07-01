import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/products/ProductsTable'
import { useI18n } from '@/i18n/useI18n'
import { deleteProduct, fetchAdminProducts } from '@/utils/products'

export default function AdminProducts() {
  const { t, mapError } = useI18n()
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
          setError(mapError(queryError))
          setProducts([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadProducts()
  }, [mapError])

  async function handleDelete(product) {
    if (!window.confirm(t('admin.deleteProductConfirm', { name: product.name }))) {
      return
    }

    setDeletingId(product.id)

    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (deleteError) {
      setError(mapError(deleteError))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">{t('admin.loadingProducts')}</p>
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title">{t('nav.products')}</h1>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/import" className="btn btn-outline">
            {t('admin.bulkImportTitle')}
          </Link>
          <Link to="/admin/products/new" className="btn btn-primary">
            {t('admin.addProduct')}
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-muted">{t('admin.noProducts')}</p>
      ) : (
        <ProductsTable products={products} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
