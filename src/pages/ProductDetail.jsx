import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/format'
import { fetchPublicProduct } from '@/utils/products'
import { fetchShopIdBySlug } from '@/utils/shops'
import { getProductImageUrl } from '@/utils/storage'

export default function ProductDetail() {
  const { slug, productId } = useParams()
  const [product, setProduct] = useState(null)
  const [shopId, setShopId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')
      setProduct(null)
      setShopId(null)

      try {
        const [productData, resolvedShopId] = await Promise.all([
          fetchPublicProduct(slug, productId),
          fetchShopIdBySlug(slug),
        ])

        if (cancelled) return

        setProduct(productData)
        setShopId(resolvedShopId)
      } catch (queryError) {
        if (!cancelled) setError(queryError.message)
      }

      if (!cancelled) setLoading(false)
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [slug, productId])

  if (loading) {
    return (
      <div className="px-6 py-10">
        <p className="text-sm text-muted">Loading product…</p>
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

  if (!product) {
    return (
      <div className="px-6 py-10">
        <h1 className="page-title">Product not found</h1>
        <Link to={`/shop/${slug}`} className="link mt-4 inline-block text-sm">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const isSoldOut = product.status === 'sold_out'
  const imageUrl = getProductImageUrl(product.image_url)

  function handleAddToCart() {
    if (!shopId) return

    addItem({
      productId: product.id,
      shopId,
      shopSlug: slug,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
  }

  return (
    <div className="px-6 py-10">
      <Link to={`/shop/${slug}`} className="link text-sm">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="card relative aspect-square w-full shrink-0 overflow-hidden p-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`h-full w-full object-cover ${isSoldOut ? 'card-muted' : ''}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>
          )}
          {isSoldOut && (
            <span className="badge badge-sold-out absolute left-4 top-4">Sold Out</span>
          )}
        </div>

        <div className="flex min-h-0 flex-col lg:aspect-square lg:overflow-hidden">
          <h1 className="page-title">{product.name}</h1>
          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>

          {isSoldOut && (
            <p className="mt-3 text-sm font-medium text-muted">This item is currently sold out.</p>
          )}

          {product.description && (
            <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end gap-4 pt-6">
            {product.external_link && (
              <a
                href={product.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-sm"
              >
                View original listing ↗
              </a>
            )}

            <button
              type="button"
              disabled={isSoldOut || !shopId}
              onClick={handleAddToCart}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
