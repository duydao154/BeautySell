import CategorySelect, { NEW_CATEGORY_VALUE } from '@/components/category/CategorySelect'
import NewCategoryForm from '@/components/product-form/NewCategoryForm'

export default function ProductCategoryField({
  categories,
  categoriesLoading,
  categoriesError,
  categoryId,
  showNewCategory,
  newCategoryName,
  creatingCategory,
  createCategoryError,
  categoryFieldError,
  onCategoryChange,
  onShowNewCategory,
  onNewCategoryNameChange,
  onCreateCategory,
  onCancelNewCategory,
  onNewCategoryKeyDown,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor="category_id" className="label mb-0">
          Category
        </label>
        {!showNewCategory && (
          <button
            type="button"
            onClick={onShowNewCategory}
            className="link shrink-0 text-sm whitespace-nowrap"
          >
            + Add New Category
          </button>
        )}
      </div>

      <CategorySelect
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        value={showNewCategory ? NEW_CATEGORY_VALUE : categoryId}
        onChange={onCategoryChange}
        onSelectNew={onShowNewCategory}
        hasError={Boolean(categoryFieldError)}
        errorMessage={categoryFieldError}
      />

      {showNewCategory && (
        <NewCategoryForm
          name={newCategoryName}
          creating={creatingCategory}
          error={createCategoryError}
          onNameChange={onNewCategoryNameChange}
          onSubmit={onCreateCategory}
          onCancel={onCancelNewCategory}
          onKeyDown={onNewCategoryKeyDown}
        />
      )}
    </div>
  )
}
