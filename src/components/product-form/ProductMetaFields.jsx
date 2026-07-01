import FormField from '@/components/ui/FormField'
import { fieldClass } from '@/components/ui/fieldClass'
import { useI18n } from '@/i18n/useI18n'

export default function ProductMetaFields({ register, errors }) {
  const { t } = useI18n()

  return (
    <>
      <FormField
        id="external_link"
        label={t('product.externalLink')}
        error={errors.external_link?.message}
      >
        <input
          id="external_link"
          type="url"
          placeholder={t('product.externalLinkPlaceholder')}
          className={fieldClass(errors.external_link)}
          {...register('external_link')}
        />
      </FormField>

      <FormField id="status" label={t('common.status')} error={errors.status?.message}>
        <select id="status" className={fieldClass(errors.status, 'select')} {...register('status')}>
          <option value="available">{t('product.available')}</option>
          <option value="sold_out">{t('product.soldOutStatus')}</option>
        </select>
      </FormField>
    </>
  )
}
