import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import CategoryFilterChips from '@/components/storefront/CategoryFilterChips'
import ProductCard from '@/components/products/ProductCard'
import { fetchPublicProductsByShopSlug } from '@/utils/products'
import { fetchShopBySlug } from '@/utils/shops'
import { deriveProductCategories, filterProductsByCategory } from '@/utils/storefrontCategories'

export default function ShopStorefront() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
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

      try {
        const shopData = await fetchShopBySlug(slug)
        if (cancelled) return

        if (!shopData) {
          setLoading(false)
          return
        }

        setShop(shopData)

        const productData = await fetchPublicProductsByShopSlug(slug)
        if (!cancelled) setProducts(productData)
      } catch (queryError) {
        if (!cancelled) setError(queryError.message)
      }

      if (!cancelled) setLoading(false)
    }

    loadStorefront()

    return () => {
      cancelled = true
    }
  }, [slug])

  const categories = useMemo(() => deriveProductCategories(products), [products])

  const categoryParam = searchParams.get('category')

  const selectedCategory = useMemo(() => {
    if (!categoryParam) return 'all'
    if (categories.length > 0 && !categories.includes(categoryParam)) return 'all'
    return categoryParam
  }, [categoryParam, categories])

  useEffect(() => {
    if (!categoryParam) return
    if (categories.length > 0 && !categories.includes(categoryParam)) {
      setSearchParams({}, { replace: true })
    }
  }, [categoryParam, categories, setSearchParams])

  const visibleProducts = useMemo(
    () => filterProductsByCategory(products, selectedCategory),
    [products, selectedCategory],
  )

  function handleCategorySelect(category) {
    if (category === 'all') {
      setSearchParams({}, { replace: true })
      return
    }

    setSearchParams({ category }, { replace: true })
  }

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
        <>
          <div className="mt-6">
            <CategoryFilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>

          {visibleProducts.length === 0 ? (
            <p className="mt-8 text-sm text-muted">No products in this category.</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} shopSlug={slug} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
