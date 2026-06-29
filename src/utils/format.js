import { BASE_CURRENCY, formatDisplayPrice } from '@/utils/currency'

export function formatPrice(price) {
  return formatDisplayPrice(price, BASE_CURRENCY)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
