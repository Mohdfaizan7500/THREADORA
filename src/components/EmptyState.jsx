import { Link } from 'react-router-dom'
import './EmptyState.css'

// Reusable empty state with an SVG icon (passed as a component), message and CTA.
export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon">
        <Icon size={34} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel &&
        (actionTo ? (
          <Link className="btn btn--primary" to={actionTo}>
            {actionLabel}
          </Link>
        ) : (
          <button className="btn btn--primary" onClick={onAction}>
            {actionLabel}
          </button>
        ))}
    </div>
  )
}