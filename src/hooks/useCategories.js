import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { createCategory as createCategoryRecord, fetchCategoriesByShopId } from '@/utils/categories'

export function useCategories(shopId) {
  const { mapError } = useI18n()
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
      setError(mapError(queryError))
      setCategories([])
    }

    setLoading(false)
  }, [shopId, mapError])

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
