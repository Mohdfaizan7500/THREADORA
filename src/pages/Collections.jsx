import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext.jsx'
import { categoryImage, collectionImage } from '../data/imagery.js'
import ProductCard from '../components/ProductCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { SkeletonGrid } from '../components/Loader.jsx'
import './Collections.css'

const COLLECTIONS = [
  {
    id: 'autumn',
    title: 'Autumn Essentials',
    tagline: 'Layers for the in-between season',
    type: 'jacket',
    category: 'womens-dresses',
  },
  {
    id: 'everyday',
    title: 'Everyday Basics',
    tagline: 'Soft cottons you’ll live in',
    type: 'tshirt',
    category: 'mens-shirts',
  },
  {
    id: 'tailored',
    title: 'Modern Tailoring',
    tagline: 'Sharp, versatile, timeless',
    type: 'shirt',
    category: 'mens-shirts',
  },
  {
    id: 'denim',
    title: 'The Accessories Edit',
    tagline: 'Finishing details that elevate',
    type: 'accessory',
    category: 'womens-bags',
  },
]

export default function Collections() {
  const { products, categories, loading } = useProducts()
  const heroes = products.filter((p) => p.tag).slice(0, 4)

  return (
    <div className="collections">
      <PageHeader
        eyebrow="Curated"
        title="Collections"
        subtitle="Thoughtfully assembled edits for every part of your story."
        breadcrumb={[{ label: 'Collections' }]}
      />

      <section className="section">
        <div className="container">
          <div className="collections__grid">
            {COLLECTIONS.map((c, i) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.category}`}
                className={`collection-card collection-card--${i % 2 === 0 ? 'wide' : 'tall'}`}
              >
                <img src={collectionImage(c.id)} alt={c.title} loading="lazy" />
                <div className="collection-card__overlay">
                  <span className="collection-card__tag">Collection</span>
                  <h3>{c.title}</h3>
                  <p>{c.tagline}</p>
                  <span className="collection-card__cta">Explore <ArrowRight size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">Premium line</span>
              <h2>Signature pieces</h2>
            </div>
            <Link className="btn btn--ghost" to="/shop">Shop all <ArrowRight size={16} /></Link>
          </div>
          {loading && heroes.length === 0 ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="product-grid">
              {heroes.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="collections__cats">
            {categories.map((c) => (
              <Link key={c.id} to={`/shop?category=${c.id}`} className="collections__cat">
                <img
                  src={categoryImage(c.id) || categoryImage(c.type)}
                  alt={c.title}
                  loading="lazy"
                />
                <span>{c.title}</span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}