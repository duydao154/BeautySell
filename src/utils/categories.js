import { supabase, unwrap } from '@/utils/supabaseClient'

export async function fetchCategoriesByShopId(shopId) {
  const data = unwrap(
    await supabase
      .from('categories')
      .select('id, name')
      .eq('shop_id', shopId)
      .order('name'),
  )

  return data ?? []
}

export async function createCategory(shopId, name) {
  return unwrap(
    await supabase
      .from('categories')
      .insert({ name: name.trim(), shop_id: shopId })
      .select('id, name')
      .single(),
  )
}

export async function deleteCategory(id) {
  unwrap(await supabase.from('categories').delete().eq('id', id))
}
