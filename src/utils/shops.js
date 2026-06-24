import { supabase, unwrap } from '@/utils/supabaseClient'

export async function fetchAllShops() {
  const data = unwrap(
    await supabase.from('shops').select('id, name, slug').order('name'),
  )

  return data ?? []
}

export async function fetchShopBySlug(slug) {
  return unwrap(
    await supabase.from('shops').select('id, name, slug').eq('slug', slug).maybeSingle(),
  )
}

export async function fetchShopIdBySlug(slug) {
  const shop = unwrap(
    await supabase.from('shops').select('id').eq('slug', slug).maybeSingle(),
  )

  return shop?.id ?? null
}

export async function fetchShopByOwnerId(ownerId) {
  return unwrap(
    await supabase
      .from('shops')
      .select('id, name, slug, owner_id, created_at')
      .eq('owner_id', ownerId)
      .maybeSingle(),
  )
}

export async function fetchShopCheckoutDetails(shopId) {
  return unwrap(
    await supabase
      .from('shops')
      .select('whatsapp_number, facebook_page_username')
      .eq('id', shopId)
      .single(),
  )
}
