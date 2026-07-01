import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import CategoryFilterChips from '@/components/storefront/CategoryFilterChips'
import ProductCard from '@/components/products/ProductCard'
import { useI18n } from '@/i18n/useI18n'
import { fetchPublicProductsByShopSlug } from '@/utils/products'
import { fetchShopBySlug } from '@/utils/shops'
import { deriveProductCategories, filterProductsByCategory } from '@/utils/storefrontCategories'

export default function ShopStorefront() {
  const { slug } = useParams()
  const { t, mapError } = useI18n()
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
        if (!cancelled) setError(mapError(queryError))
      }

      if (!cancelled) setLoading(false)
    }

    loadStorefront()
  }, [slug, mapError])

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
        <p className="text-sm text-muted">{t('shop.loading')}</p>
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
        <h1 className="page-title">{t('shop.notFound')}</h1>
        <p className="page-subtitle">{t('shop.notFoundSubtitle')}</p>
        <Link to="/" className="link mt-4 inline-block text-sm">
          {t('shop.backToShops')}
        </Link>
      </div>
    )
  }

  return (
    <div className="px-6 py-10">
      <Link to="/" className="link text-sm">
        {t('shop.allShops')}
      </Link>
      <h1 className="page-title mt-4">{shop.name}</h1>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{t('shop.noProducts')}</p>
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
            <p className="mt-8 text-sm text-muted">{t('shop.noProductsInCategory')}</p>
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
