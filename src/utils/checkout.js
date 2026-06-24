import { supabase } from '@/utils/supabaseClient'

/**
 * @param {{
 *   shopId: string
 *   channel: 'whatsapp' | 'facebook'
 *   customerName: string
 *   contactValue: string
 *   items: Array<{ productId: string, quantity: number, name: string, price: number }>
 * }} params
 */
export async function prepareOrderCheckout({ shopId, channel, customerName, contactValue, items }) {
  const p_items = items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }))

  const { data, error } = await supabase.rpc('create_order', {
    p_shop_id: shopId,
    p_channel: channel,
    p_items,
    p_contact_value: contactValue.trim(),
    p_customer_name: customerName.trim(),
  })

  if (error) {
    throw error
  }

  const orderReference =
    typeof data === 'string' ? data : (data?.order_reference ?? data?.reference ?? data)

  if (!orderReference) {
    throw new Error('Order was created but no reference was returned.')
  }

  return {
    channel,
    orderReference,
  }
}
