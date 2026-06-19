import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { ShopContext } from './shopContext'

export function ShopProvider({ children }) {
  const { user } = useAuth()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchShop() {
      if (!user?.id) {
        if (!cancelled) {
          setShop(null)
          setLoading(false)
          setError(null)
        }
        return
      }

      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('shops')
        .select('id, name, slug, owner_id, created_at')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (cancelled) return

      if (queryError) {
        setShop(null)
        setError(queryError.message)
      } else {
        setShop(data)
      }

      setLoading(false)
    }

    fetchShop()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const value = useMemo(
    () => ({
      shop,
      shopId: shop?.id ?? null,
      loading,
      error,
    }),
    [shop, loading, error],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
