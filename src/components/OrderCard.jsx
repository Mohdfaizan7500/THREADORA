import { Link } from 'react-router-dom'
import { Eye, Truck, RotateCcw } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import './OrderCard.css'

// Booking/order card used on My Bookings page.
export default function OrderCard({ order, onReorder }) {
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0)

  return (
    <article className="order-card card">
      <div className="order-card__thumbs">
        {order.items.slice(0, 3).map((item) => (
          <img key={`${item.id}-${item.size}-${item.color}`} src={item.image} alt={item.name} />
        ))}
        {order.items.length > 3 && (
          <span className="order-card__more">+{order.items.length - 3}</span>
        )}
      </div>

      <div className="order-card__body">
        <div className="order-card__head">
          <strong className="order-card__id">{order.id}</strong>
          <StatusBadge status={order.status} size="sm" />
        </div>

        <div className="order-card__meta">
          <span>{formatDate(order.date)}</span>
          <span className="order-card__dot" />
          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <span className="order-card__dot" />
          <strong>{formatCurrency(order.total)}</strong>
          <span className="order-card__dot" />
          <span className="muted">Est. {formatDate(order.estimatedDelivery)}</span>
        </div>
      </div>

      <div className="order-card__actions">
        <Link className="btn btn--outline btn--sm" to={`/booking/${order.id}`}>
          <Eye size={15} /> Details
        </Link>
        <Link className="btn btn--primary btn--sm" to={`/track-order?order=${order.id}`}>
          <Truck size={15} /> Track
        </Link>
        <button className="btn btn--ghost btn--sm" onClick={() => onReorder?.(order)} aria-label="Reorder">
          <RotateCcw size={15} />
        </button>
      </div>
    </article>
  )
}