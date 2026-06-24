export function formatPrice(price) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(price)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
