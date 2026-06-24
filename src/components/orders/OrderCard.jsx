import ChannelBadge from '@/components/orders/ChannelBadge'
import OrderItemRow from '@/components/orders/OrderItemRow'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { capitalize, formatDate } from '@/utils/format'

const ORDER_STATUSES = ['pending', 'fulfilled', 'cancelled']

export default function OrderCard({
  order,
  isExpanded,
  updatingOrderId,
  onToggle,
  onStatusChange,
}) {
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
          <p className="mt-1 text-sm text-muted">
            {items.length} item{items.length === 1 ? '' : 's'}
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label htmlFor={`status-${order.id}`} className="text-sm font-medium">
              Update status
            </label>
            <select
              id={`status-${order.id}`}
              value={order.status}
              disabled={updatingOrderId === order.id}
              onChange={(event) => onStatusChange(order.id, event.target.value)}
              className="select max-w-xs"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {capitalize(status)}
                </option>
              ))}
            </select>
            {updatingOrderId === order.id && (
              <span className="text-sm text-muted">Saving…</span>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
