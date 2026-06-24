export default function CategoryList({ categories, deletingId, onDelete }) {
  return (
    <ul className="mt-6 divide-y divide-[var(--color-border)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
      {categories.map((category) => (
        <li key={category.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="font-medium">{category.name}</span>
          <button
            type="button"
            onClick={() => onDelete(category)}
            disabled={deletingId === category.id}
            className="text-danger-btn text-sm"
          >
            {deletingId === category.id ? 'Deleting…' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  )
}
