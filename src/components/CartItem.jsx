import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency, lineTotal } from '../utils/format.js'
import { colorHex } from './QuickView.jsx'
import './CartItem.css'

export default function CartItem({ item, onQuantity, onRemove }) {
  return (
    <article className="cart-item">
      <Link to={`/product/${item.id}`} className="cart-item__media">
        <img src={item.image} alt={item.name} />
      </Link>

      <div className="cart-item__info">
        <span className="cart-item__cat">{item.categoryLabel}</span>
        <h3 className="cart-item__name">
          <Link to={`/product/${item.id}`}>{item.name}</Link>
        </h3>
        <div className="cart-item__attrs">
          <span className="cart-item__attr">
            Size <strong>{item.size}</strong>
          </span>
          <span className="cart-item__attr">
            Color
            <span className="cart-item__dot" style={{ background: colorHex(item.color) }} />
            <strong>{item.color}</strong>
          </span>
        </div>

        <button className="cart-item__remove-mobile" onClick={() => onRemove(item.key)}>
          <Trash2 size={15} /> Remove
        </button>
      </div>

      <div className="cart-item__qty">
        <button
          className="qty-btn"
          onClick={() => onQuantity(item.key, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          <Minus size={15} />
        </button>
        <span aria-live="polite">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => onQuantity(item.key, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="cart-item__price">
        <span className="price">{formatCurrency(lineTotal(item))}</span>
        {item.mrp > item.price && (
          <span className="price--strike">{formatCurrency(item.mrp * item.quantity)}</span>
        )}
      </div>

      <button
        className="cart-item__remove"
        onClick={() => onRemove(item.key)}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={17} />
      </button>
    </article>
  )
}