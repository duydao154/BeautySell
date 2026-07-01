import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '@/components/product-form/ProductForm'
import { useI18n } from '@/i18n/useI18n'

export default function AdminProductNew() {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div>
      <Link to="/admin/products" className="link text-sm">
        {t('admin.backToProducts')}
      </Link>
      <h1 className="page-title mt-2">{t('admin.addProduct')}</h1>
      <div className="mt-6">
        <ProductForm onSaved={() => navigate('/admin/products')} />
      </div>
    </div>
  )
}
