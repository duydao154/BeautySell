import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BulkImportPreview from '@/components/bulk-import/BulkImportPreview'
import { useShop } from '@/hooks/useShop'
import { useI18n } from '@/i18n/useI18n'
import { parseProductCsvFile } from '@/utils/bulkImport'
import { PRODUCT_CSV_TEMPLATE_PATH } from '@/utils/bulkImportConstants'
import { importProductsFromCsvRows } from '@/utils/bulkImportProducts'

export default function AdminBulkImport() {
  const { shopId } = useShop()
  const { t, mapError, plural } = useI18n()
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
      setParseError(mapError(error))
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
      setImportError(mapError(error) || t('errors.importFailed'))
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
        <h1 className="page-title">{t('admin.bulkImportTitle')}</h1>
        <div className="alert-info mt-6">
          {plural(importedCount, 'admin.importSuccess', 'admin.importSuccess_other', {
            count: importedCount,
          })}
        </div>
        <p className="mt-4 text-sm text-muted">{t('admin.importImageHint')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admin/products" className="btn btn-primary">
            {t('admin.viewProducts')}
          </Link>
          <button type="button" onClick={handleReset} className="btn btn-outline">
            {t('admin.importAnotherFile')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        {t('admin.backToProducts')}
      </Link>

      <h1 className="page-title mt-2">{t('admin.bulkImportTitle')}</h1>
      <p className="page-subtitle">{t('admin.bulkImportSubtitle')}</p>

      <div className="card mt-6 space-y-4 p-5">
        <div>
          <a href={PRODUCT_CSV_TEMPLATE_PATH} download className="link text-sm">
            {t('admin.downloadTemplate')}
          </a>
          <p className="mt-2 text-sm text-muted">{t('admin.csvColumnsHint')}</p>
        </div>

        <div>
          <label htmlFor="csv-file" className="label">
            {t('admin.csvFile')}
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
          {fileName && (
            <p className="mt-2 text-sm text-muted">{t('admin.selectedFile', { name: fileName })}</p>
          )}
        </div>

        {parsing && <p className="text-sm text-muted">{t('common.parsing')}</p>}

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
                ? t('common.importing')
                : plural(validCount, 'admin.importProducts', 'admin.importProducts_other', {
                    count: validCount,
                  })}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={importing}
              className="btn btn-outline"
            >
              {t('admin.chooseDifferentFile')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
