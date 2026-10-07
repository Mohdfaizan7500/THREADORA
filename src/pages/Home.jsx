import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, Sparkles, Quote } from 'lucide-react'
import { STATS, REVIEWS } from '../data/content.js'
import { HERO_IMAGES, categoryImage, BRAND_IMAGE } from '../data/imagery.js'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Rating from '../components/Rating.jsx'
import Newsletter from '../components/Newsletter.jsx'
import { SkeletonGrid } from '../components/Loader.jsx'
import './Home.css'

const FEATURED_CATEGORIES = ['mens-shirts', 'womens-dresses', 'mens-shoes', 'womens-bags', 'sunglasses', 'mens-watches']

const APPAREL_CATEGORIES = [
  'mens-shirts', 'mens-shoes', 'mens-watches', 'tops', 'womens-dresses',
  'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches', 'sunglasses',
]

export default function Home() {
  const { products, categories, loading } = useProducts()
  const apparel = products.filter((p) => APPAREL_CATEGORIES.includes(p.category))
  const trending = (apparel.length ? apparel : products).slice(0, 10)

  const topCategories = FEATURED_CATEGORIES
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 4)
  const featured = topCategories.length ? topCategories : categories.slice(0, 4)

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow">
              <Sparkles size={15} /> New Season · Autumn 2026
            </span>
            <h1>Define Your Style.</h1>
            <p className="hero__sub">
              Discover thoughtfully designed clothing made for your everyday story.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary btn--lg" to="/shop">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link className="btn btn--outline btn--lg" to="/track-order">
                Track Your Order
              </Link>
            </div>
            <ul className="hero__trust">
              <li><Truck size={16} /> Free delivery over ₹2,000</li>
              <li><ShieldCheck size={16} /> Easy 7-day returns</li>
            </ul>
          </div>

          <div className="hero__visual">
            <img src={HERO_IMAGES[0]} alt="THREADORA new season editorial" className="hero__img" />
            <div className="hero__float hero__float--a">
              <span className="hero__float-value">4.8/5</span>
              <span className="hero__float-label">10K+ reviews</span>
            </div>
            <div className="hero__float hero__float--b">
              <span className="hero__float-value">50+</span>
              <span className="hero__float-label">Designs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">Shop by category</span>
              <h2>Find your everyday essentials</h2>
            </div>
            <Link className="btn btn--ghost" to="/shop">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            {loading && featured.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="category-card skeleton skeleton--img" />
                ))
              : featured.map((c, i) => (
                  <Link to={`/shop?category=${c.id}`} key={c.id} className={`category-card category-card--${i % 4}`}>
                    <img
                      src={categoryImage(c.id) || categoryImage(c.type)}
                      alt={c.title}
                      loading="lazy"
                    />
                    <div className="category-card__overlay">
                      <h3>{c.title}</h3>
                      <span className="category-card__cta">
                        Explore <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">Loved by many</span>
              <h2>Trending right now</h2>
              <p>Our most-wanted pieces this season, restocked and ready to wear.</p>
            </div>
            <Link className="btn btn--ghost" to="/shop?sort=rating">
              Shop all <ArrowRight size={16} />
            </Link>
          </div>

          {loading && trending.length === 0 ? (
            <SkeletonGrid count={10} />
          ) : (
            <div className="product-grid">
              {trending.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand story + stats */}
      <section className="section brand-section">
        <div className="container brand-section__inner">
          <div className="brand-section__media">
            <img src={BRAND_IMAGE} alt="THREADORA design atelier" loading="lazy" />
          </div>
          <div className="brand-section__copy">
            <span className="eyebrow">Our promise</span>
            <h2>Designed for people who believe clothing is more than fashion.</h2>
            <p>
              Every THREADORA piece starts with the fabric, the fit and the feeling. We obsess
              over the details so you can simply wear your story — day in, day out.
            </p>

            <div className="stats">
              {STATS.map((s) => (
                <div key={s.label} className="stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <Link className="btn btn--primary" to="/about">
              Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">Customer love</span>
              <h2>What our customers say</h2>
            </div>
          </div>

          <div className="review-grid">
            {REVIEWS.map((r) => (
              <article key={r.id} className="review-card card">
                <Quote size={26} className="review-card__quote" />
                <Rating value={r.rating} showValue={false} size={15} />
                <p className="review-card__text">{r.text}</p>
                <div className="review-card__author">
                  <span className="review-card__avatar">{r.initials}</span>
                  <div>
                    <strong>{r.name}</strong>
                    <span className="muted">{r.city} · {r.product}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <div className="section" />
    </div>
  )
}