import { formatPrice } from '@/utils/format'

export { formatPrice } from '@/utils/format'

export function buildOrderMessage(items, total, orderReference) {
  const lines = items.map(
    (item) =>
      `- ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
  )

  return [
    "Hi! I'd like to place an order:",
    '',
    ...lines,
    '',
    `Total: ${formatPrice(total)}`,
    '',
    `Order #${orderReference}`,
  ].join('\n')
}

export function normalizeWhatsAppNumber(number) {
  return number.replace(/\D/g, '')
}
