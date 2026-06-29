import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BASE_CURRENCY, isDisplayCurrency } from '@/utils/currency'

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: BASE_CURRENCY,

      /** @param {import('@/utils/currency').DisplayCurrency} currency */
      setCurrency: (currency) => {
        if (!isDisplayCurrency(currency)) return
        set({ currency })
      },
    }),
    {
      name: 'product-store-currency',
    },
  ),
)
