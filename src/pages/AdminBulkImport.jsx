import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BulkImportPreview from '@/components/bulk-import/BulkImportPreview'
import { useShop } from '@/hooks/useShop'
import { parseProductCsvFile } from '@/utils/bulkImport'
import { PRODUCT_CSV_TEMPLATE_PATH } from '@/utils/bulkImportConstants'
import { importProductsFromCsvRows } from '@/utils/bulkImportProducts'

export default function AdminBulkImport() {
  const { shopId } = useShop()
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState(null)
  const [parseError, setParseError] = useState('')
  const [importError, setImportError] = useState('')
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importedCount, setImportedCount] = useState(null)

  const validCount = rows?.filter((row) => row.valid).length ?? 0

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    setParseError('')
    setImportError('')
    setImportedCount(null)
    setRows(null)

    if (!file) {
      setFileName('')
      return
    }

    setFileName(file.name)
    setParsing(true)

    try {
      const parsedRows = await parseProductCsvFile(file)
      setRows(parsedRows)
    } catch (error) {
      setParseError(error.message ?? 'Failed to parse CSV')
      setFileName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setParsing(false)
    }
  }

  async function handleImport() {
    if (!rows || validCount === 0) return

    setImporting(true)
    setImportError('')

    try {
      const count = await importProductsFromCsvRows(rows, shopId)
      setImportedCount(count)
    } catch (error) {
      setImportError(error.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  function handleReset() {
    setRows(null)
    setFileName('')
    setParseError('')
    setImportError('')
    setImportedCount(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (importedCount !== null) {
    return (
      <div>
        <h1 className="page-title">Bulk Import</h1>
        <div className="alert-info mt-6">
          Successfully imported {importedCount} product{importedCount === 1 ? '' : 's'}.
        </div>
        <p className="mt-4 text-sm text-muted">
          Image URLs from the CSV were saved as links. To upload photos from your device, edit each
          product individually.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admin/products" className="btn btn-primary">
            View products
          </Link>
          <button type="button" onClick={handleReset} className="btn btn-outline">
            Import another file
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        ← Back to products
      </Link>

      <h1 className="page-title mt-2">Bulk Import</h1>
      <p className="page-subtitle">
        Upload a CSV to add many products at once. Use the template for the correct column format.
      </p>

      <div className="card mt-6 space-y-4 p-5">
        <div>
          <a href={PRODUCT_CSV_TEMPLATE_PATH} download className="link text-sm">
            Download CSV template
          </a>
          <p className="mt-2 text-sm text-muted">
            Columns: name, description, price, quantity, status, category, external_link, image_url.
            The image_url column is for an already-hosted image link — upload photos from your device
            later via the edit form.
          </p>
        </div>

        <div>
          <label htmlFor="csv-file" className="label">
            CSV file
          </label>
          <input
            ref={fileInputRef}
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={parsing || importing}
            className="file-input"
          />
          {fileName && <p className="mt-2 text-sm text-muted">Selected: {fileName}</p>}
        </div>

        {parsing && <p className="text-sm text-muted">Parsing file…</p>}

        {parseError && (
          <div role="alert" className="alert-error">
            {parseError}
          </div>
        )}

        {importError && (
          <div role="alert" className="alert-error">
            {importError}
          </div>
        )}
      </div>

      {rows && (
        <>
          <BulkImportPreview rows={rows} />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || validCount === 0}
              className="btn btn-primary"
            >
              {importing
                ? 'Importing…'
                : `Import ${validCount} product${validCount === 1 ? '' : 's'}`}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={importing}
              className="btn btn-outline"
            >
              Choose a different file
            </button>
          </div>
        </>
      )}
    </div>
  )
}
