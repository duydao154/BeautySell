import { z } from 'zod'

export function createCategoryNameSchema(t) {
  return z.object({
    name: z.string().trim().min(1, t('validation.blank')),
  })
}
