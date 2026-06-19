export default function Label({ children, clay = false, className = '' }) {
  return (
    <div className={`label-rule ${className}`.trim()}>
      <span className="label-rule__line" aria-hidden="true" />
      <span className={`label-sm ${clay ? 'label-sm--clay' : ''}`}>{children}</span>
    </div>
  )
}
