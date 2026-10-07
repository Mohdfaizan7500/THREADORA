import { Link } from 'react-router-dom'
import { ArrowRight, Award, Leaf, Scissors, Heart, Sparkles } from 'lucide-react'
import { STORY_SECTIONS, STATS } from '../data/content.js'
import { storyImageAt, ABOUT_HERO_IMAGE } from '../data/imagery.js'
import Newsletter from '../components/Newsletter.jsx'
import PageHeader from '../components/PageHeader.jsx'
import './About.css'

const PILLARS = [
  { icon: Award, title: 'Uncompromising Quality', text: 'Every stitch checked, every fabric tested.' },
  { icon: Leaf, title: 'Responsible Sourcing', text: 'Natural & recycled fibres, made to last.' },
  { icon: Scissors, title: 'Expert Craftsmanship', text: 'Precision tailoring by skilled hands.' },
  { icon: Heart, title: 'Made for Real Life', text: 'Comfort and fit you can live in daily.' },
]

export default function About() {
  return (
    <div className="about">
      <PageHeader
        eyebrow="Our story"
        title="Fashion With Purpose"
        subtitle="THREADORA was built on a simple belief — that clothing should tell your story, and do it beautifully."
        breadcrumb={[{ label: 'About' }]}
      />

      {/* Story hero */}
      <section className="section">
        <div className="container about__intro">
          <div className="about__intro-media">
            <img src={ABOUT_HERO_IMAGE} alt="THREADORA design atelier" />
            <div className="about__intro-badge">
              <Sparkles size={18} />
              <span>Est. 2026 · New Delhi</span>
            </div>
          </div>
          <div className="about__intro-copy">
            <span className="eyebrow">Where it began</span>
            <h2>From a small atelier to 25+ cities.</h2>
            <p>
              What started as a handful of thoughtfully made shirts has grown into a label loved
              by thousands. Through it all, we've kept the same obsession: fit, fabric and feeling.
            </p>
            <Link className="btn btn--primary" to="/shop">
              Shop the collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section--tight">
        <div className="container">
          <div className="about__pillars">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="about__pillar card">
                <span className="about__pillar-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section className="section">
        <div className="container about__story-grid">
          {STORY_SECTIONS.map((s, i) => (
            <article key={s.id} id={s.id} className={`about__block ${i % 2 === 1 ? 'is-reverse' : ''}`}>
              <div className="about__block-copy">
                <span className="about__block-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </div>
              <div className="about__block-media">
                <img src={storyImageAt(i)} alt={s.title} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="about__stats-band">
        <div className="container">
          <div className="about__stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section" />
      <Newsletter />
      <div className="section" />
    </div>
  )
}