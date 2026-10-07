import { ShieldCheck, Truck, Tag } from 'lucide-react'
import { formatCurrency } from '../utils/format.js'
import './BookingSummary.css'

// Shared order/price summary block used in Cart and Checkout.
export default function BookingSummary({
  subtotal,
  discount,
  deliveryFee,
  total,
  freeDeliveryThreshold,
  showFreeHint = true,
  footnote,
  children,
}) {
  const remaining = freeDeliveryThreshold ? freeDeliveryThreshold - subtotal : 0

  return (
    <aside className="summary card">
      <h3>Order Summary</h3>

      <dl className="summary__rows">
        <div className="summary__row">
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="summary__row summary__row--save">
            <dt><Tag size={14} /> Discount</dt>
            <dd>− {formatCurrency(discount)}</dd>
          </div>
        )}
        <div className="summary__row">
          <dt>Delivery</dt>
          <dd>{deliveryFee === 0 ? <span className="summary__free">Free</span> : formatCurrency(deliveryFee)}</dd>
        </div>
      </dl>

      {showFreeHint && remaining > 0 && (
        <p className="summary__hint">
          Add {formatCurrency(remaining)} more for free delivery.
        </p>
      )}

      <div className="summary__total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {children}

      <ul className="summary__perks">
        <li><ShieldCheck size={16} /> Secure demo checkout</li>
        <li><Truck size={16} /> Easy 7-day returns</li>
      </ul>

      {footnote && <p className="summary__footnote">{footnote}</p>}
    </aside>
  )
}