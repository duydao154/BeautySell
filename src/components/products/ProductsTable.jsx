import { Link } from 'react-router-dom'
import ProductStatusBadge from '@/components/products/ProductStatusBadge'
import { useI18n } from '@/i18n/useI18n'
import { formatPrice } from '@/utils/format'

export default function ProductsTable({ products, deletingId, onDelete }) {
  const { t } = useI18n()

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{t('common.name')}</th>
            <th>{t('common.category')}</th>
            <th>{t('common.price')}</th>
            <th>{t('common.quantity')}</th>
            <th>{t('common.status')}</th>
            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="font-medium">{product.name}</td>
              <td className="text-muted">{product.category?.name ?? t('common.emDash')}</td>
              <td className="text-muted">{formatPrice(product.price)}</td>
              <td className="text-muted">
                {product.quantity} {t('common.totalLabel')}
                {product.reserved_quantity > 0 && (
                  <span style={{ color: 'var(--color-warning)', marginLeft: '6px' }}>
                    ({product.reserved_quantity} {t('common.reserved')},{' '}
                    {product.quantity - product.reserved_quantity} {t('common.free')})
                  </span>
                )}
              </td>
              <td>
                <ProductStatusBadge status={product.status} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <Link to={`/admin/products/${product.id}/edit`} className="link text-sm">
                  {t('common.edit')}
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  disabled={deletingId === product.id}
                  className="text-danger-btn ml-4"
                >
                  {deletingId === product.id ? t('common.deleting') : t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
