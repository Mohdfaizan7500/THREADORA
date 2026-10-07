import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Pagination.css'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__arrow"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pagination__gap">…</span>
        ) : (
          <button
            key={p}
            className={`pagination__page ${p === page ? 'is-active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="pagination__arrow"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}