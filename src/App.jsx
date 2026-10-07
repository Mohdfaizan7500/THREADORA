import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ToastHost from './components/Toast.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Collections from './pages/Collections.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Booking from './pages/Booking.jsx'
import BookingSuccess from './pages/BookingSuccess.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import MyBookings from './pages/MyBookings.jsx'
import BookingDetails from './pages/BookingDetails.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function Shell({ children }) {
  return <MainLayout>{children}</MainLayout>
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ProductsProvider>
            <OrdersProvider>
              <WishlistProvider>
                <CartProvider>
                  <ScrollToTop />
                  <ToastHost />
                  <Routes>
                    <Route path="/" element={<Shell><Home /></Shell>} />
                    <Route path="/shop" element={<Shell><Shop /></Shell>} />
                    <Route path="/collections" element={<Shell><Collections /></Shell>} />
                    <Route path="/product/:id" element={<Shell><ProductDetails /></Shell>} />
                    <Route path="/cart" element={<Shell><Cart /></Shell>} />
                    <Route path="/booking" element={<Shell><Booking /></Shell>} />
                    <Route path="/booking-success/:id" element={<Shell><BookingSuccess /></Shell>} />
                    <Route path="/track-order" element={<Shell><TrackOrder /></Shell>} />
                    <Route path="/my-bookings" element={<Shell><MyBookings /></Shell>} />
                    <Route path="/booking/:id" element={<Shell><BookingDetails /></Shell>} />
                    <Route path="/wishlist" element={<Shell><Wishlist /></Shell>} />
                    <Route path="/profile" element={<Shell><Profile /></Shell>} />
                    <Route path="/about" element={<Shell><About /></Shell>} />
                    <Route path="/contact" element={<Shell><Contact /></Shell>} />
                    {/* Auth pages render without the main chrome for a focused experience */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Shell><NotFound /></Shell>} />
                  </Routes>
                </CartProvider>
              </WishlistProvider>
            </OrdersProvider>
          </ProductsProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}