import {
  CHECKOUT_TAB_CONFIG,
  isValidContactForChannel,
  isValidCustomerName,
} from '@/utils/contactValidation'

export default function CheckoutContactForm({
  activeTab,
  onTabChange,
  customerName,
  onCustomerNameChange,
  contactValue,
  onContactChange,
  onSubmit,
  onCancel,
  submitting,
  loadingShop,
  shop,
  checkoutError,
}) {
  const whatsappAvailable = true
  const facebookAvailable = Boolean(shop?.facebook_page_username)
  const channelAvailable = activeTab === 'whatsapp' ? whatsappAvailable : facebookAvailable
  const fieldConfig = CHECKOUT_TAB_CONFIG[activeTab]
  const nameValid = isValidCustomerName(customerName)
  const contactValid = isValidContactForChannel(activeTab, contactValue)
  const canSubmit = !loadingShop && channelAvailable && nameValid && contactValid && !submitting

  return (
    <div className="mt-5 border-t border-[var(--color-border)] pt-5">
      <p className="text-sm font-medium">How should the shop reach you?</p>

      <div className="checkout-tabs mt-4" role="tablist" aria-label="Contact channel">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'whatsapp'}
          disabled={!whatsappAvailable}
          onClick={() => onTabChange('whatsapp')}
          className={`checkout-tab${activeTab === 'whatsapp' ? ' checkout-tab--active' : ''}`}
        >
          WhatsApp
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'facebook'}
          disabled={!facebookAvailable}
          onClick={() => onTabChange('facebook')}
          className={`checkout-tab${activeTab === 'facebook' ? ' checkout-tab--active' : ''}`}
        >
          Facebook
        </button>
      </div>

      {loadingShop && <p className="mt-3 text-sm text-muted">Loading shop details…</p>}

      {!loadingShop && shop && !facebookAvailable && (
        <p className="mt-3 text-sm text-muted">
          Facebook checkout is not set up for this shop. You can still order via WhatsApp.
        </p>
      )}

      {!loadingShop && channelAvailable && (
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="checkout-name" className="label">
              Your name
            </label>
            <input
              id="checkout-name"
              type="text"
              value={customerName}
              onChange={(event) => onCustomerNameChange(event.target.value)}
              placeholder="Jane Doe"
              className="input"
              autoComplete="name"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="checkout-contact" className="label">
              {fieldConfig.label}
            </label>
            <input
              id="checkout-contact"
              type="text"
              value={contactValue}
              onChange={(event) => onContactChange(event.target.value)}
              placeholder={fieldConfig.placeholder}
              className="input"
              autoComplete="off"
              disabled={submitting}
            />
          </div>
        </div>
      )}

      {checkoutError && (
        <div role="alert" className="alert-error mt-3">
          {checkoutError}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`btn flex-1 ${activeTab === 'whatsapp' ? 'btn-whatsapp' : 'btn-messenger'}`}
        >
          {submitting ? 'Sending…' : 'Send Order'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="btn btn-outline flex-1">
          Cancel
        </button>
      </div>
    </div>
  )
}
