import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import './Toast.css'

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
}

export default function ToastHost() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="toast-host" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <div key={t.id} className={`toast toast--${t.type}`} role="status">
            <span className="toast__icon">
              <Icon size={18} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="toast__msg">{t.message}</span>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}