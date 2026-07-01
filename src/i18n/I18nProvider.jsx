import { useCallback, useMemo, useState } from 'react'
import { createTranslator } from '@/i18n/createTranslator'
import { I18nContext } from '@/i18n/i18nContext'
import { mapBackendError } from '@/i18n/mapBackendError'
import {
  LOCALE_STORAGE_KEY,
  messages,
  resolveInitialLocale,
  SUPPORTED_LOCALES,
} from '@/i18n/messages'
import { setRuntimeLocale } from '@/i18n/runtime'

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(resolveInitialLocale)

  const translator = useMemo(() => createTranslator(messages[locale]), [locale])

  const setLocale = useCallback((nextLocale) => {
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
    setRuntimeLocale(nextLocale)
    setLocaleState(nextLocale)
  }, [])

  const mapError = useCallback(
    (error) => mapBackendError(error, translator.t),
    [translator],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translator.t,
      plural: translator.plural,
      mapError,
    }),
    [locale, setLocale, translator, mapError],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
