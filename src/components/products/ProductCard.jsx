import { Link } from 'react-router-dom'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import { useI18n } from '@/i18n/useI18n'
import { getProductImageUrl } from '@/utils/storage'

export default function ProductCard({ product, shopSlug }) {
  const { t } = useI18n()
  const formatPrice = useFormatPrice()
  const isSoldOut = product.status === 'sold_out'
  const imageUrl = getProductImageUrl(product.image_url)

  return (
    <Link
      to={`/shop/${shopSlug}/product/${product.id}`}
      className={`card card-link overflow-hidden ${isSoldOut ? 'card-muted' : ''}`}
    >
      <div className="relative aspect-square bg-[color-mix(in_srgb,var(--color-border)_50%,white)]">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t('common.noImage')}
          </div>
        )}
        {isSoldOut && (
          <span className="badge badge-sold-out absolute left-3 top-3">{t('product.soldOut')}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
