import { supabase } from './supabaseClient'
import { buildOrderMessage, normalizeWhatsAppNumber } from './orderMessage'

/**
 * @param {{
 *   shopId: string
 *   channel: 'whatsapp' | 'facebook'
 *   items: Array<{ productId: string, quantity: number, name: string, price: number }>
 *   shop: { whatsapp_number: string | null, facebook_page_username: string | null }
 * }} params
 */
export async function prepareOrderCheckout({ shopId, channel, items, shop }) {
  const p_items = items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }))

  const { data, error } = await supabase.rpc('create_order', {
    p_shop_id: shopId,
    p_channel: channel,
    p_items,
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
    if (!shop.whatsapp_number) {
      throw new Error('This shop has no WhatsApp number configured.')
    }

    const number = normalizeWhatsAppNumber(shop.whatsapp_number)

    return {
      channel,
      orderReference,
      message,
      redirectUrl: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      copyBeforeOpen: false,
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
