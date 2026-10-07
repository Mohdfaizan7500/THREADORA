import './Loader.css'

export default function Loader({ label = 'Loading…', full = false }) {
  return (
    <div className={`loader ${full ? 'loader--full' : ''}`} role="status" aria-live="polite">
      <span className="loader__spinner" />
      {label && <span className="loader__label">{label}</span>}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--img" />
      <div className="skeleton skeleton--line" style={{ width: '70%' }} />
      <div className="skeleton skeleton--line" style={{ width: '45%' }} />
      <div className="skeleton skeleton--line" style={{ width: '55%' }} />
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}