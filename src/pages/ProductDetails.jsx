import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import Rating from '../components/Rating.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Loader from '../components/Loader.jsx'
import { colorHex } from '../components/QuickView.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useScrollTop } from '../hooks/index.js'
import { PackageSearch } from 'lucide-react'
import './ProductDetails.css'

const TABS = [
  { id: 'details', label: 'Product Details' },
  { id: 'fabric', label: 'Fabric & Care' },
  { id: 'delivery', label: 'Delivery & Returns' },
  { id: 'reviews', label: 'Reviews' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading, getProductById, getRelatedProducts } = useProducts()
  const product = useMemo(() => getProductById(id), [id, products, getProductById])
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('details')

  const cart = useCart()
  const wishlist = useWishlist()
  const { success, info } = useToast()

  useScrollTop(id)

  useEffect(() => {
    if (product) {
      setSize(product.sizes?.[0] || '')
      setColor(product.colors?.[0] || '')
      setActiveImg(0)
      setQty(1)
    }
  }, [product])

  if (loading && !product) {
    return (
      <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 60px)' }}>
        <Loader label="Loading product..." full />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 60px)' }}>
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          message="The product you're looking for doesn't exist or may have been removed."
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </div>
    )
  }

  const related = getRelatedProducts(product, 4)
  const wished = wishlist.has(product.id)
  const productReviews = (product.reviewList || []).slice(0, 4)

  const addToCart = () => {
    cart.addItem(product, { size, color, quantity: qty })
    success('Product added to cart')
  }

  const bookNow = () => {
    cart.addItem(product, { size, color, quantity: qty })
    success('Added to cart — let’s book it')
    navigate('/booking')
  }

  const onWishlist = () => {
    const added = wishlist.toggle(product.id)
    added ? success('Added to wishlist') : info('Removed from wishlist')
  }

  const onSize = (s) => {
    setSize(s)
  }

  return (
    <div className="pdp page-top">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__item"><ChevronRight size={13} /><Link to="/shop">Shop</Link></span>
          <span className="breadcrumb__item">
            <ChevronRight size={13} />
            <Link to={`/shop?category=${product.category}`}>{product.categoryLabel}</Link>
          </span>
          <span className="breadcrumb__item"><ChevronRight size={13} /><span>{product.name}</span></span>
        </nav>

        <div className="pdp__grid">
          {/* Gallery */}
          <div className="pdp__gallery">
            <div className="pdp__thumbs" role="group" aria-label="Product images">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumb ${activeImg === i ? 'is-active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={activeImg === i}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>

            <div className="pdp__main-image">
              <img src={product.gallery[activeImg]} alt={product.name} />
              {product.tag && <span className="pdp__tag">{product.tag}</span>}
              {product.discount > 0 && <span className="pdp__discount">-{product.discount}%</span>}
            </div>
          </div>

          {/* Info */}
          <div className="pdp__info">
            <span className="eyebrow">{product.brand} · {product.categoryLabel}</span>
            <h1>{product.name}</h1>

            <div className="pdp__rating">
              <Rating value={product.rating} />
              <a href="#reviews" className="pdp__rating-link">{product.reviews} reviews</a>
              <span className="pdp__stock"><Check size={13} /> In Stock</span>
            </div>

            <div className="pdp__price">
              <span className="pdp__price-now">{formatCurrency(product.price)}</span>
              <span className="pdp__price-mrp">{formatCurrency(product.mrp)}</span>
              <span className="pdp__price-save">
                {product.discount}% OFF · Save {formatCurrency(product.mrp - product.price)}
              </span>
            </div>
            <p className="pdp__tax">Inclusive of all taxes</p>

            <p className="pdp__desc">{product.desc}</p>

            {/* Color */}
            <div className="pdp__option">
              <div className="pdp__option-head">
                <span>Color</span>
                <strong>{color}</strong>
              </div>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${color === c ? 'is-active' : ''}`}
                    style={{ '--swatch': colorHex(c) }}
                    onClick={() => setColor(c)}
                    title={c}
                    aria-label={`Color ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pdp__option">
              <div className="pdp__option-head">
                <span>Select Size</span>
                <button className="pdp__size-guide"><Ruler size={14} /> Size Guide</button>
              </div>
              <div className="size-row">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-pill ${size === s ? 'is-active' : ''}`}
                    onClick={() => onSize(s)}
                    aria-pressed={size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="pdp__buy">
              <div className="pdp__qty">
                <span className="opt-label">Quantity</span>
                <div className="pdp__qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pdp__cta">
              <button className="btn btn--primary btn--lg" onClick={addToCart}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="btn btn--accent btn--lg" onClick={bookNow}>
                <Sparkles size={18} /> Book Now
              </button>
              <button
                className={`btn btn--outline btn--lg pdp__wish ${wished ? 'is-active' : ''}`}
                onClick={onWishlist}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wished}
              >
                <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick assurances */}
            <ul className="pdp__assure">
              <li><Truck size={17} /><div><strong>Free delivery</strong><span>On orders above ₹2,000</span></div></li>
              <li><RotateCcw size={17} /><div><strong>7-day returns</strong><span>Easy & hassle-free</span></div></li>
              <li><ShieldCheck size={17} /><div><strong>Secure checkout</strong><span>Demo payment only</span></div></li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="pdp__tabs section--tight">
          <div className="pdp__tablist" role="tablist" aria-label="Product information">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                className={`pdp__tab ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pdp__tabpanel card" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'details' && (
              <div className="pdp__detail-grid">
                <DetailRow label="Fabric" value={product.fabric} />
                <DetailRow label="Fit" value={product.fit} />
                <DetailRow label="Care" value={product.care} />
                <DetailRow label="Availability" value="In Stock" />
                <DetailRow label="Category" value={product.categoryLabel} />
                <DetailRow label="Brand" value={product.brand} />
              </div>
            )}

            {tab === 'fabric' && (
              <div className="pdp__prose">
                <h4>Fabric & Care</h4>
                <p>
                  Crafted from <strong>{product.fabric}</strong> with a <strong>{product.fit}</strong>.
                  We select materials that stay soft, hold their shape and keep their colour over time.
                </p>
                <ul className="pdp__care-list">
                  <li><Check size={15} /> {product.care}</li>
                  <li><Check size={15} /> Do not bleach</li>
                  <li><Check size={15} /> Warm iron if required</li>
                  <li><Check size={15} /> Dry in shade</li>
                </ul>
              </div>
            )}

            {tab === 'delivery' && (
              <div className="pdp__prose">
                <h4>Delivery & Returns</h4>
                <p>
                  Standard delivery arrives in 5–7 business days; Express delivery in 2–3 business
                  days. Free standard shipping on all orders above ₹2,000.
                </p>
                <ul className="pdp__care-list">
                  <li><Check size={15} /> Easy 7-day returns on unworn items</li>
                  <li><Check size={15} /> Original tags must be intact</li>
                  <li><Check size={15} /> Refunds processed within 5 business days</li>
                  <li><Check size={15} /> Track every step from your My Bookings page</li>
                </ul>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="pdp__reviews" id="reviews">
                <div className="pdp__reviews-summary">
                  <div className="pdp__reviews-score">
                    <strong>{product.rating.toFixed(1)}</strong>
                    <Rating value={product.rating} showValue={false} />
                    <span className="muted">{product.reviews} reviews</span>
                  </div>
                </div>
                <ul className="pdp__reviews-list">
                  {productReviews.map((r, i) => (
                    <li key={`${r.reviewerName}-${i}`} className="pdp__review">
                      <div className="pdp__review-head">
                        <span className="review-card__avatar">
                          {(r.reviewerName || 'A').slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <strong>{r.reviewerName || 'Anonymous'}</strong>
                          <span className="muted">{formatDate(r.date)}</span>
                        </div>
                        <Rating value={r.rating} showValue={false} size={13} />
                      </div>
                      <p>{r.comment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="section--tight">
            <div className="section-head">
              <div>
                <span className="section-head__eyebrow">You may also like</span>
                <h2>Complete the look</h2>
              </div>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="pdp__detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}