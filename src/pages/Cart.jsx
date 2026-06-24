import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CheckoutContactForm from '@/components/cart/CheckoutContactForm'
import { selectCartTotal, useCartStore } from '@/store/cartStore'
import { openOrderChannel, prepareOrderCheckout } from '@/utils/checkout'
import { formatPrice } from '@/utils/format'
import { fetchShopCheckoutDetails } from '@/utils/shops'
import { getProductImageUrl } from '@/utils/storage'

/** @typedef {'idle' | 'checkout'} CheckoutStep */

export function CartRedirect() {
  const cartShopSlug = useCartStore((state) => state.items[0]?.shopSlug)

  if (cartShopSlug) {
    return <Navigate to={`/cart/${cartShopSlug}`} replace />
  }

  return <Navigate to="/" replace />
}

export default function Cart() {
  const { slug } = useParams()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore(selectCartTotal)

  /** @type {[CheckoutStep, Function]} */
  const [checkoutStep, setCheckoutStep] = useState('idle')
  const [activeTab, setActiveTab] = useState('whatsapp')
  const [customerName, setCustomerName] = useState('')
  const [contactValue, setContactValue] = useState('')
  const [shop, setShop] = useState(null)
  const [loadingShop, setLoadingShop] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  const cartShopSlug = items[0]?.shopSlug

  if (cartShopSlug && cartShopSlug !== slug) {
    return <Navigate to={`/cart/${cartShopSlug}`} replace />
  }

  if (items.length === 0) {
    return (
      <div className="px-6 py-10">
        <h1 className="page-title">Cart</h1>
        {orderSuccess ? (
          <div className="alert-info mt-8">{orderSuccess}</div>
        ) : (
          <div className="alert-info mt-8">Your cart is empty.</div>
        )}
        <Link to={`/shop/${slug}`} className="link mt-6 inline-block text-sm">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const shopId = items[0].shopId
  const shopSlug = items[0].shopSlug

  async function loadShop() {
    if (shop) return shop

    setLoadingShop(true)
    setCheckoutError('')

    try {
      const data = await fetchShopCheckoutDetails(shopId)
      setShop(data)
      return data
    } finally {
      setLoadingShop(false)
    }
  }

  function pickDefaultTab() {
    return 'whatsapp'
  }

  async function handleStartCheckout() {
    setCheckoutError('')
    setCustomerName('')
    setContactValue('')
    setCheckoutStep('checkout')

    try {
      await loadShop()
      setActiveTab(pickDefaultTab())
    } catch (error) {
      setCheckoutError(error.message ?? 'Failed to load shop details.')
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    setContactValue('')
    setCheckoutError('')
  }

  async function handleSendOrder() {
    setCheckoutError('')
    setSubmitting(true)

    try {
      const shopData = shop ?? (await loadShop())

      const prepared = await prepareOrderCheckout({
        shopId,
        channel: activeTab,
        customerName,
        contactValue,
        items,
        shop: shopData,
      })

      if (prepared.redirectUrl) {
        await openOrderChannel(prepared)
        clearCart()
        return
      }

      setOrderSuccess(
        `Order #${prepared.orderReference} submitted. The shop will contact you on WhatsApp.`,
      )
      clearCart()
      setCheckoutStep('idle')
      setCustomerName('')
      setContactValue('')
      setSubmitting(false)
    } catch (error) {
      setCheckoutError(error.message ?? 'Failed to send order.')
      setSubmitting(false)
    }
  }

  function handleCancelCheckout() {
    setCheckoutStep('idle')
    setCustomerName('')
    setContactValue('')
    setCheckoutError('')
    setSubmitting(false)
  }

  return (
    <div className="px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="page-title">Cart</h1>
        <button type="button" onClick={clearCart} className="btn btn-outline">
          Clear cart
        </button>
      </div>

      <ul className="space-y-4">
        {items.map((item) => {
          const imageUrl = getProductImageUrl(item.image_url)

          return (
            <li key={item.productId} className="card flex gap-4 p-4">
              <Link
                to={`/shop/${item.shopSlug}/product/${item.productId}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link
                    to={`/shop/${item.shopSlug}/product/${item.productId}`}
                    className="link font-medium"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatPrice(item.price)} each</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="qty-control">
                    <button
                      type="button"
                      className="qty-control__btn"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-control__value">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-control__btn"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>

                  <button
                    type="button"
                    className="text-danger-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="card mt-8 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Total</span>
          <span className="text-xl font-semibold">{formatPrice(total)}</span>
        </div>

        {checkoutStep === 'idle' && (
          <button
            type="button"
            onClick={handleStartCheckout}
            className="btn btn-primary btn-block mt-5"
          >
            Send Order
          </button>
        )}

        {checkoutStep === 'checkout' && (
          <CheckoutContactForm
            activeTab={activeTab}
            onTabChange={handleTabChange}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            contactValue={contactValue}
            onContactChange={setContactValue}
            onSubmit={handleSendOrder}
            onCancel={handleCancelCheckout}
            submitting={submitting}
            loadingShop={loadingShop}
            shop={shop}
            checkoutError={checkoutError}
          />
        )}
      </div>

      <Link to={`/shop/${shopSlug}`} className="link mt-6 inline-block text-sm">
        ← Continue shopping
      </Link>
    </div>
  )
}
