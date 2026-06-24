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
        <option value="">— No category —</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {categoriesError && (
        <p className="field-error mt-1">Failed to load categories: {categoriesError}</p>
      )}
      {hasError && errorMessage && <p className="field-error mt-1">{errorMessage}</p>}
    </div>
  )
}

export { NEW_CATEGORY_VALUE }
