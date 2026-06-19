import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabaseClient'

export default function ShopStorefront() {
  const { slug } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadStorefront() {
      setLoading(true)
      setError('')
      setShop(null)
      setProducts([])

      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id, name, slug')
        .eq('slug', slug)
        .maybeSingle()

      if (cancelled) return

      if (shopError) {
        setError(shopError.message)
        setLoading(false)
        return
      }

      if (!shopData) {
        setLoading(false)
        return
      }

      setShop(shopData)

      const { data: productData, error: productError } = await supabase
        .from('products_public')
        .select('id, name, price, status, image_url, shop_slug')
        .eq('shop_slug', slug)
        .order('name')

      if (cancelled) return

      if (productError) {
        setError(productError.message)
      } else {
        setProducts(productData ?? [])
      }

      setLoading(false)
    }

    loadStorefront()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="px-6 py-10">
        <p className="text-sm text-muted">Loading shop…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-10">
        <div role="alert" className="alert-error">
          {error}
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="px-6 py-10">
        <h1 className="page-title">Shop not found</h1>
        <p className="page-subtitle">We couldn&apos;t find a shop at this address.</p>
        <Link to="/" className="link mt-4 inline-block text-sm">
          ← Back to shops
        </Link>
      </div>
    )
  }

  return (
    <div className="px-6 py-10">
      <Link to="/" className="link text-sm">
        ← All shops
      </Link>
      <h1 className="page-title mt-4">{shop.name}</h1>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">This shop doesn&apos;t have any products yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} shopSlug={slug} />
          ))}
        </div>
      )}
    </div>
  )
}
