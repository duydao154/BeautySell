import { mapBulkImportRowError } from '@/i18n/mapBackendError'
import { useI18n } from '@/i18n/useI18n'

export default function BulkImportPreview({ rows }) {
  const { t, plural } = useI18n()
  const validCount = rows.filter((row) => row.valid).length
  const invalidCount = rows.length - validCount

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <span>
          {plural(rows.length, 'bulkImport.rowsParsed', 'bulkImport.rowsParsed_other', {
            count: rows.length,
          })}
        </span>
        <span className="text-muted">{t('bulkImport.readyToImport', { count: validCount })}</span>
        {invalidCount > 0 && (
          <span className="text-[var(--color-danger)]">
            {t('bulkImport.invalidCount', { count: invalidCount })}
          </span>
        )}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t('common.row')}</th>
              <th>{t('common.status')}</th>
              <th>{t('common.name')}</th>
              <th>{t('common.price')}</th>
              <th>{t('common.category')}</th>
              <th>{t('common.issues')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.rowNumber}
                className={row.valid ? '' : 'bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)]'}
              >
                <td className="text-muted">{row.rowNumber}</td>
                <td>
                  {row.valid ? (
                    <span className="badge badge-success">{t('common.valid')}</span>
                  ) : (
                    <span className="badge badge-sold-out">{t('common.invalid')}</span>
                  )}
                </td>
                <td className="font-medium">{row.raw.name?.trim() || t('common.emDash')}</td>
                <td className="text-muted">{row.raw.price?.trim() || t('common.emDash')}</td>
                <td className="text-muted">{row.raw.category?.trim() || t('common.emDash')}</td>
                <td className="text-sm text-muted">
                  {row.valid
                    ? t('common.emDash')
                    : row.errors.map((token) => mapBulkImportRowError(token, t)).join('; ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invalidCount > 0 && (
        <p className="mt-4 text-sm text-muted">{t('bulkImport.fixRowsHint')}</p>
      )}
    </div>
  )
}
