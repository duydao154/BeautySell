import { SUPPORTED_LOCALES } from '@/i18n/messages'
import { useI18n } from '@/i18n/useI18n'

export default function LanguageSelect() {
  const { locale, setLocale, t } = useI18n()

  return (
    <select
      value={locale}
      onChange={(event) => setLocale(event.target.value)}
      className="select language-select"
      aria-label={t('common.language')}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {t(`language.${code}`)}
        </option>
      ))}
    </select>
  )
}
