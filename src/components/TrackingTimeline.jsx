import {
  Check,
  PackageCheck,
  Package,
  Truck,
  MapPin,
  Home,
  XCircle,
} from 'lucide-react'
import { formatDate } from '../utils/format.js'
import './TrackingTimeline.css'

const STAGE_ICONS = {
  confirmed: Check,
  processing: Package,
  packed: PackageCheck,
  shipped: Truck,
  outForDelivery: MapPin,
  delivered: Home,
}

// Vertical (desktop rail shows horizontal option via modifier) tracking timeline.
// Each stage renders a distinct visual state: completed / current / pending.
export default function TrackingTimeline({ timeline = [], cancelled = false }) {
  const stages = timeline || []
  const completed = stages.filter((s) => s.state === 'completed').length
  const progress = stages.length
    ? Math.round(((completed + (stages.some((s) => s.state === 'current') ? 1 : 0)) / stages.length) * 100)
    : 0

  return (
    <div className="timeline">
      <div className="timeline__progress" aria-hidden="true">
        <div className="timeline__progress-bar" style={{ width: `${cancelled ? 0 : progress}%` }} />
      </div>

      {cancelled && (
        <div className="timeline__cancelled">
          <XCircle size={20} />
          <div>
            <strong>Order Cancelled</strong>
            <p>This order was cancelled and will not be delivered.</p>
          </div>
        </div>
      )}

      <ol className="timeline__list" aria-label="Order tracking timeline">
        {stages.map((stage, i) => {
          const Icon = STAGE_ICONS[stage.key] || Package
          return (
            <li key={stage.key} className={`timeline__item is-${stage.state}`}>
              <div className="timeline__marker">
                <span className="timeline__dot">
                  {stage.state === 'completed' ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <Icon size={16} />
                  )}
                </span>
                {i < stages.length - 1 && <span className="timeline__connector" />}
              </div>
              <div className="timeline__content">
                <div className="timeline__head">
                  <h4>{stage.label}</h4>
                  {stage.state === 'current' && <span className="timeline__now">In Progress</span>}
                  {stage.state === 'completed' && <span className="timeline__done">Completed</span>}
                </div>
                {stage.date ? (
                  <p className="timeline__time">
                    {formatDate(stage.date)} · {stage.time}
                  </p>
                ) : (
                  <p className="timeline__time timeline__time--pending">Expected soon</p>
                )}
                <p className="timeline__desc">{stage.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}