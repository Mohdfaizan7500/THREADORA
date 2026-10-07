import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Copy, Truck, Calendar, Hash, ArrowRight, Receipt } from 'lucide-react'
import { useOrders } from '../context/OrdersContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import { useCopyToClipboard } from '../hooks/index.js'
import { PackageSearch } from 'lucide-react'
import './BookingSuccess.css'

export default function BookingSuccess() {
  const { id } = useParams()
  const { getOrder } = useOrders()
  const { success } = useToast()
  const copy = useCopyToClipboard()
  const order = getOrder(id)

  if (!order) {
    return (
      <div className="page-top">
        <EmptyState
          icon={PackageSearch}
          title="Booking not found"
          message="We couldn't find that booking. It may have been removed."
          actionLabel="Go Home"
          actionTo="/"
        />
      </div>
    )
  }

  const onCopy = async () => {
    const ok = await copy(order.id)
    if (ok) success('Order ID copied')
  }

  return (
    <div className="booking-success page-top">
      <div className="container booking-success__inner">
        <div className="booking-success__badge">
          <CheckCircle2 size={44} strokeWidth={2} />
        </div>
        <span className="eyebrow">Booking confirmed</span>
        <h1>Your booking has been confirmed!</h1>
        <p className="muted booking-success__sub">
          Thank you{order.customer ? `, ${order.customer.split(' ')[0]}` : ''}. We've received your order and
          you'll be able to track it every step of the way.
        </p>

        <button className="booking-success__order-id" onClick={onCopy} title="Copy Order ID">
          <Hash size={17} />
          <span>{order.id}</span>
          <Copy size={15} />
        </button>

        <div className="booking-success__cards">
          <InfoCard icon={Calendar} label="Booking Date" value={formatDate(order.date)} />
          <InfoCard icon={Truck} label="Estimated Delivery" value={formatDate(order.estimatedDelivery)} highlight />
          <InfoCard icon={Receipt} label="Total Amount" value={formatCurrency(order.total)} />
        </div>

        <div className="booking-success__notice">
          <p>
            A confirmation has been sent to <strong>{order.email || 'your email'}</strong>.
            Save your Order ID to track this booking anytime.
          </p>
        </div>

        <div className="booking-success__actions">
          <Link className="btn btn--primary btn--lg" to={`/track-order?order=${order.id}`}>
            <Truck size={18} /> Track Order
          </Link>
          <Link className="btn btn--outline btn--lg" to="/my-bookings">
            My Bookings
          </Link>
          <Link className="btn btn--ghost" to="/shop">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`success-info ${highlight ? 'is-highlight' : ''}`}>
      <span className="success-info__icon"><Icon size={20} /></span>
      <span className="success-info__label">{label}</span>
      <strong className="success-info__value">{value}</strong>
    </div>
  )
}