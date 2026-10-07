import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchProducts,
  buildCategories,
  buildBrands,
  buildPriceBounds,
} from '../api/dummyjson.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    fetchProducts(controller.signal)
      .then((list) => {
        if (!active) return
        setProducts(list)
      })
      .catch((err) => {
        if (!active || err.name === 'AbortError') return
        setError(err.message || 'Something went wrong while loading products.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey((k) => k + 1), [])

  const value = useMemo(() => {
    return {
      products,
      loading,
      error,
      retry,
      categories: buildCategories(products),
      brands: buildBrands(products),
      priceBounds: buildPriceBounds(products),
      getProductById: (id) => products.find((p) => String(p.id) === String(id)),
      getRelatedProducts: (product, count = 4) => {
        if (!product) return []
        return products
          .filter(
            (p) =>
              p.id !== product.id &&
              (p.category === product.category || p.type === product.type),
          )
          .slice(0, count)
      },
    }
  }, [products, loading, error, retry])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider')
  return ctx
}