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

export async function createCategoriesBatch(shopId, names) {
  if (names.length === 0) return []

  const payload = names.map((name) => ({ shop_id: shopId, name: name.trim() }))

  const data = unwrap(
    await supabase.from('categories').insert(payload).select('id, name'),
  )

  return data ?? []
}

export async function resolveCategoryLookup(shopId, categoryNames) {
  const existing = await fetchCategoriesByShopId(shopId)
  const lookup = new Map(existing.map((category) => [category.name, category.id]))

  const missingNames = categoryNames.filter((name) => !lookup.has(name))

  if (missingNames.length > 0) {
    const created = await createCategoriesBatch(shopId, missingNames)
    for (const category of created) {
      lookup.set(category.name, category.id)
    }
  }

  return lookup
}

