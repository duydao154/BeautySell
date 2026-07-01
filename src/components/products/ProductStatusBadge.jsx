import { useI18n } from '@/i18n/useI18n'

export default function ProductStatusBadge({ status }) {
  const { t } = useI18n()
  const isAvailable = status === 'available'

  return (
    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-sold-out'}`}>
      {isAvailable ? t('product.available') : t('product.soldOutStatus')}
    </span>
  )
}
