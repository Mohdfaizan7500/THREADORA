import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Truck,
  Copy,
  MapPin,
  CreditCard,
  Package,
  Calendar,
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import TrackingTimeline from '../components/TrackingTimeline.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import { useCopyToClipboard } from '../hooks/index.js'
import { PackageSearch } from 'lucide-react'
import './BookingDetails.css'

export default function BookingDetails() {
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
          message="We couldn't find that booking. Please check the link and try again."
          actionLabel="My Bookings"
          actionTo="/my-bookings"
        />
      </div>
    )
  }

  const onCopy = async (text) => {
    const ok = await copy(text)
    if (ok) success('Order ID copied')
  }

  return (
    <div className="bdetails page-top">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/my-bookings">My Bookings</Link>
          <span className="breadcrumb__item"><ChevronRight size={13} /><span>{order.id}</span></span>
        </nav>

        <header className="bdetails__head">
          <div>
            <span className="eyebrow">Booking details</span>
            <h1>{order.id}</h1>
          </div>
          <div className="bdetails__head-actions">
            <StatusBadge status={order.status} />
            <Link className="btn btn--primary btn--sm" to={`/track-order?order=${order.id}`}>
              <Truck size={15} /> Track Order
            </Link>
          </div>
        </header>

        <div className="bdetails__grid">
          <div className="bdetails__main">
            {/* Order information */}
            <section className="bdetails__card card">
              <h2>Order Information</h2>
              <div className="bdetails__info-grid">
                <Info icon={Package} label="Order ID" value={order.id} onCopy={() => onCopy(order.id)} />
                <Info icon={Calendar} label="Booking Date" value={formatDate(order.date)} />
                <Info icon={CreditCard} label="Payment Method" value={order.paymentMethod} />
                <Info icon={Truck} label="Order Status" value={order.status} />
              </div>
            </section>

            {/* Products */}
            <section className="bdetails__card card">
              <h2>Products</h2>
              <ul className="bdetails__products">
                {order.items.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="bdetails__product">
                    <img src={item.image} alt={item.name} />
                    <div className="bdetails__product-info">
                      <Link to={`/product/${item.id}`} className="bdetails__product-name">{item.name}</Link>
                      <span className="muted">{item.categoryLabel}</span>
                      <div className="bdetails__product-attrs">
                        <span>Size <strong>{item.size}</strong></span>
                        <span>Color <strong>{item.color}</strong></span>
                        <span>Qty <strong>{item.quantity}</strong></span>
                      </div>
                    </div>
                    <span className="bdetails__product-price">{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Delivery address */}
            <section className="bdetails__card card">
              <h2>Delivery Address</h2>
              <div className="bdetails__address">
                <span className="bdetails__address-icon"><MapPin size={20} /></span>
                <div>
                  <strong>{order.customer}</strong>
                  <p>{order.address.line1}</p>
                  {order.address.line2 && <p>{order.address.line2}</p>}
                  <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                  <p className="muted">{order.phone}</p>
                </div>
              </div>
            </section>

            {/* Tracking */}
            <section className="bdetails__card card">
              <h2>Tracking</h2>
              <TrackingTimeline
                timeline={order.timeline}
                status={order.status}
                cancelled={order.status === 'Cancelled'}
              />
            </section>
          </div>

          {/* Price details */}
          <aside className="bdetails__side">
            <section className="bdetails__card card bdetails__price">
              <h2>Price Details</h2>
              <dl className="summary__rows">
                <div className="summary__row"><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
                {order.discount > 0 && (
                  <div className="summary__row summary__row--save"><dt>Discount</dt><dd>− {formatCurrency(order.discount)}</dd></div>
                )}
                <div className="summary__row">
                  <dt>Delivery Fee</dt>
                  <dd>{order.deliveryFee === 0 ? <span className="summary__free">Free</span> : formatCurrency(order.deliveryFee)}</dd>
                </div>
              </dl>
              <div className="summary__total">
                <span>Final Total</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>

              <div className="bdetails__courier">
                <div><span className="muted">Courier</span><strong>{order.courier}</strong></div>
                <div><span className="muted">Tracking ID</span><strong>{order.trackingNumber}</strong></div>
                <div><span className="muted">Est. delivery</span><strong>{formatDate(order.estimatedDelivery)}</strong></div>
              </div>

              <Link className="btn btn--primary btn--block" to={`/track-order?order=${order.id}`}>
                <Truck size={16} /> Track this order
              </Link>
              <Link className="btn btn--ghost btn--block" to="/my-bookings">Back to bookings</Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, label, value, onCopy }) {
  return (
    <div className="bdetails__info">
      <span className="bdetails__info-icon"><Icon size={17} /></span>
      <div>
        <span className="bdetails__info-label">{label}</span>
        <strong>{value}</strong>
      </div>
      {onCopy && (
        <button className="track__copy" onClick={onCopy} aria-label={`Copy ${label}`}>
          <Copy size={13} />
        </button>
      )}
    </div>
  )
}