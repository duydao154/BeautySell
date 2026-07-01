import { createCodedError } from '@/i18n/codedError'
import { supabase } from '@/utils/supabaseClient'

export const PRODUCT_IMAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'product-images'

const STORAGE_PUBLIC_PATH = /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/

export function extractStoragePath(imageUrlOrPath) {
  if (!imageUrlOrPath) return null

  if (!imageUrlOrPath.startsWith('http')) {
    return imageUrlOrPath
  }

  const match = imageUrlOrPath.match(STORAGE_PUBLIC_PATH)
  return match ? decodeURIComponent(match[1]) : null
}

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

export async function uploadProductImage(file, shopId) {
  const extension = file.name.split('.').pop() ?? 'jpg'
  const path = `${shopId}/${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file)

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      throw createCodedError('errors.storage_bucket_not_found', { bucket: PRODUCT_IMAGE_BUCKET })
    }

    throw uploadError
  }

  return getProductImageUrl(path)
}
