import { useCurrencyStore } from '@/store/currencyStore'
import { useI18n } from '@/i18n/useI18n'

const CURRENCY_CODES = ['EUR', 'VND']

export default function CurrencySelect() {
  const { t } = useI18n()
  const currency = useCurrencyStore((state) => state.currency)
  const setCurrency = useCurrencyStore((state) => state.setCurrency)

  return (
    <select
      value={currency}
      onChange={(event) => setCurrency(event.target.value)}
      className="select currency-select"
      aria-label={t('common.displayCurrency')}
    >
      {CURRENCY_CODES.map((code) => (
        <option key={code} value={code}>
          {t(`currency.${code.toLowerCase()}`)}
        </option>
      ))}
    </select>
  )
}
