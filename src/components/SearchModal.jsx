import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatCurrency, truncate } from '../utils/format.js'
import Rating from './Rating.jsx'
import { useDebouncedValue, useScrollLock } from '../hooks/index.js'
import './SearchModal.css'

const SUGGESTIONS = ['Shirt', 'Dress', 'Watch', 'Shoes', 'Bag', 'Sunglasses', 'Women']

export default function SearchModal({ open, onClose }) {
  const { products } = useProducts()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 180)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  useScrollLock(open)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) =>
        [p.name, p.categoryLabel, p.category, p.brand, p.type]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8)
  }, [debounced, products])

  const go = (path) => {
    onClose()
    navigate(path)
  }

  if (!open) return null

  const hasQuery = debounced.trim().length > 0

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search products" onMouseDown={onClose}>
      <div className="search-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="search-panel__bar">
          <Search size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="search-panel__input"
            placeholder="Search for shirts, denim, jackets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button className="icon-btn" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <div className="search-panel__body">
          {!hasQuery && (
            <div className="search-suggest">
              <p className="search-suggest__label"><TrendingUp size={15} /> Trending searches</p>
              <div className="search-suggest__chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasQuery && results.length === 0 && (
            <div className="search-empty">
              <p>No products found for “{debounced}”.</p>
              <span className="muted">Try a different keyword like “shirt” or “denim”.</span>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="search-results__count">{results.length} result{results.length > 1 ? 's' : ''} for “{debounced}”</p>
              <ul className="search-results">
                {results.map((p) => (
                  <li key={p.id}>
                    <button className="search-result" onClick={() => go(`/product/${p.id}`)}>
                      <img src={p.image} alt={p.name} />
                      <div className="search-result__info">
                        <span className="search-result__cat">{p.categoryLabel}</span>
                        <span className="search-result__name">{truncate(p.name, 42)}</span>
                        <Rating value={p.rating} size={12} showValue={false} />
                      </div>
                      <span className="search-result__price">{formatCurrency(p.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="search-viewall" onClick={() => go(`/shop?search=${encodeURIComponent(debounced)}`)}>
                View all results in Shop <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}