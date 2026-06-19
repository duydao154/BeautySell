import { supabase } from './supabaseClient'

export const PRODUCT_IMAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'product-images'

const STORAGE_PUBLIC_PATH = /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/

/** Pull the object path out of a full Supabase public URL, or return the path as-is. */
export function extractStoragePath(imageUrlOrPath) {
  if (!imageUrlOrPath) return null

  if (!imageUrlOrPath.startsWith('http')) {
    return imageUrlOrPath
  }

  const match = imageUrlOrPath.match(STORAGE_PUBLIC_PATH)
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Turn a stored image_url (full URL or storage path) into a working public URL
 * for the configured bucket.
 */
export function getProductImageUrl(imageUrlOrPath, options = {}) {
  if (!imageUrlOrPath) return null

  const path = extractStoragePath(imageUrlOrPath)
  if (!path) return imageUrlOrPath

  const transform =
    options.width || options.height
      ? {
          width: options.width,
          height: options.height,
          resize: options.resize ?? 'cover',
        }
      : undefined

  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path, {
    transform,
  })

  return data.publicUrl
}
