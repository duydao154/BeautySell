import { supabase, unwrap } from '@/utils/supabaseClient'

export async function fetchAdminProducts() {
  const data = unwrap(
    await supabase
      .from('products')
      .select('id, name, price, quantity, reserved_quantity, status, category:categories(name)')
      .order('name'),
  )

  return data ?? []
}

export async function fetchProductById(id) {
  return unwrap(await supabase.from('products').select('*').eq('id', id).single())
}

export async function createProduct(payload) {
  unwrap(await supabase.from('products').insert(payload))
}

export async function createProductsBatch(records, batchSize = 500) {
  for (let index = 0; index < records.length; index += batchSize) {
    const chunk = records.slice(index, index + batchSize)
    unwrap(await supabase.from('products').insert(chunk))
  }
}


export async function updateProduct(id, payload) {
  unwrap(await supabase.from('products').update(payload).eq('id', id))
}

export async function deleteProduct(id) {
  unwrap(await supabase.from('products').delete().eq('id', id))
}

export async function fetchPublicProductsByShopSlug(slug) {
  const data = unwrap(
    await supabase
      .from('products_public')
      .select('*')
      .eq('shop_slug', slug)
      .order('name'),
  )

  return data ?? []
}

export async function fetchPublicProduct(slug, productId) {
  return unwrap(
    await supabase
      .from('products_public')
      .select('*')
      .eq('id', productId)
      .eq('shop_slug', slug)
      .maybeSingle(),
  )
}
