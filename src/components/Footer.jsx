import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Send, Mail, Phone, MapPin } from 'lucide-react'
import { CONTACT_INFO } from '../data/content.js'
import './Footer.css'

const ICON_MAP = { Instagram, Facebook, YouTube: Youtube, Pinterest: Send }

const COLS = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/shop?category=mens-shirts' },
      { label: 'Women', to: '/shop?category=womens-dresses' },
      { label: 'Collections', to: '/collections' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Best Sellers', to: '/shop?sort=rating' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Track Order', to: '/track-order' },
      { label: 'My Bookings', to: '/my-bookings' },
      { label: 'Shipping', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'FAQ', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/about' },
      { label: 'Terms & Conditions', to: '/about' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">THREADORA</span>
          <p className="footer__tagline">Wear Your Story.</p>
          <p className="footer__blurb">
            Thoughtfully designed clothing made for your everyday story. Premium fabrics,
            considered fits, made to last.
          </p>
          <div className="footer__contact">
            <span><Mail size={15} /> {CONTACT_INFO.email}</span>
            <span><Phone size={15} /> {CONTACT_INFO.phone}</span>
            <span><MapPin size={15} /> {CONTACT_INFO.address}</span>
          </div>
        </div>

        {COLS.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer__col footer__social">
          <h4>Follow Us</h4>
          <div className="footer__social-links">
            {Object.entries(ICON_MAP).map(([name, Icon]) => (
              <a key={name} href="#" aria-label={name} className="footer__social-link">
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="footer__news-hint">Join our list for early access and styling stories.</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} THREADORA. All rights reserved.</span>
        <span className="footer__demo">Demo storefront — no real payments are processed.</span>
      </div>
    </footer>
  )
}