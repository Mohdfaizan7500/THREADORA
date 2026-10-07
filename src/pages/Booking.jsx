import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  MapPin,
  Truck,
  Zap,
  Wallet,
  Smartphone,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useOrders } from '../context/OrdersContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatCurrency, lineTotal, generateOrderId, generateTrackingNumber, addBusinessDays, emailValid, phoneValid } from '../utils/format.js'
import './Booking.css'

const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    eta: '5–7 business days',
    fee: 0,
    icon: Truck,
    note: 'Free on orders above ₹2,000',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    eta: '2–3 business days',
    fee: 149,
    icon: Zap,
    note: 'Priority handling & faster shipping',
  },
]

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', note: 'Pay when it arrives', icon: Wallet },
  { id: 'upi', label: 'UPI', note: 'Demo — no real charge', icon: Smartphone },
  { id: 'card', label: 'Card', note: 'Demo — no real charge', icon: CreditCard },
]

const STATES = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
  'Gujarat', 'West Bengal', 'Rajasthan', 'Kerala', 'Punjab', 'Haryana', 'Telangana',
]

export default function Booking() {
  const cart = useCart()
  const { addOrder, orders } = useOrders()
  const { user } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('upi')
  const [form, setForm] = useState({
    name: user?.name && !user.guest ? user.name : '',
    mobile: user?.mobile || '',
    email: user?.email && !user.guest ? user.email : '',
    address: '',
    city: '',
    state: 'Delhi',
    pincode: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)

  const totals = useMemo(() => {
    const subtotal = cart.subtotal
    const discount = cart.discount
    const fee = subtotal >= 2000 && delivery === 'standard' ? 0 : deliveryOption.fee
    return { subtotal, discount, fee, total: subtotal + fee }
  }, [cart.subtotal, cart.discount, delivery, deliveryOption])

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your full name.'
    if (!phoneValid(form.mobile)) e.mobile = 'Enter a valid mobile number.'
    if (!emailValid(form.email)) e.email = 'Enter a valid email address.'
    if (!form.address.trim() || form.address.trim().length < 6) e.address = 'Enter your full delivery address.'
    if (!form.city.trim()) e.city = 'Please enter your city.'
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeBooking = async () => {
    if (!validate()) {
      error('Please fix the highlighted fields.')
      document.querySelector('.field__error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))

    const existingIds = orders.map((o) => o.id)
    const orderId = generateOrderId(existingIds)
    const now = new Date()
    const orderDate = now.toISOString().slice(0, 10)
    const etaDays = delivery === 'express' ? 3 : 6

    const order = {
      id: orderId,
      customer: form.name,
      email: form.email,
      phone: form.mobile,
      date: orderDate,
      status: 'Confirmed',
      paymentMethod: PAYMENT_OPTIONS.find((p) => p.id === payment)?.label || 'UPI',
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.fee,
      total: totals.total,
      trackingNumber: generateTrackingNumber(),
      courier: 'THREADORA EXPRESS',
      estimatedDelivery: addBusinessDays(orderDate, etaDays),
      deliveryOption: deliveryOption.label,
      address: {
        line1: form.address,
        line2: '',
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      items: cart.items.map((i) => ({
        id: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        mrp: i.mrp,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        categoryLabel: i.categoryLabel,
      })),
      timeline: buildConfirmedTimeline(orderDate),
      isNew: true,
    }

    addOrder(order)
    cart.clearCart()
    setSubmitting(false)
    success('Booking confirmed!')
    navigate(`/booking-success/${orderId}`)
  }

  if (cart.items.length === 0) {
    return (
      <div className="page-top">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to book yet"
          message="Add a few pieces to your cart before booking."
          actionLabel="Go to Shop"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="booking page-top">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/cart">Cart</Link>
          <span className="breadcrumb__item"><ChevronRight size={13} /><span>Booking</span></span>
        </nav>

        <header className="booking__head">
          <span className="eyebrow">Almost there</span>
          <h1>Complete your booking</h1>
          <p className="muted">Demo checkout — no real payment is processed.</p>
        </header>

        <div className="booking__grid">
          <div className="booking__form">
            {/* Delivery details */}
            <section className="booking__card card">
              <div className="booking__card-head">
                <span className="booking__step">1</span>
                <h2>Delivery Details</h2>
              </div>

              <div className="form-grid">
                <Field label="Full Name" error={errors.name} className="form-grid__full">
                  <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Rahul Sharma" autoComplete="name" />
                </Field>
                <Field label="Mobile Number" error={errors.mobile}>
                  <input className="input" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" inputMode="tel" autoComplete="tel" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
                </Field>
                <Field label="Delivery Address" error={errors.address} className="form-grid__full">
                  <textarea className="textarea" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="House / flat, street, area, landmark" rows={3} autoComplete="street-address" />
                </Field>
                <Field label="City" error={errors.city}>
                  <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New Delhi" autoComplete="address-level2" />
                </Field>
                <Field label="State">
                  <select className="select" value={form.state} onChange={(e) => set('state', e.target.value)}>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Pincode" error={errors.pincode}>
                  <input className="input" value={form.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="110024" inputMode="numeric" autoComplete="postal-code" />
                </Field>
              </div>
            </section>

            {/* Delivery method */}
            <section className="booking__card card">
              <div className="booking__card-head">
                <span className="booking__step">2</span>
                <h2>Delivery Method</h2>
              </div>
              <div className="option-list">
                {DELIVERY_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const isActive = delivery === opt.id
                  const free = opt.id === 'standard' && cart.subtotal >= 2000
                  return (
                    <label key={opt.id} className={`option ${isActive ? 'is-active' : ''}`}>
                      <input type="radio" name="delivery" checked={isActive} onChange={() => setDelivery(opt.id)} />
                      <span className="option__radio" aria-hidden="true" />
                      <span className="option__icon"><Icon size={20} /></span>
                      <span className="option__body">
                        <strong>{opt.label}</strong>
                        <span>{opt.eta} · {opt.note}</span>
                      </span>
                      <span className="option__price">{free ? 'Free' : opt.fee === 0 ? formatCurrency(0) : formatCurrency(opt.fee)}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            {/* Payment */}
            <section className="booking__card card">
              <div className="booking__card-head">
                <span className="booking__step">3</span>
                <h2>Payment Method</h2>
              </div>
              <div className="option-list">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const isActive = payment === opt.id
                  return (
                    <label key={opt.id} className={`option ${isActive ? 'is-active' : ''}`}>
                      <input type="radio" name="payment" checked={isActive} onChange={() => setPayment(opt.id)} />
                      <span className="option__radio" aria-hidden="true" />
                      <span className="option__icon"><Icon size={20} /></span>
                      <span className="option__body">
                        <strong>{opt.label}</strong>
                        <span>{opt.note}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="booking__demo-note"><ShieldCheck size={15} /> This is a demo store — selecting any method will not charge you.</p>
            </section>
          </div>

          {/* Summary */}
          <aside className="booking__summary">
            <div className="summary card">
              <h3>Your Booking</h3>
              <ul className="booking__items">
                {cart.items.map((item) => (
                  <li key={item.key} className="booking__item">
                    <img src={item.image} alt={item.name} />
                    <div className="booking__item-info">
                      <span className="booking__item-name">{item.name}</span>
                      <span className="muted">Size {item.size} · {item.color} · Qty {item.quantity}</span>
                    </div>
                    <span className="booking__item-price">{formatCurrency(lineTotal(item))}</span>
                  </li>
                ))}
              </ul>

              <dl className="summary__rows">
                <div className="summary__row"><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
                {totals.discount > 0 && (
                  <div className="summary__row summary__row--save"><dt>Discount</dt><dd>− {formatCurrency(totals.discount)}</dd></div>
                )}
                <div className="summary__row">
                  <dt>Delivery ({deliveryOption.label.replace(' Delivery', '')})</dt>
                  <dd>{totals.fee === 0 ? <span className="summary__free">Free</span> : formatCurrency(totals.fee)}</dd>
                </div>
              </dl>

              <div className="summary__total">
                <span>Total</span>
                <strong>{formatCurrency(totals.total)}</strong>
              </div>

              <button className="btn btn--primary btn--block btn--lg" onClick={placeBooking} disabled={submitting}>
                {submitting ? 'Placing your booking…' : <>Place Booking <ArrowRight size={18} /></>}
              </button>
              <Link className="btn btn--ghost btn--block" to="/cart">Back to Cart</Link>

              <div className="booking__addr-preview">
                <MapPin size={15} />
                <span>
                  Delivering to <strong>{form.city || 'your city'}</strong>
                  {form.pincode ? `, ${form.pincode}` : ''}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      {children}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}

function buildConfirmedTimeline(orderDate) {
  return [
    { key: 'confirmed', label: 'Booking Confirmed', description: 'Your booking has been successfully received.', state: 'current', date: orderDate, time: '10:30 AM' },
    { key: 'processing', label: 'Order Processing', description: 'Our team is preparing your order.', state: 'pending', date: null, time: null },
    { key: 'packed', label: 'Packed', description: 'Your clothes have been packed.', state: 'pending', date: null, time: null },
    { key: 'shipped', label: 'Shipped', description: 'Your package has left our warehouse.', state: 'pending', date: null, time: null },
    { key: 'outForDelivery', label: 'Out for Delivery', description: 'Your parcel is on the way to you.', state: 'pending', date: null, time: null },
    { key: 'delivered', label: 'Delivered', description: 'Delivered to your doorstep. Enjoy!', state: 'pending', date: null, time: null },
  ]
}

export { buildConfirmedTimeline }