import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useShop } from '../hooks/useShop'

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

      const { data, error: queryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('shop_id', shopId)
        .order('name')

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setCategories([])
      } else {
        setCategories(data ?? [])
      }

      setLoading(false)
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

    const { error: deleteError } = await supabase.from('categories').delete().eq('id', category.id)

    setDeletingId(null)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setCategories((current) => current.filter((item) => item.id !== category.id))
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
        <ul className="mt-6 divide-y divide-[var(--color-border)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="font-medium">{category.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(category)}
                disabled={deletingId === category.id}
                className="text-danger-btn text-sm"
              >
                {deletingId === category.id ? 'Deleting…' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
