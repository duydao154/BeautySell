import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getT } from '@/i18n/runtime'

/** @typedef {{
 *   productId: string
 *   shopId: string
 *   shopSlug: string
 *   name: string
 *   price: number
 *   image_url: string | null
 *   quantity: number
 * }} CartItem */

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /**
       * @param {Omit<CartItem, 'quantity'> & { quantity?: number }} item
       * @returns {boolean} whether the item was added
       */
      addItem: (item) => {
        const quantity = item.quantity ?? 1
        const { items, clearCart } = get()
        const existingShopId = items[0]?.shopId

        if (existingShopId && existingShopId !== item.shopId) {
          const confirmed = window.confirm(getT()('cart.switchShopConfirm'))

          if (!confirmed) {
            return false
          }

          clearCart()
        }

        const currentItems = get().items
        const existingItem = currentItems.find((entry) => entry.productId === item.productId)

        if (existingItem) {
          set({
            items: currentItems.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            ),
          })
        } else {
          set({
            items: [
              ...currentItems,
              {
                productId: item.productId,
                shopId: item.shopId,
                shopSlug: item.shopSlug,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                quantity,
              },
            ],
          })
        }

        return true
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'product-store-cart',
    },
  ),
)

export function selectCartItemCount(state) {
  return state.items.reduce((total, item) => total + item.quantity, 0)
}

export function selectCartTotal(state) {
  return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
}
