export default function FormField({ id, label, error, children, labelClassName = 'label' }) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
