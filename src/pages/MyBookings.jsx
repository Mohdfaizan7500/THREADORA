import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PackageOpen, RefreshCw } from 'lucide-react'
import { useOrders } from '../context/OrdersContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import OrderCard from '../components/OrderCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import './MyBookings.css'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

const ACTIVE_STATUSES = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery']

export default function MyBookings() {
  const { orders } = useOrders()
  const { user } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const { success } = useToast()
  const [tab, setTab] = useState('all')

  // In demo mode we show orders for the signed-in customer when available,
  // otherwise all demo orders so the page is never empty.
  const myOrders = useMemo(() => {
    if (!user) return orders
    const named = orders.filter(
      (o) => o.customer?.toLowerCase() === user.name?.toLowerCase(),
    )
    return named.length > 0 ? named : orders
  }, [orders, user])

  const filtered = useMemo(() => {
    switch (tab) {
      case 'active':
        return myOrders.filter((o) => ACTIVE_STATUSES.includes(o.status))
      case 'delivered':
        return myOrders.filter((o) => o.status === 'Delivered')
      case 'cancelled':
        return myOrders.filter((o) => o.status === 'Cancelled')
      default:
        return myOrders
    }
  }, [myOrders, tab])

  const counts = useMemo(
    () => ({
      all: myOrders.length,
      active: myOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
      delivered: myOrders.filter((o) => o.status === 'Delivered').length,
      cancelled: myOrders.filter((o) => o.status === 'Cancelled').length,
    }),
    [myOrders],
  )

  const onReorder = (order) => {
    order.items.forEach((item) => {
      cart.addItem(
        { id: item.id, name: item.name, image: item.image, price: item.price, mrp: item.mrp, categoryLabel: item.categoryLabel, sizes: [item.size], colors: [item.color] },
        { size: item.size, color: item.color, quantity: item.quantity },
      )
    })
    success('Items added to cart')
    navigate('/cart')
  }

  return (
    <div className="bookings page-top">
      <div className="container">
        <header className="bookings__head">
          <div>
            <span className="eyebrow">Order history</span>
            <h1>My Bookings</h1>
            <p className="muted">All your THREADORA bookings in one place.</p>
          </div>
        </header>

        <div className="bookings__tabs" role="tablist" aria-label="Filter bookings">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`bookings__tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className="bookings__tab-count">{counts[t.id]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={tab === 'all' ? PackageOpen : RefreshCw}
            title={`No ${tab === 'all' ? '' : tab} bookings`}
            message={
              tab === 'all'
                ? "You haven't placed any bookings yet. Your orders will appear here."
                : `You don't have any ${tab} bookings right now.`
            }
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        ) : (
          <div className="bookings__list">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={onReorder} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}