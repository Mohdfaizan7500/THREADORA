import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import Modal from './Modal.jsx'
import Rating from './Rating.jsx'
import { formatCurrency } from '../utils/format.js'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import './QuickView.css'

// Listens for the global `threadora:quickview` event dispatched by ProductCard
// so any grid can open a quick-view without prop drilling.
export default function QuickView() {
  const [product, setProduct] = useState(null)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const cart = useCart()
  const wishlist = useWishlist()
  const { success, info } = useToast()

  useEffect(() => {
    const handler = (e) => {
      setProduct(e.detail)
      setSize(e.detail.sizes?.[0] || '')
      setColor(e.detail.colors?.[0] || '')
    }
    window.addEventListener('threadora:quickview', handler)
    return () => window.removeEventListener('threadora:quickview', handler)
  }, [])

  if (!product) return null

  const close = () => setProduct(null)

  const addToCart = () => {
    cart.addItem(product, { size, color, quantity: 1 })
    success('Product added to cart')
    close()
  }

  const onWishlist = () => {
    const added = wishlist.toggle(product.id)
    added ? success('Added to wishlist') : info('Removed from wishlist')
  }

  return (
    <Modal open={Boolean(product)} onClose={close} size="lg">
      <div className="quickview">
        <div className="quickview__media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="quickview__info">
          <span className="eyebrow">{product.categoryLabel}</span>
          <h2>{product.name}</h2>
          <Rating value={product.rating} count={product.reviews} />
          <div className="quickview__price">
            <span className="price">{formatCurrency(product.price)}</span>
            <span className="price--strike">{formatCurrency(product.mrp)}</span>
            <span className="quickview__save">Save {formatCurrency(product.mrp - product.price)}</span>
          </div>
          <p className="quickview__desc">{product.desc}</p>

          <div className="quickview__opts">
            <div>
              <span className="opt-label">Color: {color}</span>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${color === c ? 'is-active' : ''}`}
                    onClick={() => setColor(c)}
                    title={c}
                    aria-label={`Color ${c}`}
                    style={{ '--swatch': colorHex(c) }}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="opt-label">Size: {size}</span>
              <div className="size-row">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-pill ${size === s ? 'is-active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="quickview__actions">
            <button className="btn btn--primary btn--block" onClick={addToCart}>
              <ShoppingBag size={17} /> Add to Cart
            </button>
            <button className="btn btn--outline" onClick={onWishlist} aria-label="Add to wishlist">
              <Heart size={17} fill={wishlist.has(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link to={`/product/${product.id}`} className="quickview__link" onClick={close}>
            View full details <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Modal>
  )
}

const COLOR_HEX = {
  Black: '#171717',
  Ivory: '#F3EFE7',
  Sand: '#D9C7AE',
  Navy: '#27324A',
  Olive: '#6E7355',
  Terracotta: '#B0725A',
  Grey: '#8A8F8A',
}

export function colorHex(name) {
  return COLOR_HEX[name] || '#ccc'
}