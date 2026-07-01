import { Link } from 'react-router-dom'
import { useShop } from '@/hooks/useShop'
import { useI18n } from '@/i18n/useI18n'

export default function AdminDashboard() {
  const { shop } = useShop()
  const { t } = useI18n()

  return (
    <div>
      <h1 className="page-title">{t('admin.dashboardTitle')}</h1>
      <p className="page-subtitle">
        {t('admin.managing', { name: shop.name, slug: shop.slug })}
      </p>
      <div className="mt-6 flex gap-4">
        <Link to="/admin/products" className="card card-link px-4 py-3 text-sm font-medium">
          {t('admin.manageProducts')}
        </Link>
        <Link to="/admin/products/import" className="card card-link px-4 py-3 text-sm font-medium">
          {t('admin.bulkImport')}
        </Link>
        <Link to="/admin/orders" className="card card-link px-4 py-3 text-sm font-medium">
          {t('nav.orders')}
        </Link>
        <Link to="/admin/categories" className="card card-link px-4 py-3 text-sm font-medium">
          {t('admin.manageCategories')}
        </Link>
      </div>
    </div>
  )
}
