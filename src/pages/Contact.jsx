import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Send as Pinterest,
  CheckCircle2,
} from 'lucide-react'
import { CONTACT_INFO, FAQS, BUSINESS_HOURS } from '../data/content.js'
import { emailValid, phoneValid } from '../utils/format.js'
import { useToast } from '../context/ToastContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import './Contact.css'

const SOCIAL_ICONS = [
  { name: 'Instagram', Icon: Instagram },
  { name: 'Facebook', Icon: Facebook },
  { name: 'YouTube', Icon: Youtube },
  { name: 'Pinterest', Icon: Pinterest },
]

export default function Contact() {
  const { success, error } = useToast()
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Please enter your name.'
    if (!emailValid(form.email)) err.email = 'Enter a valid email.'
    if (form.mobile && !phoneValid(form.mobile)) err.mobile = 'Enter a valid mobile number.'
    if (!form.subject.trim()) err.subject = 'Please add a subject.'
    if (form.message.trim().length < 10) err.message = 'Message should be at least 10 characters.'
    setErrors(err)
    if (Object.keys(err).length) {
      error('Please fix the highlighted fields.')
      return
    }
    setSent(true)
    success('Message sent! We’ll get back to you soon.')
  }

  return (
    <div className="contact">
      <PageHeader
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        subtitle="Questions, feedback or styling advice — our team is here to help."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <div className="container contact__layout">
        {/* Info column */}
        <aside className="contact__info">
          <div className="contact__info-card card">
            <h3>Contact Information</h3>
            <ul className="contact__info-list">
              <li>
                <span className="contact__info-icon"><Mail size={18} /></span>
                <div><span className="muted">Email</span><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></div>
              </li>
              <li>
                <span className="contact__info-icon"><Phone size={18} /></span>
                <div><span className="muted">Phone</span><a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a></div>
              </li>
              <li>
                <span className="contact__info-icon"><MapPin size={18} /></span>
                <div><span className="muted">Address</span><span>{CONTACT_INFO.address}</span></div>
              </li>
            </ul>
          </div>

          <div className="contact__info-card card">
            <h3><Clock size={18} /> Business Hours</h3>
            <ul className="contact__hours">
              {BUSINESS_HOURS.map((h) => (
                <li key={h.day}>
                  <span>{h.day}</span>
                  <strong>{h.hours}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact__social">
            <span className="muted">Follow us</span>
            <div className="contact__social-links">
              {SOCIAL_ICONS.map(({ name, Icon }) => (
                <a key={name} href="#" aria-label={name}><Icon size={18} /></a>
              ))}
            </div>
          </div>
        </aside>

        {/* Form column */}
        <main className="contact__main">
          <section className="contact__form-card card">
            {sent ? (
              <div className="contact__success">
                <CheckCircle2 size={40} />
                <h2>Message sent!</h2>
                <p>Thanks {form.name.split(' ')[0]}, our team will respond within 24 hours.</p>
                <button className="btn btn--outline" onClick={() => { setSent(false); setForm({ name: '', email: '', mobile: '', subject: '', message: '' }) }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2>Send us a message</h2>
                <form onSubmit={submit} noValidate>
                  <div className="form-grid">
                    <div className="field">
                      <label>Name</label>
                      <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
                      {errors.name && <span className="field__error">{errors.name}</span>}
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                      {errors.email && <span className="field__error">{errors.email}</span>}
                    </div>
                    <div className="field">
                      <label>Mobile</label>
                      <input className="input" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" />
                      {errors.mobile && <span className="field__error">{errors.mobile}</span>}
                    </div>
                    <div className="field">
                      <label>Subject</label>
                      <input className="input" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="How can we help?" />
                      {errors.subject && <span className="field__error">{errors.subject}</span>}
                    </div>
                  </div>
                  <div className="field">
                    <label>Message</label>
                    <textarea className="textarea" rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us a little more…" />
                    {errors.message && <span className="field__error">{errors.message}</span>}
                  </div>
                  <button className="btn btn--primary btn--lg" type="submit">
                    <Send size={17} /> Send Message
                  </button>
                </form>
              </>
            )}
          </section>

          {/* FAQ */}
          <section className="contact__faq">
            <h2>Frequently Asked Questions</h2>
            <div className="contact__faq-list">
              {FAQS.map((f, i) => (
                <FaqItem key={i} {...f} defaultOpen={i === 0} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-item__q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <ChevronDown size={18} className="faq-item__icon" />
      </button>
      <div className="faq-item__a">
        <p>{a}</p>
      </div>
    </div>
  )
}