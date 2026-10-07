import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, X } from 'lucide-react'
import { useProducts } from '../context/ProductsContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatCurrency } from '../utils/format.js'
import './Wishlist.css'

export default function Wishlist() {
  const { products } = useProducts()
  const wishlist = useWishlist()
  const cart = useCart()
  const { success, info } = useToast()

  const items = products.filter((p) => wishlist.ids.includes(p.id))

  const addToCart = (product) => {
    cart.addItem(product, { size: product.sizes?.[0], color: product.colors?.[0], quantity: 1 })
    success('Product added to cart')
  }

  if (items.length === 0) {
    return (
      <div className="page-top">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here for later."
          actionLabel="Browse Products"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="wishlist page-top">
      <div className="container">
        <header className="wishlist__head">
          <div>
            <span className="eyebrow">Saved for later</span>
            <h1>My Wishlist</h1>
            <p className="muted">{items.length} item{items.length > 1 ? 's' : ''} saved</p>
          </div>
        </header>

        <div className="wishlist__list">
          {items.map((p) => (
            <article key={p.id} className="wishlist__item card">
              <Link to={`/product/${p.id}`} className="wishlist__media">
                <img src={p.image} alt={p.name} />
              </Link>

              <div className="wishlist__info">
                <span className="wishlist__cat">{p.categoryLabel}</span>
                <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
                <span className="wishlist__rating">
                  <Star size={14} fill="currentColor" /> {p.rating.toFixed(1)}
                  <span className="muted">({p.reviews})</span>
                </span>
                <div className="wishlist__price">
                  <span className="price">{formatCurrency(p.price)}</span>
                  <span className="price--strike">{formatCurrency(p.mrp)}</span>
                </div>
              </div>

              <div className="wishlist__actions">
                <button className="btn btn--primary btn--sm" onClick={() => addToCart(p)}>
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    wishlist.remove(p.id)
                    info('Removed from wishlist')
                  }}
                >
                  <X size={15} /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}