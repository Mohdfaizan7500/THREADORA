import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SearchModal from '../components/SearchModal.jsx'
import QuickView from '../components/QuickView.jsx'

export default function MainLayout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <main id="main">{children}</main>
      <Footer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickView />
    </div>
  )
}