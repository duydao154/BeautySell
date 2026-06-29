/** Product prices are stored in EUR. VND is derived client-side only. */
export const BASE_CURRENCY = 'EUR'

/** Fixed display rate — not loaded from the backend. */
export const EUR_TO_VND_RATE = 30_000

/** @typedef {'EUR' | 'VND'} DisplayCurrency */

export const DISPLAY_CURRENCIES = [
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'VND', label: 'VND (₫)' },
]

const CURRENCY_LOCALES = {
  EUR: 'de-DE',
  VND: 'vi-VN',
}

export function isDisplayCurrency(value) {
  return value === 'EUR' || value === 'VND'
}

export function convertFromBase(amount, currency) {
  if (currency === 'VND') {
    return amount * EUR_TO_VND_RATE
  }

  return amount
}

export function formatDisplayPrice(amount, currency = BASE_CURRENCY) {
  const value = convertFromBase(amount, currency)
  const locale = CURRENCY_LOCALES[currency] ?? CURRENCY_LOCALES.EUR

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(currency === 'VND' ? { maximumFractionDigits: 0 } : {}),
  }).format(value)
}
