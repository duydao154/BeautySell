import { Link, useParams } from 'react-router-dom'
import { selectCartItemCount, useCartStore } from '@/store/cartStore'
import { useI18n } from '@/i18n/useI18n'

export default function CartLink() {
  const { slug: routeSlug } = useParams()
  const { t } = useI18n()
  const itemCount = useCartStore(selectCartItemCount)
  const cartShopSlug = useCartStore((state) => state.items[0]?.shopSlug)
  const slug = routeSlug ?? cartShopSlug

  if (!slug) {
    return null
  }

  return (
    <Link
      to={`/cart/${slug}`}
      className="cart-link"
      aria-label={
        itemCount
          ? t('nav.cartWithItems', { count: itemCount })
          : t('nav.cart')
      }
    >
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
