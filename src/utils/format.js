import { INTL_LOCALES } from '@/i18n/messages'
import { getLocale } from '@/i18n/runtime'
import { BASE_CURRENCY, formatDisplayPrice } from '@/utils/currency'

export function formatPrice(price) {
  return formatDisplayPrice(price, BASE_CURRENCY)
}

export function formatDate(value) {
  const locale = INTL_LOCALES[getLocale()]

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
