import { resolveCategoryLookup } from '@/utils/categories'
import {
  buildProductRecords,
  collectDistinctCategoryNames,
  getValidImportRows,
} from '@/utils/bulkImport'
import { createProductsBatch } from '@/utils/products'

export async function importProductsFromCsvRows(rows, shopId) {
  const validRows = getValidImportRows(rows)

  if (validRows.length === 0) {
    throw new Error('No valid rows to import.')
  }

  const categoryNames = collectDistinctCategoryNames(validRows)
  const categoryLookup = await resolveCategoryLookup(shopId, categoryNames)
  const records = buildProductRecords(validRows, shopId, categoryLookup)

  await createProductsBatch(records)

  return records.length
}
