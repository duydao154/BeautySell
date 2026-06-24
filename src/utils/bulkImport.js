import Papa from 'papaparse'
import { z } from 'zod'
import { PRODUCT_CSV_COLUMNS } from '@/utils/bulkImportConstants'

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : (value ?? '')
}

function parseOptionalUrl(value, fieldLabel) {
  const trimmed = trimValue(value)
  if (!trimmed) return { value: null, error: null }
  if (!z.url().safeParse(trimmed).success) {
    return { value: null, error: `${fieldLabel} is not a valid URL` }
  }
  return { value: trimmed, error: null }
}

function validateRow(row, rowNumber) {
  const errors = []
  const name = trimValue(row.name)

  if (!name) {
    errors.push('missing name')
  }

  const priceRaw = trimValue(row.price)
  if (!priceRaw) {
    errors.push('missing price')
  } else if (Number.isNaN(Number(priceRaw))) {
    errors.push('price is not a number')
  } else if (Number(priceRaw) < 0) {
    errors.push('price must be 0 or greater')
  }

  const quantityRaw = trimValue(row.quantity)
  let quantity = 0
  if (quantityRaw) {
    if (!/^\d+$/.test(quantityRaw)) {
      errors.push('quantity must be a whole number')
    } else {
      quantity = Number.parseInt(quantityRaw, 10)
    }
  }

  const statusRaw = trimValue(row.status).toLowerCase()
  const status = statusRaw === 'sold_out' ? 'sold_out' : 'available'

  const externalLinkResult = parseOptionalUrl(row.external_link, 'external_link')
  if (externalLinkResult.error) errors.push(externalLinkResult.error)

  const imageUrlResult = parseOptionalUrl(row.image_url, 'image_url')
  if (imageUrlResult.error) errors.push(imageUrlResult.error)

  if (errors.length > 0) {
    return {
      rowNumber,
      raw: row,
      valid: false,
      errors,
      parsed: null,
    }
  }

  return {
    rowNumber,
    raw: row,
    valid: true,
    errors: [],
    parsed: {
      name,
      description: trimValue(row.description) || null,
      price: Number(priceRaw),
      quantity,
      status,
      categoryName: trimValue(row.category) || null,
      external_link: externalLinkResult.value,
      image_url: imageUrlResult.value,
    },
  }
}

export function parseProductCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0]?.message ?? 'Failed to parse CSV'))
          return
        }

        const headers = results.meta.fields ?? []
        const missingColumns = PRODUCT_CSV_COLUMNS.filter((column) => !headers.includes(column))

        if (missingColumns.length > 0) {
          reject(
            new Error(
              `CSV is missing required columns: ${missingColumns.join(', ')}. Download the template for the correct format.`,
            ),
          )
          return
        }

        const rows = results.data.map((row, index) => validateRow(row, index + 2))
        resolve(rows)
      },
      error: (error) => reject(error),
    })
  })
}

export function getValidImportRows(rows) {
  return rows.filter((row) => row.valid).map((row) => row.parsed)
}

export function collectDistinctCategoryNames(validRows) {
  return [
    ...new Set(
      validRows
        .map((row) => row.categoryName)
        .filter((name) => typeof name === 'string' && name.length > 0),
    ),
  ]
}

export function buildProductRecords(validRows, shopId, categoryLookup) {
  return validRows.map((row) => ({
    shop_id: shopId,
    name: row.name,
    description: row.description,
    price: row.price,
    quantity: row.quantity,
    status: row.status,
    category_id: row.categoryName ? (categoryLookup.get(row.categoryName) ?? null) : null,
    external_link: row.external_link,
    image_url: row.image_url,
  }))
}
