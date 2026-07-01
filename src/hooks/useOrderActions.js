import { supabase } from '@/utils/supabaseClient'
import { useI18n } from '@/i18n/useI18n'

export function useOrderActions(onSuccess) {
  const { t, mapError } = useI18n()

  async function fulfilOrder(orderId) {
    const { error } = await supabase.rpc('fulfil_order', { p_order_id: orderId })
    if (error) {
      alert(mapError(error))
      return
    }
    onSuccess?.()
  }

  async function cancelOrder(orderId) {
    if (!window.confirm(t('orders.cancelConfirm'))) return
    const { error } = await supabase.rpc('cancel_order', { p_order_id: orderId })
    if (error) {
      alert(mapError(error))
      return
    }
    onSuccess?.()
  }

  async function expireStaleOrders() {
    const { data, error } = await supabase.rpc('expire_stale_orders')
    if (error) {
      alert(mapError(error))
      return
    }
    alert(t('orders.staleExpired', { count: data }))
    onSuccess?.()
  }

  return { fulfilOrder, cancelOrder, expireStaleOrders }
}
