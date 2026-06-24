import { supabase } from '@/utils/supabaseClient'
import { buildOrderMessage } from '@/utils/orderMessage'

/**
 * @param {{
 *   shopId: string
 *   channel: 'whatsapp' | 'facebook'
 *   customerName: string
 *   contactValue: string
 *   items: Array<{ productId: string, quantity: number, name: string, price: number }>
 *   shop: { whatsapp_number: string | null, facebook_page_username: string | null }
 * }} params
 */
export async function prepareOrderCheckout({ shopId, channel, customerName, contactValue, items, shop }) {
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const message = buildOrderMessage(items, total, orderReference)

  if (channel === 'whatsapp') {
    return {
      channel,
      orderReference,
      message,
    }
  }

  if (!shop.facebook_page_username) {
    throw new Error('This shop has no Facebook page configured.')
  }

  return {
    channel,
    orderReference,
    message,
    redirectUrl: `https://m.me/${shop.facebook_page_username}`,
    copyBeforeOpen: true,
  }
}

/**
 * @param {{
 *   message: string
 *   redirectUrl: string
 *   copyBeforeOpen: boolean
 * }} params
 */
export async function openOrderChannel({ message, redirectUrl, copyBeforeOpen }) {
  if (copyBeforeOpen) {
    await navigator.clipboard.writeText(message)
  }

  window.location.href = redirectUrl
}
