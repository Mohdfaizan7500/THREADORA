import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import './PageHeader.css'

// Reusable interior page hero/banner with breadcrumb.
export default function PageHeader({ eyebrow, title, subtitle, breadcrumb = [], children }) {
  return (
    <section className="page-header">
      <div className="container">
        {breadcrumb.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {breadcrumb.map((b) => (
              <span key={b.label} className="breadcrumb__item">
                <ChevronRight size={13} />
                {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}