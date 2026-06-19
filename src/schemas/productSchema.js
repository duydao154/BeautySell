import { z } from 'zod'

export const PRODUCT_STATUSES = ['available', 'sold_out']

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  external_link: z
    .string()
    .refine((value) => value === '' || z.url().safeParse(value).success, {
      message: 'Enter a valid URL',
    }),
  quantity: z.coerce.number().int().min(0, 'Quantity must be 0 or greater'),
  status: z.enum(['available', 'sold_out']),
})
