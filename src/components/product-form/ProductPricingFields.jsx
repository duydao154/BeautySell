import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'

export default function ProductPricingFields({ register, errors }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField id="price" label="Price" error={errors.price?.message}>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          className={fieldClass(errors.price)}
          {...register('price')}
        />
      </FormField>

      <FormField id="quantity" label="Quantity" error={errors.quantity?.message}>
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
