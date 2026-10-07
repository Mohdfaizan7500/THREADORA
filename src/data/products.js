// Presentation metadata shared across the storefront. Product data itself is
// fetched live from https://dummyjson.com (see src/api/dummyjson.js); these
// constants describe the swatches/sizes we offer in the demo UI.

export const COLORS = [
  { name: 'Black', hex: '#171717' },
  { name: 'Ivory', hex: '#F3EFE7' },
  { name: 'Sand', hex: '#D9C7AE' },
  { name: 'Navy', hex: '#27324A' },
  { name: 'Olive', hex: '#6E7355' },
  { name: 'Terracotta', hex: '#B0725A' },
  { name: 'Grey', hex: '#8A8F8A' },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Turns an API category slug (e.g. "mens-shirts") into a display title.
export function prettifyCategory(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => {
      if (word === 'mens') return "Men's"
      if (word === 'womens') return "Women's"
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}