import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserRound, Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { DEMO_CREDENTIALS } from '../data/content.js'
import './Auth.css'

export default function Login() {
  const { login, continueAsGuest, loading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [localError, setLocalError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    const fe = {}
    if (!identifier.trim()) fe.identifier = 'Enter your email or mobile.'
    if (!password) fe.password = 'Enter your password.'
    setFieldErrors(fe)
    if (Object.keys(fe).length) return

    const res = await login({ identifier, password })
    if (res.ok) {
      success('Welcome back to THREADORA')
      navigate(redirectTo, { replace: true })
    } else {
      setLocalError(res.error)
      error('Login failed. Check your credentials.')
    }
  }

  const useDemo = () => {
    setIdentifier(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setLocalError('')
    setFieldErrors({})
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <Link to="/" className="auth__back"><ArrowLeft size={16} /> Back to store</Link>

        <div className="auth__card">
          <span className="auth__logo">THREADORA</span>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to continue your story.</p>

          {localError && <div className="auth__alert" role="alert">{localError}</div>}

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="identifier">Mobile / Email</label>
              <input
                id="identifier"
                className="input"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setFieldErrors((p) => ({ ...p, identifier: '' })) }}
                placeholder="demo@threadora.com"
                autoComplete="username"
              />
              {fieldErrors.identifier && <span className="field__error">{fieldErrors.identifier}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="auth__pw">
                <input
                  id="password"
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                  placeholder="••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="auth__pw-toggle" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
            </div>

            <button className="btn btn--primary btn--block btn--lg" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : <><LogIn size={18} /> Login</>}
            </button>
          </form>

          <button
            className="btn btn--outline btn--block"
            onClick={async () => {
              await continueAsGuest()
              success('Browsing as guest')
              navigate(redirectTo, { replace: true })
            }}
            disabled={loading}
          >
            <UserRound size={17} /> Continue as Guest
          </button>

          <button className="auth__demo" onClick={useDemo}>
            <Sparkles size={14} /> Use demo credentials
          </button>

          <p className="auth__switch">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>

        <p className="auth__hint">
          Demo credentials — Email: <strong>{DEMO_CREDENTIALS.email}</strong> · Password: <strong>{DEMO_CREDENTIALS.password}</strong>
        </p>
      </div>

      <div className="auth__visual">
        <div className="auth__visual-content">
          <span className="auth__visual-mark">THREADORA</span>
          <h2>Wear Your Story.</h2>
          <p>Sign in to track orders, save favourites and keep your wardrobe story going.</p>
        </div>
      </div>
    </div>
  )
}