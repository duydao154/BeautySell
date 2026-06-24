import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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

    const { data, error: queryError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('shop_id', shopId)
      .order('name')

    if (queryError) {
      setError(queryError.message)
      setCategories([])
    } else {
      setCategories(data ?? [])
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
    const { data, error: insertError } = await supabase
      .from('categories')
      .insert({ name: name.trim(), shop_id: shopId })
      .select('id, name')
      .single()

    if (insertError) throw insertError

    setCategories((current) =>
      [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
    )

    return data
  }

  return { categories, loading, error, loadCategories, createCategory }
}
