export function deriveProductCategories(products) {
  return [...new Set(products.map((product) => product.category_name).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  )
}

export function filterProductsByCategory(products, selectedCategory) {
  if (selectedCategory === 'all') return products
  return products.filter((product) => product.category_name === selectedCategory)
}
