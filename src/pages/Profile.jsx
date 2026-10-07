import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  Truck,
  Heart,
  MapPin,
  LogOut,
  Pencil,
  Mail,
  Phone,
  Check,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useOrders } from '../context/OrdersContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { UserCircle } from 'lucide-react'
import './Profile.css'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const wishlist = useWishlist()
  const { orders } = useOrders()
  const { success } = useToast()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user || {})

  if (!user) {
    return (
      <div className="page-top">
        <EmptyState
          icon={UserCircle}
          title="You're not signed in"
          message="Sign in to view your profile, bookings and wishlist."
          actionLabel="Login"
          actionTo="/login"
        />
      </div>
    )
  }

  const myBookings = orders.filter(
    (o) => o.customer?.toLowerCase() === user.name?.toLowerCase(),
  )
  const bookingCount = myBookings.length || orders.length

  const save = () => {
    updateProfile({
      name: draft.name,
      email: draft.email,
      mobile: draft.mobile,
      address: draft.address,
    })
    setEditing(false)
    success('Profile updated')
  }

  const handleLogout = () => {
    logout()
    success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="profile page-top">
      <div className="container">
        <div className="profile__grid">
          {/* Profile card */}
          <section className="profile__card card">
            <div className="profile__avatar">{user.initials || 'U'}</div>
            <h1>{user.name}</h1>
            <p className="muted">{user.guest ? 'Guest session' : 'THREADORA member'}</p>

            <ul className="profile__details">
              <li><Mail size={16} /><span>{user.email}</span></li>
              <li><Phone size={16} /><span>{user.mobile || '—'}</span></li>
              <li><MapPin size={16} /><span>{user.address || 'No address saved'}</span></li>
            </ul>

            {!editing ? (
              <button className="btn btn--outline btn--block" onClick={() => { setDraft(user); setEditing(true) }}>
                <Pencil size={15} /> Edit Profile
              </button>
            ) : (
              <div className="profile__edit">
                <div className="field">
                  <label>Name</label>
                  <input className="input" value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input className="input" type="email" value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Mobile</label>
                  <input className="input" value={draft.mobile || ''} onChange={(e) => setDraft({ ...draft, mobile: e.target.value })} />
                </div>
                <div className="field">
                  <label>Address</label>
                  <textarea className="textarea" rows={2} value={draft.address || ''} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                </div>
                <div className="profile__edit-actions">
                  <button className="btn btn--primary btn--sm" onClick={save}><Check size={15} /> Save</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
                </div>
              </div>
            )}
          </section>

          {/* Quick actions */}
          <section className="profile__main">
            <div className="profile__stats">
              <div className="profile__stat card">
                <Package size={20} />
                <strong>{bookingCount}</strong>
                <span>Bookings</span>
              </div>
              <div className="profile__stat card">
                <Heart size={20} />
                <strong>{wishlist.count}</strong>
                <span>Wishlist</span>
              </div>
              <div className="profile__stat card">
                <MapPin size={20} />
                <strong>1</strong>
                <span>Saved address</span>
              </div>
            </div>

            <div className="profile__actions card">
              <h2>Quick Actions</h2>
              <div className="profile__actions-grid">
                <Link to="/my-bookings" className="profile__action">
                  <Package size={20} />
                  <span>My Bookings</span>
                </Link>
                <Link to="/track-order" className="profile__action">
                  <Truck size={20} />
                  <span>Track Order</span>
                </Link>
                <Link to="/wishlist" className="profile__action">
                  <Heart size={20} />
                  <span>Wishlist</span>
                </Link>
                <Link to="/profile" className="profile__action">
                  <MapPin size={20} />
                  <span>Saved Addresses</span>
                </Link>
                <button className="profile__action profile__action--danger" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {myBookings.length > 0 && (
              <div className="profile__recent card">
                <div className="profile__recent-head">
                  <h2>Recent Booking</h2>
                  <Link to="/my-bookings" className="profile__recent-link">View all</Link>
                </div>
                <div className="profile__recent-body">
                  <div>
                    <span className="muted">Order</span>
                    <strong>{myBookings[0].id}</strong>
                  </div>
                  <div>
                    <span className="muted">Status</span>
                    <strong>{myBookings[0].status}</strong>
                  </div>
                  <Link className="btn btn--outline btn--sm" to={`/booking/${myBookings[0].id}`}>
                    View details
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}