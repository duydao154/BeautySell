/** Backend RPC / DB error tokens → i18n keys (longest match first). */
const BACKEND_ERROR_TOKENS = [
  'order_not_found_or_not_pending',
  'insufficient_stock',
  'order_not_found',
  'shop_not_found',
  'product_not_found',
  'invalid_items',
  'invalid_channel',
  'order_already_fulfilled',
  'order_already_cancelled',
]

/**
 * @param {unknown} error
 * @param {(key: string, vars?: Record<string, string | number>) => string} t
 */
export function mapBackendError(error, t) {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    const vars = 'vars' in error && error.vars ? error.vars : undefined
    const translated = t(error.code, vars)
    if (translated !== error.code) return translated
  }

  const message =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : String(error ?? '')

  for (const token of BACKEND_ERROR_TOKENS) {
    if (message === token || message.includes(token)) {
      return t(`errors.${token}`)
    }
  }

  if (message === 'Bucket not found') {
    return t('errors.storage_bucket_not_found', {
      bucket: import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'product-images',
    })
  }

  if (message) {
    return t('errors.unknownWithDetail', { message })
  }

  return t('errors.unknown')
}

/** Maps bulk-import row validation tokens to translated labels. */
const BULK_IMPORT_ROW_ERROR_KEYS = {
  missing_name: 'bulkImport.rowErrors.missingName',
  missing_price: 'bulkImport.rowErrors.missingPrice',
  price_is_not_a_number: 'bulkImport.rowErrors.priceNotNumber',
  price_must_be_0_or_greater: 'bulkImport.rowErrors.priceMin',
  quantity_must_be_a_whole_number: 'bulkImport.rowErrors.quantityWhole',
  external_link_invalid_url: 'bulkImport.rowErrors.invalidUrl',
  image_url_invalid_url: 'bulkImport.rowErrors.invalidUrl',
}

export function mapBulkImportRowError(token, t) {
  const key = BULK_IMPORT_ROW_ERROR_KEYS[token]
  if (!key) return token

  if (token === 'external_link_invalid_url') {
    return t(key, { field: 'external_link' })
  }
  if (token === 'image_url_invalid_url') {
    return t(key, { field: 'image_url' })
  }

  return t(key)
}
