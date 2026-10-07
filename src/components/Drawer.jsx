import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useScrollLock } from '../hooks/index.js'
import './Drawer.css'

// Slide-in side drawer (used for mobile menu & mobile filters).
export default function Drawer({ open, onClose, side = 'right', title, children, footer, width = 360 }) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`drawer-root ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
      onMouseDown={onClose}
      role="presentation"
    >
      <div className="drawer-backdrop" />
      <aside
        className={`drawer drawer--${side}`}
        style={{ '--drawer-width': `${width}px` }}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Panel'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="drawer__head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close panel">
            <X size={20} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__foot">{footer}</div>}
      </aside>
    </div>
  )
}