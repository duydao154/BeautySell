import { createTranslator } from '@/i18n/createTranslator'
import { messages, resolveInitialLocale } from '@/i18n/messages'

let currentLocale = resolveInitialLocale()
let currentTranslator = createTranslator(messages[currentLocale])

export function getLocale() {
  return currentLocale
}

export function getT() {
  return currentTranslator.t
}

export function getPlural() {
  return currentTranslator.plural
}

export function setRuntimeLocale(locale) {
  currentLocale = locale
  currentTranslator = createTranslator(messages[locale])
  document.documentElement.lang = locale
}

setRuntimeLocale(currentLocale)
