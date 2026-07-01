import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import { fetchAllShops } from '@/utils/shops'

export default function Home() {
  const { t, mapError } = useI18n()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadShops() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAllShops()
        if (!cancelled) setShops(data)
      } catch (queryError) {
        if (!cancelled) {
          setError(mapError(queryError))
          setShops([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadShops()
  }, [mapError])

  return (
    <div className="px-6 py-10">
      <h1 className="page-title">{t('home.title')}</h1>
      <p className="page-subtitle">{t('home.subtitle')}</p>

      {loading && <p className="mt-8 text-sm text-muted">{t('home.loading')}</p>}

      {error && (
        <div role="alert" className="alert-error mt-8">
          {error}
        </div>
      )}

      {!loading && !error && shops.length === 0 && (
        <p className="mt-8 text-sm text-muted">{t('home.empty')}</p>
      )}

      {!loading && !error && shops.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <li key={shop.id}>
              <Link to={`/shop/${shop.slug}`} className="card card-link p-5">
                <h2 className="text-lg font-medium">{shop.name}</h2>
                <p className="mt-1 text-sm text-muted">/{shop.slug}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
