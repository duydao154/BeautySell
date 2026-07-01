import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { useOrderActions } from '@/hooks/useOrderActions'
import { useI18n } from '@/i18n/useI18n'
import { formatDate } from '@/utils/format'

export default function OrderActions({ order, onRefresh, actingOrderId, onActingChange }) {
  const { t } = useI18n()
  const { fulfilOrder, cancelOrder } = useOrderActions(onRefresh)
  const isActing = actingOrderId === order.id

  async function handleFulfil() {
    onActingChange?.(order.id)
    try {
      await fulfilOrder(order.id)
    } finally {
      onActingChange?.(null)
    }
  }

  async function handleCancel() {
    onActingChange?.(order.id)
    try {
      await cancelOrder(order.id)
    } finally {
      onActingChange?.(null)
    }
  }

  if (order.status !== 'pending') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} />
        {order.fulfilled_at && (
          <span className="text-sm text-muted">· {formatDate(order.fulfilled_at)}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleFulfil}
        disabled={isActing}
        className="btn btn-secondary"
        style={{ padding: '6px 14px' }}
      >
        {isActing ? t('common.saving') : t('orders.markFulfilled')}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isActing}
        className="btn btn-outline text-danger"
        style={{ padding: '6px 14px' }}
      >
        {t('common.cancel')}
      </button>
    </div>
  )
}
