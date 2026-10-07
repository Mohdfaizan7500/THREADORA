// Small formatting / domain helpers shared across the app.

export function formatCurrency(value) {
  const n = Number(value) || 0
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function formatDate(input, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!input) return '—'
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleDateString('en-IN', opts)
}

export function formatDateTime(input) {
  if (!input) return '—'
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function cartItemKey(productId, size, color) {
  return `${productId}__${size}__${color}`
}

export function lineTotal(item) {
  return (Number(item.price) || 0) * (Number(item.quantity) || 1)
}

export function sumCart(cart) {
  return cart.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function sumMrp(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.mrp) || Number(item.price) || 0) * item.quantity, 0)
}

// Generates a demo order id like THR-2026-10482.
export function generateOrderId(existingIds = []) {
  const year = new Date().getFullYear()
  let id
  let counter = 10482
  do {
    id = `THR-${year}-${counter}`
    counter += 1
  } while (existingIds.includes(id))
  return id
}

export function generateTrackingNumber() {
  return `TRD${Math.floor(100000000 + Math.random() * 899999999)}`
}

// Adds business days (skips Sundays) to an ISO date string.
export function addBusinessDays(isoDate, days) {
  const d = new Date(isoDate)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) added += 1
  }
  return d.toISOString().slice(0, 10)
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function debounce(fn, delay = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function truncate(str, n = 60) {
  if (!str) return ''
  return str.length > n ? `${str.slice(0, n).trim()}…` : str
}

export function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function phoneValid(phone) {
  return /^[+\d][\d\s-]{7,15}$/.test(phone.trim())
}