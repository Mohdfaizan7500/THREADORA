import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import { cartItemKey, lineTotal, sumCart, sumMrp } from '../utils/format.js'

const CartContext = createContext(null)

const FREE_DELIVERY_THRESHOLD = 2000
const STANDARD_DELIVERY_FEE = 99

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('threadora.cart', [])

  const addItem = useCallback(
    (product, { size, color, quantity = 1 } = {}) => {
      const key = cartItemKey(product.id, size, color)
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
          )
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            mrp: product.mrp,
            categoryLabel: product.categoryLabel,
            size: size || product.sizes?.[0] || 'M',
            color: color || product.colors?.[0] || 'Black',
            quantity,
          },
        ]
      })
    },
    [setItems],
  )

  const updateQuantity = useCallback(
    (key, quantity) => {
      setItems((prev) =>
        prev
          .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
          .filter((i) => i.quantity > 0),
      )
    },
    [setItems],
  )

  const removeItem = useCallback(
    (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
    [setItems],
  )

  const clearCart = useCallback(() => setItems([]), [setItems])

  const isInCart = useCallback(
    (productId, size, color) =>
      items.some((i) => i.key === cartItemKey(productId, size, color)),
    [items],
  )

  const getItem = useCallback(
    (productId, size, color) =>
      items.find((i) => i.key === cartItemKey(productId, size, color)) || null,
    [items],
  )

  const decrement = useCallback(
    (productId, size, color) => {
      const key = cartItemKey(productId, size, color)
      setItems((prev) =>
        prev
          .map((i) => (i.key === key ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      )
    },
    [setItems],
  )

  const increment = useCallback(
    (productId, size, color) => {
      const key = cartItemKey(productId, size, color)
      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i)),
      )
    },
    [setItems],
  )

  const value = useMemo(() => {
    const subtotal = sumCart(items)
    const mrpTotal = sumMrp(items)
    const discount = Math.max(0, mrpTotal - subtotal)
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
    const total = subtotal + deliveryFee
    const count = items.reduce((n, i) => n + i.quantity, 0)
    return {
      items,
      count,
      subtotal,
      discount,
      deliveryFee,
      total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      lineTotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart,
      getItem,
      increment,
      decrement,
    }
  }, [items, addItem, updateQuantity, removeItem, clearCart, isInCart, getItem, increment, decrement])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}