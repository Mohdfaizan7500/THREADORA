import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cart = useCart()
  const wishlist = useWishlist()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="navbar__inner container">
          <button
            className="navbar__hamburger icon-btn"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="navbar__logo" aria-label="THREADORA home">
            THREADORA
          </Link>

          <nav className="navbar__links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <button className="icon-btn" aria-label="Search" onClick={onOpenSearch}>
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlist.count} items`}>
              <Heart size={20} />
              {wishlist.count > 0 && <span className="icon-btn__badge">{wishlist.count}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cart.count} items`}>
              <ShoppingBag size={20} />
              {cart.count > 0 && <span className="icon-btn__badge">{cart.count}</span>}
            </Link>
            <Link
              to={user ? '/profile' : '/login'}
              className="icon-btn"
              aria-label={user ? 'Profile' : 'Login'}
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div
        className={`mobile-menu-root ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      >
        <div className="mobile-menu-backdrop" />
        <aside className="mobile-menu" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu__head">
            <span className="navbar__logo">THREADORA</span>
            <button className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <nav className="mobile-menu__links" aria-label="Mobile">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `mobile-menu__link ${isActive ? 'is-active' : ''}`}
              >
                {l.label}
                <ChevronRight size={18} />
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <button className="btn btn--outline btn--block" onClick={() => { setMobileOpen(false); onOpenSearch?.() }}>
              <Search size={17} /> Search
            </button>
            <button className="btn btn--primary btn--block" onClick={() => { setMobileOpen(false); navigate(user ? '/profile' : '/login') }}>
              <User size={17} /> {user ? 'My Profile' : 'Login / Register'}
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}