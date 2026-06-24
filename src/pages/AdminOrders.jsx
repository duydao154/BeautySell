import { useEffect, useMemo, useState } from 'react'
import OrderCard from '@/components/orders/OrderCard'
import { capitalize } from '@/utils/format'
import { fetchAdminOrders, updateOrderStatus } from '@/utils/orders'

const ORDER_STATUSES = ['pending', 'fulfilled', 'cancelled']

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

      try {
        const data = await fetchAdminOrders()
        if (!cancelled) setOrders(data)
      } catch (queryError) {
        if (!cancelled) {
          setError(queryError.message)
          setOrders([])
        }
      }

      if (!cancelled) setLoading(false)
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

    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingOrderId(null)
    }
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
              {status === 'all' ? 'All' : capitalize(status)}
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
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              updatingOrderId={updatingOrderId}
              onToggle={toggleExpanded}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
