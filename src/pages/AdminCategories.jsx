import { useEffect, useState } from 'react'
import CategoryList from '@/components/categories/CategoryList'
import { useShop } from '@/hooks/useShop'
import { useI18n } from '@/i18n/useI18n'
import { deleteCategory, fetchCategoriesByShopId } from '@/utils/categories'

export default function AdminCategories() {
  const { shopId } = useShop()
  const { t, mapError } = useI18n()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      if (!shopId) return

      setLoading(true)
      setError('')

      try {
        const data = await fetchCategoriesByShopId(shopId)
        if (!cancelled) setCategories(data)
      } catch (queryError) {
        if (!cancelled) {
          setError(mapError(queryError))
          setCategories([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadCategories()
  }, [shopId, mapError])

  async function handleDelete(category) {
    if (!window.confirm(t('admin.deleteCategoryConfirm', { name: category.name }))) {
      return
    }

    setDeletingId(category.id)

    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (deleteError) {
      setError(mapError(deleteError))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">{t('admin.loadingCategories')}</p>
  }

  return (
    <div>
      <h1 className="page-title">{t('admin.categoriesTitle')}</h1>
      <p className="page-subtitle">{t('admin.categoriesSubtitle')}</p>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-sm text-muted">{t('admin.noCategories')}</p>
      ) : (
        <CategoryList categories={categories} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
