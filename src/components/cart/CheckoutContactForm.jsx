import {
  getWhatsAppCountryConfig,
  isValidContactForChannel,
  isValidCustomerName,
  sanitizeWhatsAppLocalInput,
  WHATSAPP_COUNTRY_CODES,
} from '@/utils/contactValidation'
import { useI18n } from '@/i18n/useI18n'

export default function CheckoutContactForm({
  activeTab,
  onTabChange,
  customerName,
  onCustomerNameChange,
  phoneCountryCode,
  onPhoneCountryCodeChange,
  contactValue,
  onContactChange,
  onSubmit,
  onCancel,
  submitting,
  checkoutError,
}) {
  const { t } = useI18n()
  const phoneCountry = getWhatsAppCountryConfig(phoneCountryCode)
  const nameValid = isValidCustomerName(customerName)
  const contactValid = isValidContactForChannel(activeTab, contactValue, phoneCountryCode)
  const canSubmit = nameValid && contactValid && !submitting

  function handleWhatsAppChange(value) {
    onContactChange(sanitizeWhatsAppLocalInput(value))
  }

  return (
    <div className="mt-5 border-t border-[var(--color-border)] pt-5">
      <p className="text-sm font-medium">{t('cart.checkoutHeading')}</p>

      <div className="checkout-tabs mt-4" role="tablist" aria-label={t('cart.contactChannel')}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'whatsapp'}
          onClick={() => onTabChange('whatsapp')}
          className={`checkout-tab${activeTab === 'whatsapp' ? ' checkout-tab--active' : ''}`}
        >
          {t('cart.whatsapp')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'facebook'}
          onClick={() => onTabChange('facebook')}
          className={`checkout-tab${activeTab === 'facebook' ? ' checkout-tab--active' : ''}`}
        >
          {t('cart.facebook')}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="checkout-name" className="label">
            {t('cart.yourName')}
          </label>
          <input
            id="checkout-name"
            type="text"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            placeholder={t('cart.namePlaceholder')}
            className="input"
            autoComplete="name"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="checkout-contact" className="label">
            {activeTab === 'whatsapp' ? t('cart.whatsappNumber') : t('cart.facebookProfile')}
          </label>
          {activeTab === 'whatsapp' ? (
            <>
              <div className="input-prefix-group">
                <select
                  id="checkout-phone-code"
                  value={phoneCountryCode}
                  onChange={(event) => onPhoneCountryCodeChange(event.target.value)}
                  className="select input-prefix-group__prefix"
                  disabled={submitting}
                  aria-label={t('common.countryCode')}
                >
                  {WHATSAPP_COUNTRY_CODES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.label}{' '}
                      {entry.code === '84' ? t('cart.countryVietnam') : t('cart.countryGermany')}
                    </option>
                  ))}
                </select>
                <input
                  id="checkout-contact"
                  type="tel"
                  value={contactValue}
                  onChange={(event) => handleWhatsAppChange(event.target.value)}
                  placeholder={phoneCountry.example}
                  className="input input-prefix-group__input"
                  autoComplete="tel-national"
                  disabled={submitting}
                />
              </div>
              <p className="mt-1 text-xs text-muted">
                {t('cart.whatsappHint', {
                  label: phoneCountry.label,
                  example: phoneCountry.example.replace(/\s/g, ''),
                })}
              </p>
            </>
          ) : (
            <>
              <input
                id="checkout-contact"
                type="url"
                value={contactValue}
                onChange={(event) => onContactChange(event.target.value)}
                placeholder={t('cart.facebookPlaceholder')}
                className="input"
                autoComplete="url"
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-muted">{t('cart.facebookHint')}</p>
            </>
          )}
        </div>
      </div>

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
          {submitting ? t('common.sending') : t('cart.sendOrder')}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="btn btn-outline flex-1">
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
