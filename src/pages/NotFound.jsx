import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound page-top">
      <div className="container notfound__inner">
        <span className="notfound__code">404</span>
        <Compass size={48} className="notfound__icon" />
        <h1>This page has wandered off</h1>
        <p className="muted">
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <div className="notfound__actions">
          <Link className="btn btn--primary btn--lg" to="/">Back to Home</Link>
          <Link className="btn btn--outline btn--lg" to="/shop">Shop Collection</Link>
        </div>
      </div>
    </div>
  )
}