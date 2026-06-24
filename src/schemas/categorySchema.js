import { z } from 'zod'

export const categoryNameSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
})
