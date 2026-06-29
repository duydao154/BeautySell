import { useCallback } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatDisplayPrice } from '@/utils/currency'

export function useFormatPrice() {
  const currency = useCurrencyStore((state) => state.currency)

  return useCallback((price) => formatDisplayPrice(price, currency), [currency])
}
