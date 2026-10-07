import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { emailValid, phoneValid } from '../utils/format.js'
import './Auth.css'

export default function Register() {
  const { register, loading } = useAuth()
  const { success, error } = useToast()

  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your full name.'
    if (!emailValid(form.email)) e.email = 'Enter a valid email address.'
    if (!phoneValid(form.mobile)) e.mobile = 'Enter a valid mobile number.'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const res = await register(form)
    if (res.ok) {
      success('Account created successfully!')
      setDone(true)
    } else {
      error(res.error)
      setErrors((p) => ({ ...p, email: res.error }))
    }
  }

  if (done) {
    return (
      <div className="auth">
        <div className="auth__panel">
          <Link to="/" className="auth__back"><ArrowLeft size={16} /> Back to store</Link>
          <div className="auth__card auth__card--success">
            <div className="auth__success-icon"><CheckCircle2 size={40} /></div>
            <h1>Welcome to THREADORA</h1>
            <p className="muted">Your account has been created successfully. You can now sign in and start shopping.</p>
            <Link className="btn btn--primary btn--block btn--lg" to="/login">Continue to Login</Link>
            <Link className="btn btn--ghost btn--block" to="/">Go to Home</Link>
          </div>
        </div>
        <div className="auth__visual">
          <div className="auth__visual-content">
            <span className="auth__visual-mark">THREADORA</span>
            <h2>Your story starts here.</h2>
            <p>Join a community of 10,000+ customers who wear their story every day.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <Link to="/" className="auth__back"><ArrowLeft size={16} /> Back to store</Link>

        <div className="auth__card">
          <span className="auth__logo">THREADORA</span>
          <h1>Create account</h1>
          <p className="muted">Join THREADORA in a few seconds.</p>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input id="name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Rahul Sharma" autoComplete="name" />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="mobile">Mobile</label>
              <input id="mobile" className="input" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
              {errors.mobile && <span className="field__error">{errors.mobile}</span>}
            </div>

            <div className="auth__row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="auth__pw">
                  <input id="password" className="input" type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 6 characters" autoComplete="new-password" />
                  <button type="button" className="auth__pw-toggle" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field__error">{errors.password}</span>}
              </div>

              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input id="confirm" className="input" type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
                {errors.confirm && <span className="field__error">{errors.confirm}</span>}
              </div>
            </div>

            <button className="btn btn--primary btn--block btn--lg" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="auth__switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <div className="auth__visual">
        <div className="auth__visual-content">
          <span className="auth__visual-mark">THREADORA</span>
          <h2>Wear Your Story.</h2>
          <p>Create an account to save favourites, book faster and track every order.</p>
        </div>
      </div>
    </div>
  )
}