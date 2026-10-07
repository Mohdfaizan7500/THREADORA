import { useState } from 'react'
import { Mail, CheckCircle2, Send } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import { emailValid } from '../utils/format.js'
import './Newsletter.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const { success } = useToast()

  const submit = (e) => {
    e.preventDefault()
    if (!emailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setDone(true)
    success('Subscribed! Welcome to THREADORA.')
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div className="newsletter__copy">
          <span className="eyebrow">Stay in the loop</span>
          <h2>Join the THREADORA list.</h2>
          <p>
            Be first to know about new arrivals, private sales and styling stories.
            No spam — just the good stuff.
          </p>
        </div>

        {done ? (
          <div className="newsletter__success" role="status">
            <CheckCircle2 size={26} />
            <div>
              <strong>You're on the list!</strong>
              <p>Thanks for subscribing. Check your inbox for a welcome note.</p>
            </div>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={submit} noValidate>
            <div className="newsletter__input">
              <Mail size={18} aria-hidden="true" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
            </div>
            <button className="btn btn--primary" type="submit">
              Subscribe <Send size={16} />
            </button>
            {error && <p className="newsletter__error">{error}</p>}
          </form>
        )}
      </div>
    </section>
  )
}