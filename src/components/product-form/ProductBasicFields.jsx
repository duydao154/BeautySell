import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'
import { useI18n } from '@/i18n/useI18n'

export default function ProductBasicFields({ register, errors }) {
  const { t } = useI18n()

  return (
    <>
      <FormField id="name" label={t('common.name')} error={errors.name?.message}>
        <input id="name" className={fieldClass(errors.name)} {...register('name')} />
      </FormField>

      <FormField id="description" label={t('common.description')} error={errors.description?.message}>
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
