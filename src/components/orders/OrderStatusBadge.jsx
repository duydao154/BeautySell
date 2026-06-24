import { capitalize } from '@/utils/format'

export default function OrderStatusBadge({ status }) {
  const className =
    status === 'fulfilled'
      ? 'badge badge-fulfilled'
      : status === 'cancelled'
        ? 'badge badge-cancelled'
        : 'badge badge-pending'

  return <span className={className}>{capitalize(status)}</span>
}
