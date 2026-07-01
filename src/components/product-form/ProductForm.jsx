import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import ProductBasicFields from '@/components/product-form/ProductBasicFields'
import ProductCategoryField from '@/components/product-form/ProductCategoryField'
import ProductImageField from '@/components/product-form/ProductImageField'
import ProductMetaFields from '@/components/product-form/ProductMetaFields'
import ProductPricingFields from '@/components/product-form/ProductPricingFields'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useCategories } from '@/hooks/useCategories'
import { useNewCategory } from '@/hooks/useNewCategory'
import { useShop } from '@/hooks/useShop'
import { useI18n } from '@/i18n/useI18n'
import { createProductSchema } from '@/schemas/productSchema'
import { createProduct, updateProduct } from '@/utils/products'
import { uploadProductImage } from '@/utils/storage'

function needsSoldOutConfirmation(values) {
  return values.quantity > 0 && values.status === 'sold_out'
}

export default function ProductForm({ product, onSaved }) {
  const navigate = useNavigate()
  const { shopId } = useShop()
  const { t, mapError } = useI18n()
  const { categories, loading: categoriesLoading, error: categoriesError, createCategory } =
    useCategories(shopId)
  const [imageFile, setImageFile] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingValues, setPendingValues] = useState(null)
  const isEditing = Boolean(product)

  const schema = useMemo(() => createProductSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
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

  async function saveProduct(values) {
    setSaveError('')
    setSaving(true)

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
      setSaveError(mapError(error) || t('errors.failedSaveProduct'))
    } finally {
      setSaving(false)
    }
  }

  function handleFormSubmit(values) {
    if (needsSoldOutConfirmation(values)) {
      setPendingValues(values)
      return
    }

    saveProduct(values)
  }

  function handleConfirmSoldOut() {
    if (!pendingValues) return
    const values = pendingValues
    setPendingValues(null)
    saveProduct(values)
  }

  const isBusy = isSubmitting || saving

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto max-w-xl space-y-5" noValidate>
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

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => navigate('/admin/products')}
            className="btn btn-primary"
          >
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={isBusy} className="btn btn-primary">
            {isBusy
              ? t('common.saving')
              : isEditing
                ? t('admin.updateProduct')
                : t('admin.createProduct')}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={pendingValues !== null}
        title={t('product.soldOutStockConfirmTitle')}
        message={t('product.soldOutStockConfirmMessage', {
          quantity: pendingValues?.quantity ?? 0,
        })}
        cancelLabel={t('common.cancel')}
        confirmLabel={isEditing ? t('admin.updateProduct') : t('admin.createProduct')}
        onCancel={() => setPendingValues(null)}
        onConfirm={handleConfirmSoldOut}
        confirming={saving}
      />
    </>
  )
}
