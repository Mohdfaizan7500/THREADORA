import { Star, X } from 'lucide-react'
import { COLORS, SIZES } from '../data/products.js'
import { formatCurrency, clamp } from '../utils/format.js'
import './FilterSidebar.css'

const RATING_OPTIONS = [4.5, 4, 3.5, 3]

function priceStep(max) {
  return Math.max(1, Math.round(max / 100))
}

// Reusable filter panel. `filters` is a controlled object owned by the Shop page.
// Categories/brands/price bounds are provided by the loaded product data.
export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  onClose,
  showClose = false,
  categories = [],
  brands = [],
  priceBounds = { min: 0, max: 100 },
}) {
  const set = (patch) => onChange({ ...filters, ...patch })

  const toggleInArray = (key, value) => {
    const arr = filters[key] || []
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    set({ [key]: next })
  }

  return (
    <div className="filters">
      <div className="filters__head">
        <h3>Filters</h3>
        <div className="filters__head-actions">
          <button className="filters__reset" onClick={onReset}>Clear all</button>
          {showClose && (
            <button className="icon-btn" onClick={onClose} aria-label="Close filters">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <FilterGroup title="Categories">
        <ul className="filter-list">
          {categories.map((c) => (
            <li key={c.id}>
              <label className="filter-check">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(c.id)}
                  onChange={() => toggleInArray('categories', c.id)}
                />
                <span className="filter-check__box" aria-hidden="true" />
                <span>{c.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="size-grid">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`size-pill ${(filters.sizes || []).includes(s) ? 'is-active' : ''}`}
              onClick={() => toggleInArray('sizes', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="color-grid">
          {COLORS.map((c) => {
            const active = (filters.colors || []).includes(c.name)
            return (
              <button
                key={c.name}
                className={`color-chip ${active ? 'is-active' : ''}`}
                onClick={() => toggleInArray('colors', c.name)}
                aria-pressed={active}
              >
                <span className="color-chip__dot" style={{ background: c.hex }} />
                {c.name}
              </button>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Price Range">
        <div className="price-range">
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={priceStep(priceBounds.max)}
            value={filters.maxPrice ?? priceBounds.max}
            onChange={(e) => set({ maxPrice: Number(e.target.value) })}
            aria-label="Maximum price"
          />
          <div className="price-range__labels">
            <span>{formatCurrency(priceBounds.min)}</span>
            <strong>Up to {formatCurrency(filters.maxPrice ?? priceBounds.max)}</strong>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <ul className="filter-list">
          {RATING_OPTIONS.map((r) => (
            <li key={r}>
              <label className="filter-check">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === r}
                  onChange={() => set({ minRating: filters.minRating === r ? 0 : r })}
                />
                <span className="filter-check__box filter-check__box--radio" aria-hidden="true" />
                <span className="rating-filter">
                  <Star size={13} fill="currentColor" /> {r} & above
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Availability">
        <ul className="filter-list">
          <li>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={filters.inStockOnly || false}
                onChange={(e) => set({ inStockOnly: e.target.checked })}
              />
              <span className="filter-check__box" aria-hidden="true" />
              <span>In Stock</span>
            </label>
          </li>
        </ul>
      </FilterGroup>

      <FilterGroup title="Brand">
        <ul className="filter-list">
          {brands.map((b) => (
            <li key={b}>
              <label className="filter-check">
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(b)}
                  onChange={() => toggleInArray('brands', b)}
                />
                <span className="filter-check__box" aria-hidden="true" />
                <span>{b}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

export const DEFAULT_FILTERS = {
  categories: [],
  sizes: [],
  colors: [],
  brands: [],
  maxPrice: null,
  minRating: 0,
  inStockOnly: false,
}

export function applyFilters(products, filters, search = '') {
  const q = search.trim().toLowerCase()
  return products.filter((p) => {
    if (q && ![p.name, p.categoryLabel, p.category, p.brand, p.type].join(' ').toLowerCase().includes(q))
      return false
    if (filters.categories?.length && !filters.categories.includes(p.category)) return false
    if (filters.sizes?.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false
    if (filters.colors?.length && !p.colors.some((c) => filters.colors.includes(c))) return false
    if (filters.brands?.length && !filters.brands.includes(p.brand)) return false
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false
    if (filters.minRating && p.rating < filters.minRating) return false
    if (filters.inStockOnly && !p.inStock) return false
    return true
  })
}

export function sortProducts(products, sort) {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return list.sort((a, b) => b.id - a.id)
    case 'discount':
      return list.sort((a, b) => b.discount - a.discount)
    default:
      return list
  }
}

export function countActiveFilters(filters, maxPrice = Infinity) {
  let n = 0
  n += filters.categories?.length || 0
  n += filters.sizes?.length || 0
  n += filters.colors?.length || 0
  n += filters.brands?.length || 0
  if (filters.minRating) n += 1
  if (filters.inStockOnly) n += 1
  if (filters.maxPrice != null && filters.maxPrice < maxPrice) n += 1
  return n
}

export { clamp }