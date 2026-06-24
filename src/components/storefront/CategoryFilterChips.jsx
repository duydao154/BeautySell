export default function CategoryFilterChips({ categories, selectedCategory, onSelect }) {
  if (categories.length === 0) return null

  return (
    <div className="filter-chips" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`filter-chip${selectedCategory === 'all' ? ' filter-chip--active' : ''}`}
        aria-pressed={selectedCategory === 'all'}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`filter-chip${selectedCategory === category ? ' filter-chip--active' : ''}`}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
