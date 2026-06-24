import { useCallback, useEffect, useState } from 'react'
import { createCategory as createCategoryRecord, fetchCategoriesByShopId } from '@/utils/categories'

export function useCategories(shopId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCategories = useCallback(async () => {
    if (!shopId) {
      setCategories([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await fetchCategoriesByShopId(shopId)
      setCategories(data)
    } catch (queryError) {
      setError(queryError.message)
      setCategories([])
    }

    setLoading(false)
  }, [shopId])

  useEffect(() => {
    let cancelled = false

    async function run() {
      await loadCategories()
      if (cancelled) return
    }

    run()

    return () => {
      cancelled = true
    }
  }, [loadCategories])

  async function createCategory(name) {
    const data = await createCategoryRecord(shopId, name)

    setCategories((current) =>
      [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
    )

    return data
  }

  return { categories, loading, error, loadCategories, createCategory }
}
