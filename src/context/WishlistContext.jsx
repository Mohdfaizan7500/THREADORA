import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/index.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('threadora.wishlist', [])

  const toggle = useCallback(
    (productId) => {
      let added = false
      setIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId)
        }
        added = true
        return [...prev, productId]
      })
      return added
    },
    [setIds],
  )

  const remove = useCallback(
    (productId) => setIds((prev) => prev.filter((id) => id !== productId)),
    [setIds],
  )

  const clear = useCallback(() => setIds([]), [setIds])

  const has = useCallback((productId) => ids.includes(productId), [ids])

  const value = useMemo(
    () => ({ ids, count: ids.length, toggle, remove, clear, has }),
    [ids, toggle, remove, clear, has],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}