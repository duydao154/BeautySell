export default function NewCategoryForm({
  name,
  creating,
  error,
  onNameChange,
  onSubmit,
  onCancel,
  onKeyDown,
}) {
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Category name"
          className="input min-w-0 flex-1"
          autoFocus
          disabled={creating}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={creating}
          className="btn btn-primary shrink-0"
        >
          {creating ? 'Adding…' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={creating}
          className="btn btn-outline shrink-0"
        >
          Cancel
        </button>
      </div>
      {error && <p className="field-error mt-1">{error}</p>}
    </div>
  )
}
