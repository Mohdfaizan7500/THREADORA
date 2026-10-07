import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message, type = 'info', duration = 3000) => {
      idCounter += 1
      const id = idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toasts,
      dismiss,
      toast,
      success: (msg, d) => toast(msg, 'success', d),
      error: (msg, d) => toast(msg, 'error', d),
      info: (msg, d) => toast(msg, 'info', d),
      warning: (msg, d) => toast(msg, 'warning', d),
    }),
    [toasts, toast, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}