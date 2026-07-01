import { Link, Outlet } from 'react-router-dom'
import CartLink from '@/components/ui/CartLink'
import CurrencySelect from '@/components/ui/CurrencySelect'
import LanguageSelect from '@/components/ui/LanguageSelect'
import { useI18n } from '@/i18n/useI18n'

export default function ShopLayout() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="page-header flex items-center gap-4 px-6 py-4">
        <Link to="/" className="brand-label">
          {t('app.title')}
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSelect />
          <CurrencySelect />
          <CartLink />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
