import { useState } from 'react'
import { Link } from 'react-router-dom'
import { selectCartTotal, useCartStore } from '@/store/cartStore'
import { openOrderChannel, prepareOrderCheckout } from '@/utils/checkout'
import { formatPrice } from '@/utils/format'
import { fetchShopCheckoutDetails } from '@/utils/shops'
import { getProductImageUrl } from '@/utils/storage'

/** @typedef {'idle' | 'choose-channel' | 'ready-to-send'} CheckoutStep */

/** @typedef {{
 *   channel: 'whatsapp' | 'facebook'
 *   orderReference: string
 *   message: string
 *   redirectUrl: string
 *   copyBeforeOpen: boolean
 * }} PendingCheckout */

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore(selectCartTotal)

  /** @type {[CheckoutStep, Function]} */
  const [checkoutStep, setCheckoutStep] = useState('idle')
  const [shop, setShop] = useState(null)
  const [loadingShop, setLoadingShop] = useState(false)
  const [submittingChannel, setSubmittingChannel] = useState(null)
  const [openingChannel, setOpeningChannel] = useState(false)
  /** @type {[PendingCheckout | null, Function]} */
  const [pendingCheckout, setPendingCheckout] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [copyNotice, setCopyNotice] = useState('')

  if (items.length === 0) {
    return (
      <div className="px-6 py-10">
        <h1 className="page-title">Cart</h1>
        <div className="alert-info mt-8">Your cart is empty.</div>
        <Link to="/" className="link mt-6 inline-block text-sm">
          Browse shops
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

  async function handleSendOrderClick() {
    setCheckoutError('')
    setCopyNotice('')
    setPendingCheckout(null)
    setCheckoutStep('choose-channel')

    try {
      await loadShop()
    } catch (error) {
      setCheckoutError(error.message ?? 'Failed to load shop details.')
    }
  }

  async function handleChannelSelect(channel) {
    setCheckoutError('')
    setCopyNotice('')
    setSubmittingChannel(channel)

    try {
      const shopData = shop ?? (await loadShop())

      const prepared = await prepareOrderCheckout({
        shopId,
        channel,
        items,
        shop: shopData,
      })

      setPendingCheckout(prepared)
      setCheckoutStep('ready-to-send')
    } catch (error) {
      setCheckoutError(error.message ?? 'Failed to prepare order.')
    } finally {
      setSubmittingChannel(null)
    }
  }

  async function handleOpenChannel() {
    if (!pendingCheckout) return

    setCheckoutError('')
    setCopyNotice('')
    setOpeningChannel(true)

    try {
      await openOrderChannel(pendingCheckout)

      if (pendingCheckout.copyBeforeOpen) {
        setCopyNotice('Copied — paste it in the chat')
      }

      clearCart()
    } catch (error) {
      setOpeningChannel(false)
      setCheckoutError(error.message ?? 'Failed to open chat.')
    }
  }

  function handleCancelCheckout() {
    setCheckoutStep('idle')
    setPendingCheckout(null)
    setCheckoutError('')
    setCopyNotice('')
    setSubmittingChannel(null)
    setOpeningChannel(false)
  }

  function handleBackToChannels() {
    setCheckoutStep('choose-channel')
    setPendingCheckout(null)
    setCheckoutError('')
    setCopyNotice('')
    setOpeningChannel(false)
  }

  const channelLabel =
    pendingCheckout?.channel === 'whatsapp' ? 'WhatsApp' : 'Facebook Messenger'

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
            onClick={handleSendOrderClick}
            className="btn btn-primary btn-block mt-5"
          >
            Send Order
          </button>
        )}

        {checkoutStep === 'choose-channel' && (
          <div className="mt-5 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm font-medium">Choose how to send your order</p>

            {loadingShop && <p className="mt-3 text-sm text-muted">Loading shop details…</p>}

            {checkoutError && (
              <div role="alert" className="alert-error mt-3">
                {checkoutError}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={loadingShop || submittingChannel !== null || !shop?.whatsapp_number}
                onClick={() => handleChannelSelect('whatsapp')}
                className="btn btn-whatsapp flex-1"
              >
                {submittingChannel === 'whatsapp' ? 'Preparing…' : 'WhatsApp'}
              </button>
              <button
                type="button"
                disabled={loadingShop || submittingChannel !== null || !shop?.facebook_page_username}
                onClick={() => handleChannelSelect('facebook')}
                className="btn btn-messenger flex-1"
              >
                {submittingChannel === 'facebook' ? 'Preparing…' : 'Facebook Messenger'}
              </button>
            </div>

            {!loadingShop && shop && !shop.whatsapp_number && !shop.facebook_page_username && (
              <p className="mt-3 text-sm text-muted">
                This shop hasn&apos;t set up WhatsApp or Facebook checkout yet.
              </p>
            )}

            <button type="button" onClick={handleCancelCheckout} className="btn btn-outline mt-4">
              Cancel
            </button>
          </div>
        )}

        {checkoutStep === 'ready-to-send' && pendingCheckout && (
          <div className="mt-5 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm font-medium">Review your message</p>
            <p className="mt-1 text-sm text-muted">
              Order #{pendingCheckout.orderReference} — open {channelLabel} to send it. Your cart
              stays until you do.
            </p>

            <pre className="mt-4 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm leading-relaxed">
              {pendingCheckout.message}
            </pre>

            {checkoutError && (
              <div role="alert" className="alert-error mt-3">
                {checkoutError}
              </div>
            )}

            {copyNotice && (
              <div role="status" className="alert-info mt-3">
                {copyNotice}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={openingChannel}
                onClick={handleOpenChannel}
                className={`btn flex-1 ${
                  pendingCheckout.channel === 'whatsapp' ? 'btn-whatsapp' : 'btn-messenger'
                }`}
              >
                {openingChannel
                  ? 'Opening…'
                  : pendingCheckout.copyBeforeOpen
                    ? 'Copy & open Messenger'
                    : 'Open WhatsApp'}
              </button>
              <button
                type="button"
                disabled={openingChannel}
                onClick={handleBackToChannels}
                className="btn btn-outline flex-1"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      <Link to={`/shop/${shopSlug}`} className="link mt-6 inline-block text-sm">
        ← Continue shopping
      </Link>
    </div>
  )
}
