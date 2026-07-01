import { useCallback, useEffect, useMemo, useState } from 'react'
import OrderCard from '@/components/orders/OrderCard'
import { useOrderActions } from '@/hooks/useOrderActions'
import { useI18n } from '@/i18n/useI18n'
import { fetchAdminOrders } from '@/utils/orders'

const ORDER_STATUSES = ['pending', 'fulfilled', 'cancelled', 'expired']

export default function AdminOrders() {
  const { t, mapError } = useI18n()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [actingOrderId, setActingOrderId] = useState(null)
  const [expiringStale, setExpiringStale] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshOrders = useCallback(() => {
    setRefreshKey((current) => current + 1)
  }, [])

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
          setError(mapError(queryError))
          setOrders([])
        }
      }

      if (!cancelled) setLoading(false)
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [refreshKey, mapError])

  const { expireStaleOrders } = useOrderActions(refreshOrders)

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  async function handleExpireStale() {
    setExpiringStale(true)
    try {
      await expireStaleOrders()
    } finally {
      setExpiringStale(false)
    }
  }

  function toggleExpanded(orderId) {
    setExpandedOrderId((current) => (current === orderId ? null : orderId))
  }

  if (loading) {
    return <p className="text-sm text-muted">{t('orders.loading')}</p>
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title">{t('orders.title')}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {['all', ...ORDER_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            >
              {status === 'all' ? t('common.all') : t(`orderStatus.${status}`)}
            </button>
          ))}
          <button
            type="button"
            onClick={handleExpireStale}
            disabled={expiringStale}
            className="btn btn-outline"
          >
            {expiringStale ? t('common.expiring') : t('orders.expireStale')}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="alert-info">
          {orders.length === 0 ? t('orders.empty') : t('orders.noMatchFilter')}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              actingOrderId={actingOrderId}
              onToggle={toggleExpanded}
              onRefresh={refreshOrders}
              onActingChange={setActingOrderId}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
