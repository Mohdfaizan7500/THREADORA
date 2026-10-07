// Live product data from the free DummyJSON API.
// https://dummyjson.com/docs/products
//
// We fetch every product once and normalise it to the shape the storefront
// already understands (name, categoryLabel, price/mrp, gallery, ...).

import { COLORS, SIZES, prettifyCategory } from '../data/products.js'

const BASE_URL = 'https://dummyjson.com/products?limit=0'
const API_URL = 'https://dummyjson.com/products?limit=0'

// DummyJSON prices are in USD; the storefront prices are shown in ₹.
const USD_TO_INR = 83
const toInr = (usd) => Math.round((Number(usd) || 0) * USD_TO_INR)

// Deterministic hash so each product gets stable colours/sizes across renders.
function hashString(str) {
  let hash = 0
  for (let i = 0; i < String(str).length; i += 1) {
    hash = (hash << 5) - hash + String(str).charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Guesses a garment silhouette for the offline SVG fallback.
function inferType(category = '', title = '') {
  const c = `${category} ${title}`.toLowerCase()
  if (c.includes('shoe') || c.includes('sneaker') || c.includes('trainer')) return 'accessory'
  if (c.includes('watch')) return 'accessory'
  if (c.includes('bag') || c.includes('jewellery') || c.includes('sunglass')) return 'accessory'
  if (c.includes('dress') || c.includes('gown') || c.includes('frock') || c.includes('top')) return 'tshirt'
  if (c.includes('shirt')) return 'shirt'
  if (c.includes('jeans') || c.includes('trouser') || c.includes('pant') || c.includes('short')) return 'jeans'
  if (c.includes('jacket') || c.includes('coat')) return 'jacket'
  return 'tshirt'
}

const ONE_SIZE_CATEGORIES = ['accessories', 'womens-bags', 'womens-jewellery', 'sunglasses', 'mens-watches', 'womens-watches', 'womens-shoes', 'mens-shoes']

function inferSizes(category, seed) {
  if (ONE_SIZE_CATEGORIES.some((c) => category.includes(c))) {
    return category.includes('shoes') ? ['6', '7', '8', '9', '10'] : ['One Size']
  }
  const pick = SIZES.filter((_, i) => (hashString(`${seed}-${i}`) % 4) !== 0)
  return pick.length ? pick : SIZES
}

function inferColors(seed) {
  const count = 2 + (hashString(seed) % 3)
  const start = hashString(`c${seed}`) % COLORS.length
  return Array.from({ length: count }, (_, i) => COLORS[(start + i) % COLORS.length].name)
}

function inferTag(p) {
  if (p.stock > 0 && p.stock <= 10) return 'Low Stock'
  if (p.discountPercentage >= 15) return 'Sale'
  if (p.rating >= 4.5) return 'Top Rated'
  if (p.discountPercentage >= 8) return 'Deal'
  return ''
}

function inferFabric(category = '') {
  const c = category.toLowerCase()
  if (c.includes('watch')) return 'Stainless Steel'
  if (c.includes('bag')) return 'Full-Grain Leather'
  if (c.includes('jewellery')) return 'Gold-Plated Alloy'
  if (c.includes('glass')) return 'Acetate Frame, UV400 Lenses'
  if (c.includes('shoe')) return 'Leather & Rubber'
  if (c.includes('dress')) return 'Viscose Blend'
  return 'Premium Cotton Blend'
}

function inferFit(category = '') {
  const c = category.toLowerCase()
  if (c.includes('watch') || c.includes('bag') || c.includes('glass')) return 'One Size'
  if (c.includes('dress')) return 'Regular Fit'
  return 'Relaxed Fit'
}

// Normalises one DummyJSON product into the storefront product model.
export function mapProduct(raw) {
  const discount = Math.round(raw.discountPercentage || 0)
  const price = toInr(raw.price)
  const mrp = discount > 0 ? Math.round(price / (1 - discount / 100)) : price
  const gallery = raw.images?.length ? raw.images : [raw.thumbnail].filter(Boolean)
  const category = raw.category || 'all'
  const seed = `${raw.id}-${raw.title}`

  return {
    id: raw.id,
    name: raw.title,
    category,
    categoryLabel: prettifyCategory(category),
    brand: raw.brand || 'THREADORA',
    price,
    mrp,
    discount,
    rating: Number(raw.rating) || 0,
    reviews: raw.reviews?.length || 0,
    reviewList: raw.reviews || [],
    type: inferType(category, raw.title),
    colors: inferColors(seed),
    sizes: inferSizes(category, seed),
    tag: inferTag(raw),
    fabric: inferFabric(category),
    fit: inferFit(category),
    care: 'Wipe / Wash with care',
    desc: raw.description || '',
    image: raw.thumbnail || gallery[0],
    gallery,
    inStock: (raw.stock ?? 0) > 0,
    stock: raw.stock ?? 0,
    sku: raw.sku || '',
    shipping: raw.shippingInformation || 'Ships in 3-5 business days',
    warranty: raw.warrantyInformation || '',
    returnPolicy: raw.returnPolicy || '',
  }
}

// Fetches all products and returns them normalised.
export async function fetchProducts(signal) {
  const res = await fetch(BASE_URL, { signal })
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
  const data = await res.json()
  return (data.products || []).map(mapProduct)
}

// Builds the filter/sidebar category list from the loaded products.
export function buildCategories(products) {
  const seen = new Map()
  products.forEach((p) => {
    if (!seen.has(p.category)) {
      seen.set(p.category, {
        id: p.category,
        title: p.categoryLabel,
        type: p.type,
        blurb: `Shop our ${p.categoryLabel.toLowerCase()} collection.`,
      })
    }
  })
  return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export function buildBrands(products) {
  return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort()
}

export function buildPriceBounds(products) {
  if (!products.length) return { min: 0, max: 100 }
  const prices = products.map((p) => p.price)
  return { min: 0, max: Math.ceil(Math.max(...prices)) }
}

export { BASE_URL, API_URL }