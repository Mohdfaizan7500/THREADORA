import { Component } from 'react'
import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import './ErrorBoundary.css'

// Catches unexpected runtime errors and shows a friendly, non-technical state.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In a real app this would be sent to an error reporting service.
    // eslint-disable-next-line no-console
    console.error('THREADORA error boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__inner">
            <span className="error-boundary__icon"><TriangleAlert size={36} /></span>
            <h1>Something went wrong</h1>
            <p>We hit an unexpected snag. Please refresh the page or head back home.</p>
            <div className="error-boundary__actions">
              <button className="btn btn--primary" onClick={() => window.location.reload()}>
                Refresh page
              </button>
              <Link className="btn btn--outline" to="/" onClick={() => this.setState({ hasError: false })}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}