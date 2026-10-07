import { Link } from 'react-router-dom'
import { Heart, Eye, Plus } from 'lucide-react'
import Rating from './Rating.jsx'
import { formatCurrency } from '../utils/format.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product, view = 'grid' }) {
  const wishlist = useWishlist()
  const cart = useCart()
  const { success, info } = useToast()
  const wished = wishlist.has(product.id)

  const onWishlist = (e) => {
    e.preventDefault()
    const added = wishlist.toggle(product.id)
    if (added) success('Added to wishlist')
    else info('Removed from wishlist')
  }

  const onQuickView = (e) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('threadora:quickview', { detail: product }))
  }

  const onAdd = (e) => {
    e.preventDefault()
    cart.addItem(product, { size: product.sizes?.[0], color: product.colors?.[0], quantity: 1 })
    success('Product added to cart')
  }

  return (
    <article className={`product-card product-card--${view}`}>
      <Link to={`/product/${product.id}`} className="product-card__media" aria-label={product.name}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && <span className="product-card__tag">{product.tag}</span>}
        {product.discount > 0 && (
          <span className="product-card__discount">-{product.discount}%</span>
        )}

        <div className="product-card__actions">
          <button
            className={`product-card__action ${wished ? 'is-active' : ''}`}
            onClick={onWishlist}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished}
          >
            <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
          </button>
          <button className="product-card__action" onClick={onQuickView} aria-label="Quick view">
            <Eye size={15} />
          </button>
          <button className="product-card__action product-card__action--add" onClick={onAdd} aria-label="Add to cart">
            <Plus size={15} />
          </button>
        </div>
      </Link>

      <div className="product-card__body">
        <span className="product-card__cat">{product.categoryLabel}</span>
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`} title={product.name}>{product.name}</Link>
        </h3>

        <div className="product-card__meta">
          <Rating value={product.rating} count={product.reviews} size={11} />
        </div>

        <div className="product-card__price">
          <span className="price">{formatCurrency(product.price)}</span>
          {product.mrp > product.price && (
            <span className="price--strike">{formatCurrency(product.mrp)}</span>
          )}
        </div>

        {view === 'list' && (
          <>
            <p className="product-card__desc">{product.desc}</p>
            <div className="product-card__cta">
              <button className="btn btn--primary btn--sm btn--block" onClick={onAdd}>
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  )
}