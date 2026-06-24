import { supabase, unwrap } from '@/utils/supabaseClient'

export async function fetchAdminOrders() {
  const data = unwrap(
    await supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_purchase, products(name, image_url))')
      .order('created_at', { ascending: false }),
  )

  return data ?? []
}

export async function updateOrderStatus(orderId, status) {
  unwrap(await supabase.from('orders').update({ status }).eq('id', orderId))
}
