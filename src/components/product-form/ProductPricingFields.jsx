import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'
import { useI18n } from '@/i18n/useI18n'

export default function ProductPricingFields({ register, errors }) {
  const { t } = useI18n()

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField id="price" label={t('common.price')} error={errors.price?.message}>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          className={fieldClass(errors.price)}
          {...register('price')}
        />
      </FormField>

      <FormField id="quantity" label={t('common.quantity')} error={errors.quantity?.message}>
        <input
          id="quantity"
          type="number"
          min="0"
          step="1"
          className={fieldClass(errors.quantity)}
          {...register('quantity')}
        />
      </FormField>
    </div>
  )
}
