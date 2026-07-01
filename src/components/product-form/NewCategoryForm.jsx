import { useI18n } from '@/i18n/useI18n'

export default function NewCategoryForm({
  name,
  creating,
  error,
  onNameChange,
  onSubmit,
  onCancel,
  onKeyDown,
}) {
  const { t } = useI18n()

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('admin.categoryNamePlaceholder')}
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
          {creating ? t('common.adding') : t('common.add')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={creating}
          className="btn btn-outline shrink-0"
        >
          {t('common.cancel')}
        </button>
      </div>
      {error && <p className="field-error mt-1">{error}</p>}
    </div>
  )
}
