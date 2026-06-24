import { useEffect, useMemo, useState } from 'react'
import { ShopContext } from '@/context/shopContext'
import { useAuth } from '@/hooks/useAuth'
import { fetchShopByOwnerId } from '@/utils/shops'

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

      try {
        const data = await fetchShopByOwnerId(user.id)
        if (!cancelled) setShop(data)
      } catch (queryError) {
        if (!cancelled) {
          setShop(null)
          setError(queryError.message)
        }
      }

      if (!cancelled) setLoading(false)
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
