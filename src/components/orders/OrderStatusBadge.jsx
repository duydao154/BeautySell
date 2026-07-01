import { useI18n } from '@/i18n/useI18n'

export default function OrderStatusBadge({ status }) {
  const { t } = useI18n()

  const className =
    status === 'fulfilled'
      ? 'badge badge-fulfilled'
      : status === 'cancelled'
        ? 'badge badge-cancelled'
        : status === 'expired'
          ? 'badge badge-expired'
          : 'badge badge-pending'

  return <span className={className}>{t(`orderStatus.${status}`)}</span>
}
