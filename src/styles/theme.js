// Centralized theme tokens for the THREADORA storefront.
// All components should reference these values (via CSS variables where
// possible) instead of hardcoding colors.

export const colors = {
  background: '#F8F7F4',
  primary: '#171717',
  secondary: '#6B6B6B',
  accent: '#B68C5A',
  white: '#FFFFFF',
  border: '#E5E2DC',
  success: '#2E8B57',
  warning: '#D89B32',
  danger: '#C94C4C',
}

export const radii = {
  sm: '8px',
  md: '14px',
  lg: '22px',
  xl: '32px',
  pill: '999px',
}

export const shadows = {
  sm: '0 1px 2px rgba(23,23,23,0.05)',
  md: '0 8px 24px rgba(23,23,23,0.06)',
  lg: '0 20px 48px rgba(23,23,23,0.10)',
}

export const typography = {
  fontDisplay: "'Fraunces', 'Playfair Display', Georgia, serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// Maps brand tokens into CSS custom properties injected at runtime.
export function applyThemeToDocument() {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  Object.entries(radii).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value)
  })
  Object.entries(shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value)
  })
}