// Curated dummy imagery sourced from https://dummyjson.com/products
// Used for hero banners, category tiles and editorial blocks.

const CDN = 'https://cdn.dummyjson.com/product-images'

const url = (path, n = 1) => `${CDN}/${path}/${n}.webp`

export const HERO_IMAGES = [
  url('womens-dresses/marni-red-&-black-suit', 1),
  url('womens-dresses/dress-pea', 1),
  url('mens-shirts/man-plaid-shirt', 1),
  url('womens-dresses/black-women\'s-gown', 1),
]

// Keyed by DummyJSON category slug (plus garment-type fallbacks below).
export const CATEGORY_IMAGES = {
  'mens-shirts': url('mens-shirts/blue-&-black-check-shirt', 1),
  'mens-shoes': url('mens-shoes/puma-future-rider-trainers', 1),
  'mens-watches': url('mens-watches/rolex-datejust', 1),
  tops: url('tops/girl-summer-dress', 1),
  'womens-dresses': url('womens-dresses/dress-pea', 1),
  'womens-shoes': url('womens-shoes/golden-shoes-woman', 1),
  'womens-bags': url('womens-bags/heshe-women\'s-leather-bag', 1),
  'womens-jewellery': url('womens-jewellery/green-oval-earring', 1),
  'womens-watches': url('womens-watches/watch-gold-for-women', 1),
  sunglasses: url('sunglasses/black-sun-glasses', 1),
}

// Fallback imagery by inferred garment type.
const TYPE_IMAGES = {
  shirt: url('mens-shirts/man-plaid-shirt', 1),
  tshirt: url('mens-shirts/gigabyte-aorus-men-tshirt', 1),
  jeans: url('womens-dresses/corset-with-black-skirt', 1),
  jacket: url('womens-dresses/marni-red-&-black-suit', 1),
  accessory: url('womens-bags/heshe-women\'s-leather-bag', 1),
}

export const COLLECTION_IMAGES = {
  autumn: url('womens-dresses/marni-red-&-black-suit', 2),
  everyday: url('mens-shirts/gigabyte-aorus-men-tshirt', 2),
  tailored: url('mens-shirts/man-plaid-shirt', 2),
  denim: url('womens-dresses/corset-with-black-skirt', 2),
}

export const STORY_IMAGES = [
  url('mens-shirts/man-short-sleeve-shirt', 1),
  url('mens-shirts/blue-&-black-check-shirt', 1),
  url('mens-shoes/puma-future-rider-trainers', 1),
  url('womens-dresses/corset-leather-with-skirt', 1),
  url('sunglasses/black-sun-glasses', 1),
]

export const BRAND_IMAGE = url('mens-shirts/man-short-sleeve-shirt', 2)
export const ABOUT_HERO_IMAGE = url('womens-dresses/dress-pea', 2)

export function categoryImage(id) {
  return CATEGORY_IMAGES[id] || TYPE_IMAGES[id] || HERO_IMAGES[0]
}

export function collectionImage(id) {
  return COLLECTION_IMAGES[id] || HERO_IMAGES[0]
}

export function heroImageAt(i = 0) {
  return HERO_IMAGES[i % HERO_IMAGES.length]
}

export function storyImageAt(i = 0) {
  return STORY_IMAGES[i % STORY_IMAGES.length]
}