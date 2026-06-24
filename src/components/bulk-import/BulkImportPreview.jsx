export default function BulkImportPreview({ rows }) {
  const validCount = rows.filter((row) => row.valid).length
  const invalidCount = rows.length - validCount

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <span>
          <strong>{rows.length}</strong> row{rows.length === 1 ? '' : 's'} parsed
        </span>
        <span className="text-muted">
          <strong>{validCount}</strong> ready to import
        </span>
        {invalidCount > 0 && (
          <span className="text-[var(--color-danger)]">
            <strong>{invalidCount}</strong> invalid
          </span>
        )}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Status</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rowNumber} className={row.valid ? '' : 'bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)]'}>
                <td className="text-muted">{row.rowNumber}</td>
                <td>
                  {row.valid ? (
                    <span className="badge badge-success">Valid</span>
                  ) : (
                    <span className="badge badge-sold-out">Invalid</span>
                  )}
                </td>
                <td className="font-medium">{row.raw.name?.trim() || '—'}</td>
                <td className="text-muted">{row.raw.price?.trim() || '—'}</td>
                <td className="text-muted">{row.raw.category?.trim() || '—'}</td>
                <td className="text-sm text-muted">
                  {row.valid ? '—' : row.errors.join('; ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invalidCount > 0 && (
        <p className="mt-4 text-sm text-muted">
          Fix the highlighted rows in your CSV and re-upload. Only valid rows will be imported.
        </p>
      )}
    </div>
  )
}
