export const WHATSAPP_COUNTRY_CODES = [
  { code: '84', label: '+84', locale: 'Vietnam', example: '912 345 678' },
  { code: '49', label: '+49', locale: 'Germany', example: '151 2345678' },
]

const FACEBOOK_HOSTS = new Set(['facebook.com', 'm.facebook.com', 'fb.com', 'm.fb.com'])

const FACEBOOK_NON_PROFILE_PATHS = [
  '/pages/',
  '/groups/',
  '/events/',
  '/share/',
  '/sharer/',
  '/photo',
  '/photos/',
  '/watch/',
  '/marketplace/',
  '/gaming/',
  '/help/',
  '/business/',
  '/login',
  '/permalink.php',
  '/story.php',
  '/reel/',
  '/videos/',
  '/hashtag/',
  '/people/',
]

const FACEBOOK_RESERVED_USERNAMES = new Set([
  'people',
  'pages',
  'groups',
  'events',
  'marketplace',
  'watch',
  'gaming',
  'help',
  'business',
  'login.php',
  'sharer',
  'share',
  'dialog',
  'privacy',
  'policies',
  'legal',
  'settings',
  'profile.php',
])

export function normalizeWhatsAppDigits(value) {
  return value.replace(/\D/g, '')
}

export function sanitizeWhatsAppLocalInput(value) {
  return value.replace(/[^\d\s]/g, '')
}

function normalizeWhatsAppLocalDigits(localValue) {
  return normalizeWhatsAppDigits(localValue).replace(/^0+/, '')
}

export function isValidWhatsAppContact(countryCode, localValue) {
  const digits = normalizeWhatsAppLocalDigits(localValue)

  if (countryCode === '84') {
    return /^[35789]\d{8}$/.test(digits)
  }

  if (countryCode === '49') {
    return /^(15|16|17)\d{8,9}$/.test(digits)
  }

  return false
}

export function formatWhatsAppContact(countryCode, localValue) {
  const digits = normalizeWhatsAppLocalDigits(localValue)
  return `+${countryCode}${digits}`
}

function parseFacebookUrl(value) {
  const trimmed = value.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return new URL(withProtocol)
}

export function isValidFacebookProfile(value) {
  try {
    const parsed = parseFacebookUrl(value)
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()

    if (!FACEBOOK_HOSTS.has(host)) {
      return false
    }

    const path = parsed.pathname.replace(/\/+$/, '') || '/'

    if (path === '/profile.php' || path.startsWith('/profile.php/')) {
      const profileId = parsed.searchParams.get('id')
      return Boolean(profileId && /^\d+$/.test(profileId))
    }

    if (FACEBOOK_NON_PROFILE_PATHS.some((prefix) => path.startsWith(prefix))) {
      return false
    }

    const match = path.match(/^\/([^/?#]+)$/)
    if (!match) {
      return false
    }

    const username = match[1]

    if (FACEBOOK_RESERVED_USERNAMES.has(username.toLowerCase())) {
      return false
    }

    return /^[\w.]{5,}$/.test(username)
  } catch {
    return false
  }
}

export function isValidCustomerName(value) {
  return value.trim().length > 0
}

export function isValidContactForChannel(channel, value, phoneCountryCode = '84') {
  if (channel === 'whatsapp') {
    return isValidWhatsAppContact(phoneCountryCode, value)
  }

  return isValidFacebookProfile(value)
}

export function getCheckoutContactValue(channel, contactValue, phoneCountryCode = '84') {
  if (channel === 'whatsapp') {
    return formatWhatsAppContact(phoneCountryCode, contactValue)
  }

  return contactValue.trim()
}

export const CHECKOUT_TAB_CONFIG = {
  whatsapp: {
    label: 'Your WhatsApp number',
  },
  facebook: {
    label: 'Your Facebook profile link',
    placeholder: 'https://facebook.com/yourname',
    hint: 'Use a link to your personal profile, not a page or group.',
  },
}

export function getWhatsAppCountryConfig(countryCode) {
  return WHATSAPP_COUNTRY_CODES.find((entry) => entry.code === countryCode) ?? WHATSAPP_COUNTRY_CODES[0]
}
