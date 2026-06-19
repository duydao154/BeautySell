import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadShops() {
      setLoading(true)
      setError('')

      const { data, error: queryError } = await supabase
        .from('shops')
        .select('id, name, slug')
        .order('name')

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setShops([])
      } else {
        setShops(data ?? [])
      }

      setLoading(false)
    }

    loadShops()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="px-6 py-10">
      <h1 className="page-title">Shops</h1>
      <p className="page-subtitle">
        Browse available storefronts. In production, buyers usually arrive via a shop&apos;s direct
        link.
      </p>

      {loading && <p className="mt-8 text-sm text-muted">Loading shops…</p>}

      {error && (
        <div role="alert" className="alert-error mt-8">
          {error}
        </div>
      )}

      {!loading && !error && shops.length === 0 && (
        <p className="mt-8 text-sm text-muted">No shops available yet.</p>
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
