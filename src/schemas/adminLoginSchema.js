import { z } from 'zod'

export function createAdminLoginSchema(t) {
  return z.object({
    email: z
      .string()
      .min(1, t('validation.blank'))
      .pipe(z.email(t('validation.emailInvalid'))),
    password: z.string().min(1, t('validation.blank')),
  })
}
