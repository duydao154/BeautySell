export default function ProductStatusBadge({ status }) {
  const isAvailable = status === 'available'

  return (
    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-sold-out'}`}>
      {isAvailable ? 'Available' : 'Sold out'}
    </span>
  )
}
