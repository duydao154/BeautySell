import { DISPLAY_CURRENCIES } from '@/utils/currency'
import { useCurrencyStore } from '@/store/currencyStore'

export default function CurrencySelect() {
  const currency = useCurrencyStore((state) => state.currency)
  const setCurrency = useCurrencyStore((state) => state.setCurrency)

  return (
    <select
      value={currency}
      onChange={(event) => setCurrency(event.target.value)}
      className="select currency-select"
      aria-label="Display currency"
    >
      {DISPLAY_CURRENCIES.map((entry) => (
        <option key={entry.code} value={entry.code}>
          {entry.label}
        </option>
      ))}
    </select>
  )
}
