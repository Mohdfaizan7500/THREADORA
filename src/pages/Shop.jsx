import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, X, CloudOff } from 'lucide-react'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Drawer from '../components/Drawer.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonGrid } from '../components/Loader.jsx'
import FilterSidebar, {
  DEFAULT_FILTERS,
  applyFilters,
  sortProducts,
  countActiveFilters,
} from '../components/FilterSidebar.jsx'
import { useDebouncedValue, useMediaQuery } from '../hooks/index.js'
import { SearchX } from 'lucide-react'
import './Shop.css'

const PER_PAGE = 20

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  const searchParam = searchParams.get('search') || ''
  const sortParam = searchParams.get('sort') || 'featured'

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    categories: categoryParam ? [categoryParam] : [],
  })
  const [sort, setSort] = useState(sortParam)
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState(searchParam)
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { products, loading, error, retry, categories, brands, priceBounds } = useProducts()
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const debouncedSearch = useDebouncedValue(search, 220)

  // Keep URL in sync when the category/search query params change.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: categoryParam ? [categoryParam] : [],
    }))
    setPage(1)
  }, [categoryParam])

  useEffect(() => {
    setSearch(searchParam)
  }, [searchParam])

  useEffect(() => {
    setSort(sortParam)
  }, [sortParam])

  const processed = useMemo(() => {
    const filtered = applyFilters(products, filters, debouncedSearch)
    return sortProducts(filtered, sort)
  }, [products, filters, debouncedSearch, sort])

  const totalPages = Math.max(1, Math.ceil(processed.length / PER_PAGE))
  const pageItems = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const activeCount = countActiveFilters(filters, priceBounds.max)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  const updateSort = (value) => {
    setSort(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'featured') next.delete('sort')
    else next.set('sort', value)
    setSearchParams(next, { replace: true })
    setPage(1)
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS })
    setSearch('')
    const next = new URLSearchParams(searchParams)
    next.delete('category')
    next.delete('search')
    setSearchParams(next, { replace: true })
    setPage(1)
  }

  const activeCategory = categories.find((c) => c.id === categoryParam)

  return (
    <div className="shop">
      <div className="shop__banner">
        <div className="container">
          <span className="eyebrow">{activeCategory ? activeCategory.title : 'The collection'}</span>
          <h1>{activeCategory ? activeCategory.title : 'Shop All'}</h1>
          <p className="muted">
            {activeCategory
              ? activeCategory.blurb
              : 'Premium everyday pieces, thoughtfully made. Filter to find your fit.'}
          </p>
        </div>
      </div>

      <div className="container shop__layout">
        {/* Desktop sidebar */}
        <aside className="shop__sidebar">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            categories={categories}
            brands={brands}
            priceBounds={priceBounds}
          />
        </aside>

        {/* Main */}
        <div className="shop__main">
          <div className="shop__toolbar">
            <div className="shop__search">
              <input
                type="search"
                placeholder="Search products…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search products"
              />
              {search && (
                <button className="icon-btn" onClick={() => handleSearch('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="shop__toolbar-row">
              <button className="btn btn--outline btn--sm shop__filter-btn" onClick={() => setDrawerOpen(true)}>
                <SlidersHorizontal size={16} /> Filters
                {activeCount > 0 && <span className="shop__filter-count">{activeCount}</span>}
              </button>

              <span className="shop__count">
                <strong>{processed.length}</strong> products
              </span>

              <div className="shop__sort">
                <label className="sr-only" htmlFor="sort">Sort by</label>
                <select
                  id="sort"
                  className="select"
                  value={sort}
                  onChange={(e) => updateSort(e.target.value)}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="shop__sort-icon" />
              </div>

              <div className="shop__view" role="group" aria-label="View mode">
                <button
                  className={`shop__view-btn ${view === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  className={`shop__view-btn ${view === 'list' ? 'is-active' : ''}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                >
                  <List size={17} />
                </button>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="shop__active">
                {filters.categories.map((c) => (
                  <Chip key={c} label={categories.find((x) => x.id === c)?.title || c} onRemove={() => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) })} />
                ))}
                {filters.sizes.map((s) => (
                  <Chip key={s} label={`Size ${s}`} onRemove={() => setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) })} />
                ))}
                {filters.colors.map((c) => (
                  <Chip key={c} label={c} onRemove={() => setFilters({ ...filters, colors: filters.colors.filter((x) => x !== c) })} />
                ))}
                <button className="shop__clear" onClick={resetFilters}>Clear all</button>
              </div>
            )}
          </div>

{loading ? (
            <SkeletonGrid count={10} />
          ) : error ? (
            <EmptyState
              icon={CloudOff}
              title="Couldn't load products"
              message={error}
              actionLabel="Try again"
              onAction={retry}
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No products found"
              message="We couldn't find anything matching your filters. Try adjusting your search."
              actionLabel="Clear filters"
              onAction={resetFilters}
            />
          ) : (
            <>
              <div className={`product-grid ${view === 'list' ? 'product-grid--list' : ''}`}>
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} view={view} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side="left"
          title="Filters"
          width={340}
          footer={
            <>
              <button className="btn btn--outline btn--block" onClick={resetFilters}>Clear all</button>
              <button className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
                Show {processed.length} results
              </button>
            </>
          }
        >
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            categories={categories}
            brands={brands}
            priceBounds={priceBounds}
          />
        </Drawer>
      )}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="chip-tag">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={13} />
      </button>
    </span>
  )
}