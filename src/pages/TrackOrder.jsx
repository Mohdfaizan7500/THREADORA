import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  PackageSearch,
  Copy,
  Truck,
  MapPin,
  Phone,
  User,
  Calendar,
  Hash,
  Package,
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import TrackingTimeline from '../components/TrackingTimeline.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import { useCopyToClipboard } from '../hooks/index.js'
import { SAMPLE_ORDER_ID } from '../data/orders.js'
import './TrackOrder.css'

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { getOrder } = useOrders()
  const { success, error } = useToast()
  const copy = useCopyToClipboard()

  const [input, setInput] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | found | notfound

  // Track whenever a query param is present (e.g. arriving from My Bookings).
  useEffect(() => {
    const param = searchParams.get('order')
    if (param) {
      setInput(param)
      lookup(param)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const lookup = (value) => {
    const term = (value ?? input).trim()
    if (!term) {
      error('Please enter an Order ID')
      return
    }
    setStatus('loading')
    setOrder(null)
    setTimeout(() => {
      const found = getOrder(term)
      if (found) {
        setOrder(found)
        setStatus('found')
        success('Order found')
      } else {
        setStatus('notfound')
        error('Order not found. Please check your Order ID and try again.')
      }
    }, 700)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (input.trim()) next.set('order', input.trim())
    setSearchParams(next, { replace: true })
    lookup()
  }

  const trySample = () => {
    setInput(SAMPLE_ORDER_ID)
    const next = new URLSearchParams({ order: SAMPLE_ORDER_ID })
    setSearchParams(next, { replace: true })
    lookup(SAMPLE_ORDER_ID)
  }

  const onCopy = async (text) => {
    const ok = await copy(text)
    if (ok) success('Order ID copied')
  }

  return (
    <div className="track page-top">
      <div className="track__hero">
        <div className="container track__hero-inner">
          <span className="eyebrow">Order tracking</span>
          <h1>Track Your Order</h1>
          <p className="muted">
            Enter your Order ID to see exactly where your parcel is on its journey to you.
          </p>

          <form className="track__form" onSubmit={submit}>
            <div className="track__input">
              <Hash size={18} aria-hidden="true" />
              <input
                type="text"
                placeholder="Enter your Order ID, e.g. THR-2026-10482"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Order ID"
              />
            </div>
            <button className="btn btn--primary btn--lg" type="submit" disabled={status === 'loading'}>
              <Search size={18} /> Track Order
            </button>
          </form>

          <button className="track__sample" onClick={trySample}>
            Try a demo order ID: <strong>{SAMPLE_ORDER_ID}</strong>
          </button>
        </div>
      </div>

      <div className="container track__body">
        {status === 'loading' && <Loader label="Locating your order…" />}

        {status === 'idle' && (
          <EmptyState
            icon={PackageSearch}
            title="Ready to track"
            message="Enter an Order ID above and we'll show you a live timeline from booking to delivery."
          />
        )}

        {status === 'notfound' && (
          <div className="track__error" role="alert">
            <EmptyState
              icon={PackageSearch}
              title="Order not found"
              message="We couldn't find an order with that ID. Please check your Order ID and try again."
              actionLabel="Try demo order"
              onAction={trySample}
            />
          </div>
        )}

        {status === 'found' && order && (
          <div className="track__result page-enter">
            {/* Header card */}
            <section className="track__summary card">
              <div className="track__summary-head">
                <div>
                  <span className="track__label">Order ID</span>
                  <button className="track__id" onClick={() => onCopy(order.id)} title="Copy Order ID">
                    <strong>{order.id}</strong>
                    <Copy size={14} />
                  </button>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="track__meta">
                <Meta icon={User} label="Customer" value={order.customer} />
                <Meta icon={Calendar} label="Order Date" value={formatDate(order.date)} />
                <Meta icon={Truck} label="Estimated Delivery" value={formatDate(order.estimatedDelivery)} />
                <Meta icon={Package} label="Total" value={formatCurrency(order.total)} />
              </div>

              <div className="track__progress-wrap">
                <div className="track__progress-head">
                  <span>Delivery progress</span>
                  <strong>
                    {order.status === 'Cancelled'
                      ? 'Cancelled'
                      : `Step ${Math.min(
                          order.timeline.filter((s) => s.state === 'completed').length + 1,
                          order.timeline.length,
                        )} of ${order.timeline.length}`}
                  </strong>
                </div>
                <div className="track__progress">
                  <div
                    className="track__progress-bar"
                    style={{
                      width:
                        order.status === 'Cancelled'
                          ? '0%'
                          : `${Math.round(
                              ((order.timeline.filter((s) => s.state === 'completed').length +
                                (order.timeline.some((s) => s.state === 'current') ? 1 : 0)) /
                                order.timeline.length) *
                                100,
                            )}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            <div className="track__columns">
              {/* Timeline */}
              <section className="track__timeline card">
                <h2>Tracking Timeline</h2>
                <TrackingTimeline
                  timeline={order.timeline}
                  status={order.status}
                  cancelled={order.status === 'Cancelled'}
                />
              </section>

              {/* Delivery info + items */}
              <div className="track__side">
                <section className="track__info card">
                  <h2>Delivery Information</h2>
                  <dl className="track__info-list">
                    <InfoRow icon={User} label="Customer name" value={order.customer} />
                    <InfoRow icon={Phone} label="Phone" value={order.phone} />
                    <InfoRow
                      icon={MapPin}
                      label="Delivery address"
                      value={`${order.address.line1}${order.address.line2 ? `, ${order.address.line2}` : ''}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`}
                    />
                    <InfoRow icon={Truck} label="Courier partner" value={order.courier} />
                    <InfoRow
                      icon={Hash}
                      label="Tracking number"
                      value={order.trackingNumber}
                      onCopy={order.trackingNumber !== '—' ? () => onCopy(order.trackingNumber) : undefined}
                    />
                  </dl>
                </section>

                <section className="track__items card">
                  <h2>Items in this order</h2>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${item.id}-${item.size}-${item.color}`} className="track__item">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <span className="track__item-name">{item.name}</span>
                          <span className="muted">Size {item.size} · {item.color} · Qty {item.quantity}</span>
                        </div>
                        <span className="track__item-price">{formatCurrency(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link className="btn btn--outline btn--block" to={`/booking/${order.id}`}>
                    View booking details
                  </Link>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="track__meta-item">
      <span className="track__meta-icon"><Icon size={17} /></span>
      <div>
        <span className="track__label">{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, onCopy }) {
  return (
    <div className="track__info-row">
      <span className="track__meta-icon"><Icon size={17} /></span>
      <div className="track__info-row-body">
        <dt>{label}</dt>
        <dd>
          {value}
          {onCopy && (
            <button className="track__copy" onClick={onCopy} aria-label={`Copy ${label}`}>
              <Copy size={12} />
            </button>
          )}
        </dd>
      </div>
    </div>
  )
}