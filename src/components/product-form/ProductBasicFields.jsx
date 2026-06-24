import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'

export default function ProductBasicFields({ register, errors }) {
  return (
    <>
      <FormField id="name" label="Name" error={errors.name?.message}>
        <input id="name" className={fieldClass(errors.name)} {...register('name')} />
      </FormField>

      <FormField id="description" label="Description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={30}
          className={fieldClass(errors.description, 'textarea')}
          {...register('description')}
        />
      </FormField>
    </>
  )
}
