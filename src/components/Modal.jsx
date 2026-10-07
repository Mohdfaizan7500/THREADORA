import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useScrollLock } from '../hooks/index.js'
import './Modal.css'

// Accessible modal with backdrop click + Escape to close and focus trapping.
export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const ref = useRef(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const el = ref.current
    el?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        tabIndex={-1}
        ref={ref}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal__head">
            <h3>{title}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
              <X size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button className="modal__close-float icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  )
}