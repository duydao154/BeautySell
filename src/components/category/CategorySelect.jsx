import { useI18n } from '@/i18n/useI18n'

const NEW_CATEGORY_VALUE = '__new__'

function fieldClass(hasError, type = 'select') {
  return `${type} ${hasError ? `${type}--error` : ''}`
}

export default function CategorySelect({
  categories,
  categoriesLoading,
  categoriesError,
  value,
  onChange,
  onSelectNew,
  hasError,
  errorMessage,
}) {
  const { t } = useI18n()

  function handleSelectChange(event) {
    const selected = event.target.value

    if (selected === NEW_CATEGORY_VALUE) {
      onSelectNew()
      return
    }

    onChange(selected)
  }

  return (
    <div>
      <select
        id="category_id"
        value={value ?? ''}
        onChange={handleSelectChange}
        disabled={categoriesLoading}
        className={`${fieldClass(hasError)} w-full`}
      >
        <option value={null}>{t('common.select')}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
        <option value={NEW_CATEGORY_VALUE}>{t('admin.newCategory')}</option>
      </select>

      {categoriesError && (
        <p className="field-error mt-1">
          {t('errors.failedLoadCategories')} {categoriesError}
        </p>
      )}
      {hasError && errorMessage && <p className="field-error mt-1">{errorMessage}</p>}
    </div>
  )
}

export { NEW_CATEGORY_VALUE }
