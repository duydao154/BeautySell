import { Link } from 'react-router-dom'
import ProductStatusBadge from '@/components/products/ProductStatusBadge'
import { formatPrice } from '@/utils/format'

export default function ProductsTable({ products, deletingId, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="font-medium">{product.name}</td>
              <td className="text-muted">{product.category?.name ?? '—'}</td>
              <td className="text-muted">{formatPrice(product.price)}</td>
              <td className="text-muted">{product.quantity}</td>
              <td>
                <ProductStatusBadge status={product.status} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <Link to={`/admin/products/${product.id}/edit`} className="link text-sm">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  disabled={deletingId === product.id}
                  className="text-danger-btn ml-4"
                >
                  {deletingId === product.id ? 'Deleting…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
