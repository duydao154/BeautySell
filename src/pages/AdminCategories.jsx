import { useEffect, useState } from 'react'
import CategoryList from '@/components/categories/CategoryList'
import { useShop } from '@/hooks/useShop'
import { deleteCategory, fetchCategoriesByShopId } from '@/utils/categories'

export default function AdminCategories() {
  const { shopId } = useShop()
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
          setError(queryError.message)
          setCategories([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [shopId])

  async function handleDelete(category) {
    if (
      !window.confirm(
        `Delete "${category.name}"? Products in this category will be left without a category.`,
      )
    ) {
      return
    }

    setDeletingId(category.id)

    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading categories…</p>
  }

  return (
    <div>
      <h1 className="page-title">Manage Categories</h1>
      <p className="page-subtitle">
        Deleting a category only removes the tag from products — it does not delete the products
        themselves.
      </p>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-sm text-muted">No categories yet. You can add one when editing a product.</p>
      ) : (
        <CategoryList categories={categories} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
