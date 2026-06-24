import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../schemas/productSchema'
import { uploadProductImage } from '../lib/uploadProductImage'
import { getProductImageUrl } from '../lib/productImageUrl'
import { supabase } from '../lib/supabaseClient'
import { useShop } from '../hooks/useShop'
import { useCategories } from '../hooks/useCategories'
import CategorySelect, { NEW_CATEGORY_VALUE } from './CategorySelect'
import { categoryNameSchema } from '../schemas/categorySchema'

function fieldClass(hasError, type = 'input') {
  return `${type} ${hasError ? `${type}--error` : ''}`
}

export default function ProductForm({ product, onSaved }) {
  const { shopId } = useShop()
  const { categories, loading: categoriesLoading, error: categoriesError, createCategory } =
    useCategories(shopId)
  const [imageFile, setImageFile] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [createCategoryError, setCreateCategoryError] = useState('')
  const isEditing = Boolean(product)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      external_link: '',
      quantity: 0,
      status: 'available',
      category_id: '',
    },
  })

  const categoryId = watch('category_id')

  useEffect(() => {
    if (product) {
      reset({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        external_link: product.external_link ?? '',
        quantity: product.quantity ?? 0,
        status: product.status ?? 'available',
        category_id: product.category_id ?? '',
      })
    }
  }, [product, reset])

  function handleShowNewCategory() {
    setShowNewCategory(true)
    setCreateCategoryError('')
  }

  async function handleCreateCategory() {
    setCreateCategoryError('')

    const parsed = categoryNameSchema.safeParse({ name: newCategoryName })
    if (!parsed.success) {
      setCreateCategoryError(parsed.error.issues[0]?.message ?? 'Invalid category name')
      return
    }

    setCreatingCategory(true)

    try {
      const category = await createCategory(parsed.data.name)
      setValue('category_id', category.id, { shouldValidate: true })
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (error) {
      setCreateCategoryError(error.message ?? 'Failed to create category')
    } finally {
      setCreatingCategory(false)
    }
  }

  function handleNewCategoryKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateCategory()
    }
  }

  async function onSubmit(values) {
    setSaveError('')

    try {
      let imageUrl = product?.image_url ?? null

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, shopId)
      }

      const payload = {
        name: values.name,
        description: values.description || null,
        price: values.price,
        external_link: values.external_link || null,
        quantity: values.quantity,
        status: values.status,
        image_url: imageUrl,
        category_id: values.category_id,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert({
          ...payload,
          shop_id: shopId,
        })

        if (error) throw error
      }

      onSaved()
    } catch (error) {
      setSaveError(error.message ?? 'Failed to save product')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-5" noValidate>
      {saveError && (
        <div role="alert" className="alert-error">
          {saveError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input id="name" className={fieldClass(errors.name)} {...register('name')} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          rows={30}
          className={fieldClass(errors.description, 'textarea')}
          {...register('description')}
        />
        {errors.description && <p className="field-error">{errors.description.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="label">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            className={fieldClass(errors.price)}
            {...register('price')}
          />
          {errors.price && <p className="field-error">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="label">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="0"
            step="1"
            className={fieldClass(errors.quantity)}
            {...register('quantity')}
          />
          {errors.quantity && <p className="field-error">{errors.quantity.message}</p>}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="category_id" className="label mb-0">
            Category
          </label>
          {!showNewCategory && (
            <button
              type="button"
              onClick={handleShowNewCategory}
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
          onChange={(value) => setValue('category_id', value, { shouldValidate: true })}
          onSelectNew={handleShowNewCategory}
          hasError={Boolean(errors.category_id)}
          errorMessage={errors.category_id?.message}
        />

        {showNewCategory && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              onKeyDown={handleNewCategoryKeyDown}
              placeholder="Category name"
              className="input min-w-0 flex-1"
              autoFocus
              disabled={creatingCategory}
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={creatingCategory}
              className="btn btn-primary shrink-0"
            >
              {creatingCategory ? 'Adding…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewCategory(false)
                setNewCategoryName('')
                setCreateCategoryError('')
              }}
              disabled={creatingCategory}
              className="btn btn-outline shrink-0"
            >
              Cancel
            </button>
          </div>
        )}

        {createCategoryError && <p className="field-error mt-1">{createCategoryError}</p>}
      </div>

      <div>
        <label htmlFor="external_link" className="label">
          External link
        </label>
        <input
          id="external_link"
          type="url"
          placeholder="https://"
          className={fieldClass(errors.external_link)}
          {...register('external_link')}
        />
        {errors.external_link && <p className="field-error">{errors.external_link.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="label">
          Status
        </label>
        <select id="status" className={fieldClass(errors.status, 'select')} {...register('status')}>
          <option value="available">Available</option>
          <option value="sold_out">Sold out</option>
        </select>
        {errors.status && <p className="field-error">{errors.status.message}</p>}
      </div>

      <div>
        <label htmlFor="image" className="label">
          Image
        </label>
        {product?.image_url && !imageFile && (
          <img
            src={getProductImageUrl(product.image_url)}
            alt={product.name}
            className="mb-3 h-32 w-32 rounded-[var(--radius-sm)] border border-[var(--color-border)] object-cover"
          />
        )}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          className="file-input"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Saving…' : isEditing ? 'Update product' : 'Create product'}
        </button>
      </div>
    </form>
  )
}
