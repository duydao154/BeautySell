import { useI18n } from '@/i18n/useI18n'
import { formatPrice } from '@/utils/format'
import { getProductImageUrl } from '@/utils/storage'

export default function OrderItemRow({ item }) {
  const { t } = useI18n()
  const product = item.products
  const imageUrl = getProductImageUrl(product?.image_url)

  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-bg)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.name ?? t('common.product')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            {t('common.emDash')}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{product?.name ?? t('product.unknownProduct')}</p>
        <p className="text-sm text-muted">
          {t('orders.qtyEach', {
            qty: item.quantity,
            price: formatPrice(item.price_at_purchase),
          })}
        </p>
      </div>
      <p className="text-sm font-medium">
        {formatPrice(item.price_at_purchase * item.quantity)}
      </p>
    </li>
  )
}
