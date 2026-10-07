import { useCallback, useEffect, useState } from 'react'

// useLocalStorage — state synced to localStorage so demo interactions persist
// across reloads without any backend.
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored))
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
  }, [key, stored])

  return [stored, setStored]
}

// useMediaQuery — responsive behaviour in JS (drawers, layouts).
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// useDebouncedValue — smooths search inputs.
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// useScrollLock — prevents body scroll while a modal/drawer is open.
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

// useCopyToClipboard — used for "Order ID copied" toasts.
export function useCopyToClipboard() {
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])
  return copy
}

// useScrollTop — scroll to top on route change.
export function useScrollTop(dep) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [dep])
}