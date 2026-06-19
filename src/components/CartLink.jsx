import { Link } from 'react-router-dom'
import { selectCartItemCount, useCartStore } from '../store/cartStore'

export default function CartLink() {
  const itemCount = useCartStore(selectCartItemCount)

  return (
    <Link to="/cart" className="cart-link" aria-label={`Cart${itemCount ? `, ${itemCount} items` : ''}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cart-link__icon"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && <span className="cart-link__badge">{itemCount}</span>}
    </Link>
  )
}
