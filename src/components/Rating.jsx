import { Link } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'
import './Rating.css'

// Accessible star rating with half-star support.
export default function Rating({ value = 0, count, size = 14, showValue = true }) {
  const full = Math.floor(value)
  const hasHalf = value - full >= 0.4
  const stars = [0, 1, 2, 3, 4]

  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      <span className="rating__stars" aria-hidden="true">
        {stars.map((i) => {
          if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={1.5} />
          if (i === full && hasHalf)
            return <StarHalf key={i} size={size} fill="currentColor" strokeWidth={1.5} />
          return <Star key={i} size={size} className="rating__empty" strokeWidth={1.5} />
        })}
      </span>
      {showValue && <span className="rating__value">{value.toFixed(1)}</span>}
      {count != null && <span className="rating__count">({count})</span>}
    </div>
  )
}

export function RatingLink({ value, count, size = 13 }) {
  return (
    <Link to="#reviews" className="rating rating--link">
      <Rating value={value} count={count} size={size} />
    </Link>
  )
}