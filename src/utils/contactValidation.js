export function normalizeWhatsAppDigits(value) {
  return value.replace(/\D/g, '')
}

export function isValidWhatsAppContact(value) {
  return normalizeWhatsAppDigits(value).length >= 8
}

export function isValidFacebookContact(value) {
  const trimmed = value.trim().toLowerCase()
  return trimmed.startsWith('http') && (trimmed.includes('facebook.com') || trimmed.includes('fb.com'))
}

export function isValidCustomerName(value) {
  return value.trim().length > 0
}

export function isValidContactForChannel(channel, value) {
  if (channel === 'whatsapp') return isValidWhatsAppContact(value)
  return isValidFacebookContact(value)
}

export const CHECKOUT_TAB_CONFIG = {
  whatsapp: {
    label: 'Your WhatsApp number',
    placeholder: '+1 555 123 4567',
  },
  facebook: {
    label: 'Your Facebook profile link',
    placeholder: 'https://facebook.com/yourname',
  },
}
