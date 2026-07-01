import { z } from 'zod'

export const PRODUCT_STATUSES = ['available', 'sold_out']

export function createProductSchema(t) {
  return z.object({
    name: z.string().min(1, t('validation.blank')),
    description: z.string(),
    price: z.coerce.number().min(0, t('validation.priceMin')),
    external_link: z
      .string()
      .refine((value) => value === '' || z.url().safeParse(value).success, {
        message: t('validation.urlInvalid'),
      }),
    quantity: z.coerce.number().int().min(0, t('validation.quantityMin')),
    status: z.enum(['available', 'sold_out']),
    category_id: z
      .string()
      .min(1, t('validation.blank'))
      .uuid(t('validation.blank')),
  })
}
