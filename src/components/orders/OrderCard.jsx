import ChannelBadge from '@/components/orders/ChannelBadge'
import OrderActions from '@/components/orders/OrderActions'
import OrderItemRow from '@/components/orders/OrderItemRow'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { useI18n } from '@/i18n/useI18n'
import { formatDate } from '@/utils/format'

export default function OrderCard({
  order,
  isExpanded,
  actingOrderId,
  onToggle,
  onRefresh,
  onActingChange,
}) {
  const { t, plural } = useI18n()
  const items = order.order_items ?? []

  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(order.id)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold">#{order.order_reference}</span>
            <ChannelBadge channel={order.channel} />
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-sm text-muted">{formatDate(order.created_at)}</p>
          {order.customer_name && (
            <p className="mt-1 text-sm">
              <span className="text-muted">{t('orders.nameLabel')}</span> {order.customer_name}
            </p>
          )}
          {order.contact_value && (
            <p className="mt-1 text-sm">
              <span className="text-muted">{t('orders.contactLabel')}</span> {order.contact_value}
            </p>
          )}
          <p className="mt-1 text-sm text-muted">
            {plural(items.length, 'orders.item', 'orders.items', { count: items.length })}
          </p>
        </div>
        <span className="text-sm text-muted">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-[var(--color-border)] px-5 pb-5">
          <ul className="mt-4 space-y-3">
            {items.map((item, index) => (
              <OrderItemRow key={`${order.id}-${index}`} item={item} />
            ))}
          </ul>

          <div className="mt-5">
            <OrderActions
              order={order}
              onRefresh={onRefresh}
              actingOrderId={actingOrderId}
              onActingChange={onActingChange}
            />
          </div>
        </div>
      )}
    </li>
  )
}
