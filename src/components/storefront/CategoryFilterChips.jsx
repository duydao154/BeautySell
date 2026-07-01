import { useI18n } from '@/i18n/useI18n'

export default function CategoryFilterChips({ categories, selectedCategory, onSelect }) {
  const { t } = useI18n()

  if (categories.length === 0) return null

  return (
    <div className="filter-chips" role="group" aria-label={t('shop.filterByCategory')}>
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`filter-chip${selectedCategory === 'all' ? ' filter-chip--active' : ''}`}
        aria-pressed={selectedCategory === 'all'}
      >
        {t('common.all')}
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
