import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ProductBasicFields from '@/components/product-form/ProductBasicFields'
import ProductCategoryField from '@/components/product-form/ProductCategoryField'
import ProductImageField from '@/components/product-form/ProductImageField'
import ProductMetaFields from '@/components/product-form/ProductMetaFields'
import ProductPricingFields from '@/components/product-form/ProductPricingFields'
import { useCategories } from '@/hooks/useCategories'
import { useNewCategory } from '@/hooks/useNewCategory'
import { useShop } from '@/hooks/useShop'
import { productSchema } from '@/schemas/productSchema'
import { createProduct, updateProduct } from '@/utils/products'
import { uploadProductImage } from '@/utils/storage'

export default function ProductForm({ product, onSaved }) {
  const { shopId } = useShop()
  const { categories, loading: categoriesLoading, error: categoriesError, createCategory } =
    useCategories(shopId)
  const [imageFile, setImageFile] = useState(null)
  const [saveError, setSaveError] = useState('')
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

  const {
    showNewCategory,
    newCategoryName,
    creatingCategory,
    createCategoryError,
    setNewCategoryName,
    handleShowNewCategory,
    handleCancelNewCategory,
    handleCreateCategory,
    handleNewCategoryKeyDown,
  } = useNewCategory({
    createCategory,
    onCategoryCreated: (id) => setValue('category_id', id, { shouldValidate: true }),
  })

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
        await updateProduct(product.id, payload)
      } else {
        await createProduct({ ...payload, shop_id: shopId })
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

      <ProductBasicFields register={register} errors={errors} />
      <ProductPricingFields register={register} errors={errors} />

      <ProductCategoryField
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        categoryId={categoryId}
        showNewCategory={showNewCategory}
        newCategoryName={newCategoryName}
        creatingCategory={creatingCategory}
        createCategoryError={createCategoryError}
        categoryFieldError={errors.category_id?.message}
        onCategoryChange={(value) => setValue('category_id', value, { shouldValidate: true })}
        onShowNewCategory={handleShowNewCategory}
        onNewCategoryNameChange={setNewCategoryName}
        onCreateCategory={handleCreateCategory}
        onCancelNewCategory={handleCancelNewCategory}
        onNewCategoryKeyDown={handleNewCategoryKeyDown}
      />

      <ProductMetaFields register={register} errors={errors} />
      <ProductImageField
        product={product}
        imageFile={imageFile}
        onImageFileChange={setImageFile}
      />

      <div className="flex gap-3 pt-2 justify-end">
        <button type="button" disabled={isSubmitting} onClick={() => navigate('/admin/products')} className="btn btn-primary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Saving…' : isEditing ? 'Update product' : 'Create product'}
        </button>
      </div>
    </form>
  )
}
