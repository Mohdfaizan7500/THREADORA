import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import CartItem from '../components/CartItem.jsx'
import BookingSummary from '../components/BookingSummary.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import './Cart.css'

export default function Cart() {
  const cart = useCart()
  const { info } = useToast()

  const onQuantity = (key, qty) => {
    cart.updateQuantity(key, qty)
  }

  const onRemove = (key) => {
    cart.removeItem(key)
    info('Item removed from cart')
  }

  const clear = () => {
    cart.clearCart()
    info('Cart cleared')
  }

  if (cart.items.length === 0) {
    return (
      <div className="page-top">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Explore the collection and find something you love."
          actionLabel="Start Shopping"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="cart page-top">
      <div className="container">
        <header className="cart__head">
          <div>
            <span className="eyebrow">Your selection</span>
            <h1>Shopping Cart</h1>
            <p className="muted">{cart.count} item{cart.count > 1 ? 's' : ''} in your cart</p>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={clear}>Clear cart</button>
        </header>

        <div className="cart__grid">
          <div className="cart__items card">
            {cart.items.map((item) => (
              <CartItem key={item.key} item={item} onQuantity={onQuantity} onRemove={onRemove} />
            ))}
          </div>

          <div className="cart__summary">
            <BookingSummary
              subtotal={cart.subtotal}
              discount={cart.discount}
              deliveryFee={cart.deliveryFee}
              total={cart.total}
              freeDeliveryThreshold={cart.freeDeliveryThreshold}
              footnote="Taxes included. Demo checkout — no real payment."
            >
              <Link className="btn btn--primary btn--block btn--lg" to="/booking">
                Proceed to Booking <ArrowRight size={18} />
              </Link>
              <Link className="btn btn--outline btn--block" to="/shop">
                Continue Shopping
              </Link>
            </BookingSummary>
          </div>
        </div>
      </div>
    </div>
  )
}