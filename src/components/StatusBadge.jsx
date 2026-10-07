import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Home,
  XCircle,
  CircleDot,
} from 'lucide-react'
import './StatusBadge.css'

const STATUS_META = {
  Confirmed: { icon: CheckCircle2, tone: 'info' },
  Processing: { icon: Clock, tone: 'warning' },
  Packed: { icon: Package, tone: 'accent' },
  Shipped: { icon: Truck, tone: 'accent' },
  'Out for Delivery': { icon: MapPin, tone: 'info' },
  Delivered: { icon: Home, tone: 'success' },
  Cancelled: { icon: XCircle, tone: 'danger' },
}

export default function StatusBadge({ status, size = 'md', withIcon = true }) {
  const meta = STATUS_META[status] || { icon: CircleDot, tone: 'neutral' }
  const Icon = meta.icon
  return (
    <span className={`status-badge status-badge--${meta.tone} status-badge--${size}`}>
      {withIcon && <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2.4} aria-hidden="true" />}
      {status}
    </span>
  )
}

export const STATUS_TONES = STATUS_META