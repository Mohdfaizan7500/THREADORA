import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import { ORDERS, findOrderById, TRACKING_STAGES, STATUS_TO_STEP } from '../data/orders.js'

const OrdersContext = createContext(null)

// OrdersContext merges the seeded demo orders with any bookings the visitor
// creates during the session (persisted to localStorage).
export function OrdersProvider({ children }) {
  const [customOrders, setCustomOrders] = useLocalStorage('threadora.orders', [])

  const allOrders = useMemo(() => [...customOrders, ...ORDERS], [customOrders])

  const getOrder = useCallback(
    (id) => allOrders.find((o) => o.id.toLowerCase() === String(id || '').trim().toLowerCase()) || findOrderById(id),
    [allOrders],
  )

  const addOrder = useCallback(
    (order) => {
      setCustomOrders((prev) => [order, ...prev])
      return order
    },
    [setCustomOrders],
  )

  const cancelOrder = useCallback(
    (id) => {
      setCustomOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled', timeline: buildCancelledTimeline(o) } : o)),
      )
    },
    [setCustomOrders],
  )

  const value = useMemo(
    () => ({ orders: allOrders, customOrders, getOrder, addOrder, cancelOrder, TRACKING_STAGES, STATUS_TO_STEP }),
    [allOrders, customOrders, getOrder, addOrder, cancelOrder],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

function buildCancelledTimeline(order) {
  return (order.timeline || []).map((stage, i) =>
    i === 0 ? { ...stage, state: 'completed' } : { ...stage, state: 'pending', date: null, time: null },
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider')
  return ctx
}