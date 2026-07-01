import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import LanguageSelect from '@/components/ui/LanguageSelect'
import { createAdminLoginSchema } from '@/schemas/adminLoginSchema'
import { useI18n } from '@/i18n/useI18n'
import { signInWithPassword } from '@/utils/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { t, mapError } = useI18n()
  const [authError, setAuthError] = useState('')

  const schema = useMemo(() => createAdminLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit({ email, password }) {
    setAuthError('')

    try {
      await signInWithPassword(email, password)
      navigate('/admin')
    } catch (signInError) {
      setAuthError(mapError(signInError))
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 self-end">
        <LanguageSelect />
      </div>
      <div className="card w-full max-w-md p-6">
        <h1 className="page-title text-center">{t('admin.loginTitle')}</h1>
        <p className="page-subtitle text-center">{t('admin.loginSubtitle')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
          {authError && (
            <div role="alert" className="alert-error">
              {authError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">
              {t('common.email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`input ${errors.email ? 'input--error' : ''}`}
              placeholder={t('admin.emailPlaceholder')}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="label">
              {t('common.password')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`input ${errors.password ? 'input--error' : ''}`}
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="field-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block">
            {isSubmitting ? t('common.signingIn') : t('admin.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
}
