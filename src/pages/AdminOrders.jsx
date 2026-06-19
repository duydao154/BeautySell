import { useEffect, useMemo, useState } from 'react'
import { getProductImageUrl } from '../lib/productImageUrl'
import { supabase } from '../lib/supabaseClient'

const ORDER_STATUSES = ['pending', 'fulfilled', 'cancelled']

function formatPrice(price) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(price)
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function OrderStatusBadge({ status }) {
  const className =
    status === 'fulfilled'
      ? 'badge badge-fulfilled'
      : status === 'cancelled'
        ? 'badge badge-cancelled'
        : 'badge badge-pending'

  const label = status.charAt(0).toUpperCase() + status.slice(1)

  return <span className={className}>{label}</span>
}

function ChannelBadge({ channel }) {
  const isWhatsApp = channel === 'whatsapp'

  return (
    <span className={`badge ${isWhatsApp ? 'badge-channel-whatsapp' : 'badge-channel-facebook'}`}>
      {isWhatsApp ? 'WhatsApp' : 'Messenger'}
    </span>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      setLoading(true)
      setError('')

      const { data, error: queryError } = await supabase
        .from('orders')
        .select('*, order_items(quantity, price_at_purchase, products(name, image_url))')
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setOrders([])
      } else {
        setOrders(data ?? [])
      }

      setLoading(false)
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingOrderId(orderId)
    setError('')

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    setUpdatingOrderId(null)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  function toggleExpanded(orderId) {
    setExpandedOrderId((current) => (current === orderId ? null : orderId))
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading orders…</p>
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title">Orders</h1>
        <div className="flex flex-wrap gap-2">
          {['all', ...ORDER_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="alert-info">
          {orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id
            const items = order.order_items ?? []

            return (
              <li key={order.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleExpanded(order.id)}
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
                      {items.map((item, index) => {
                        const product = item.products
                        const imageUrl = getProductImageUrl(product?.image_url)

                        return (
                          <li
                            key={`${order.id}-${index}`}
                            className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-bg)]">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product?.name ?? 'Product'}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted">
                                  —
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{product?.name ?? 'Unknown product'}</p>
                              <p className="text-sm text-muted">
                                Qty {item.quantity} · {formatPrice(item.price_at_purchase)} each
                              </p>
                            </div>
                            <p className="text-sm font-medium">
                              {formatPrice(item.price_at_purchase * item.quantity)}
                            </p>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <label htmlFor={`status-${order.id}`} className="text-sm font-medium">
                        Update status
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                        className="select max-w-xs"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
          })}
        </ul>
      )}
    </div>
  )
}
