import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'

export default function ProductMetaFields({ register, errors }) {
  return (
    <>
      <FormField id="external_link" label="External link" error={errors.external_link?.message}>
        <input
          id="external_link"
          type="url"
          placeholder="https://"
          className={fieldClass(errors.external_link)}
          {...register('external_link')}
        />
      </FormField>

      <FormField id="status" label="Status" error={errors.status?.message}>
        <select id="status" className={fieldClass(errors.status, 'select')} {...register('status')}>
          <option value="available">Available</option>
          <option value="sold_out">Sold out</option>
        </select>
      </FormField>
    </>
  )
}
