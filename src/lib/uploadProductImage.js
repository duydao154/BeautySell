import { getProductImageUrl, PRODUCT_IMAGE_BUCKET } from './productImageUrl'
import { supabase } from './supabaseClient'

export async function uploadProductImage(file, shopId) {
  const extension = file.name.split('.').pop() ?? 'jpg'
  const path = `${shopId}/${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file)

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      throw new Error(
        `Storage bucket "${PRODUCT_IMAGE_BUCKET}" is missing. Create it in Supabase Storage or set VITE_SUPABASE_STORAGE_BUCKET in .env.local.`,
      )
    }

    throw uploadError
  }

  return getProductImageUrl(path)
}
