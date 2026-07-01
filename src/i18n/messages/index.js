import en from '@/i18n/messages/en'
import vi from '@/i18n/messages/vi'

export const SUPPORTED_LOCALES = ['en', 'vi']

export const messages = { en, vi }

export const LOCALE_STORAGE_KEY = 'product-store-locale'

export function resolveInitialLocale() {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored

  const browser = navigator.language?.toLowerCase() ?? 'en'
  if (browser.startsWith('vi')) return 'vi'
  return 'en'
}

export const INTL_LOCALES = {
  en: undefined,
  vi: 'vi-VN',
}
