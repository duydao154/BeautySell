import Papa from 'papaparse'
import { z } from 'zod'
import { createCodedError } from '@/i18n/codedError'
import { PRODUCT_CSV_COLUMNS } from '@/utils/bulkImportConstants'

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : (value ?? '')
}

function parseOptionalUrl(value) {
  const trimmed = trimValue(value)
  if (!trimmed) return { value: null, error: null }
  if (!z.url().safeParse(trimmed).success) {
    return { value: null, error: 'invalid_url' }
  }
  return { value: trimmed, error: null }
}

function validateRow(row, rowNumber) {
  const errors = []
  const name = trimValue(row.name)

  if (!name) {
    errors.push('missing_name')
  }

  const priceRaw = trimValue(row.price)
  if (!priceRaw) {
    errors.push('missing_price')
  } else if (Number.isNaN(Number(priceRaw))) {
    errors.push('price_is_not_a_number')
  } else if (Number(priceRaw) < 0) {
    errors.push('price_must_be_0_or_greater')
  }

  const quantityRaw = trimValue(row.quantity)
  let quantity = 0
  if (quantityRaw) {
    if (!/^\d+$/.test(quantityRaw)) {
      errors.push('quantity_must_be_a_whole_number')
    } else {
      quantity = Number.parseInt(quantityRaw, 10)
    }
  }

  const statusRaw = trimValue(row.status).toLowerCase()
  const status = statusRaw === 'sold_out' ? 'sold_out' : 'available'

  const externalLinkResult = parseOptionalUrl(row.external_link)
  if (externalLinkResult.error) errors.push('external_link_invalid_url')

  const imageUrlResult = parseOptionalUrl(row.image_url)
  if (imageUrlResult.error) errors.push('image_url_invalid_url')

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
          reject(createCodedError('errors.parseCsvFailed'))
          return
        }

        const headers = results.meta.fields ?? []
        const missingColumns = PRODUCT_CSV_COLUMNS.filter((column) => !headers.includes(column))

        if (missingColumns.length > 0) {
          reject(
            createCodedError('bulkImport.missingColumns', {
              columns: missingColumns.join(', '),
            }),
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
