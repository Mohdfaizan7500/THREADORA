// ---------------------------------------------------------------------------
// Demo orders — cover every lifecycle status so the tracking UI can be shown.
// Items are defined inline (with DummyJSON imagery) so seeded orders stay
// stable regardless of the live product feed.
// ---------------------------------------------------------------------------

const CDN = 'https://cdn.dummyjson.com/product-images'

const DEMO_ITEMS = {
  1: { id: 1, name: 'Classic Oversized T-Shirt', price: 899, mrp: 1299, categoryLabel: 'T-Shirts', image: `${CDN}/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp` },
  2: { id: 2, name: 'Premium Linen Shirt', price: 1499, mrp: 2199, categoryLabel: 'Shirts', image: `${CDN}/mens-shirts/man-plaid-shirt/thumbnail.webp` },
  3: { id: 3, name: 'Urban Denim Jacket', price: 2499, mrp: 3499, categoryLabel: 'Jackets', image: `${CDN}/womens-dresses/marni-red-&-black-suit/thumbnail.webp` },
  4: { id: 4, name: 'Essential Black Hoodie', price: 1799, mrp: 2599, categoryLabel: 'Hoodies', image: `${CDN}/mens-shirts/men-check-shirt/thumbnail.webp` },
  7: { id: 7, name: 'Relaxed Cargo Pants', price: 1899, mrp: 2699, categoryLabel: 'Pants', image: `${CDN}/mens-shoes/nike-baseball-cleats/thumbnail.webp` },
  11: { id: 11, name: 'Quilted Puffer Jacket', price: 3299, mrp: 4599, categoryLabel: 'Jackets', image: `${CDN}/mens-watches/brown-leather-belt-watch/thumbnail.webp` },
  13: { id: 13, name: 'Wide Leg Trousers', price: 1799, mrp: 2499, categoryLabel: "Women's Wear", image: `${CDN}/tops/blue-frock/thumbnail.webp` },
  17: { id: 17, name: 'Leather Belt', price: 999, mrp: 1499, categoryLabel: 'Accessories', image: `${CDN}/womens-bags/blue-women's-handbag/thumbnail.webp` },
}

export const ORDER_STATUS = {
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

// Ordered lifecycle (used by the tracking timeline).
export const TRACKING_STAGES = [
  { key: 'confirmed', label: 'Booking Confirmed', description: 'Your booking has been successfully received.' },
  { key: 'processing', label: 'Order Processing', description: 'Our team is preparing your order.' },
  { key: 'packed', label: 'Packed', description: 'Your clothes have been packed.' },
  { key: 'shipped', label: 'Shipped', description: 'Your package has left our warehouse.' },
  { key: 'outForDelivery', label: 'Out for Delivery', description: 'Your parcel is on the way to you.' },
  { key: 'delivered', label: 'Delivered', description: 'Delivered to your doorstep. Enjoy!' },
]

export const STATUS_TO_STEP = {
  Confirmed: 0,
  Processing: 1,
  Packed: 2,
  Shipped: 3,
  'Out for Delivery': 4,
  Delivered: 5,
  Cancelled: -1,
}

const p = (id) => DEMO_ITEMS[id]

function item(productId, size, color, qty) {
  const product = p(productId)
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
    size,
    color,
    quantity: qty,
    categoryLabel: product.categoryLabel,
  }
}

// Timeline helper — builds stage timestamps relative to order date & status.
function buildTimeline(dateISO, status, times) {
  const base = new Date(`${dateISO}T00:00:00`)
  const step = STATUS_TO_STEP[status]
  return TRACKING_STAGES.map((stage, i) => {
    const stageDate = new Date(base)
    stageDate.setDate(base.getDate() + Math.min(i, 2))
    const isComplete = step >= 0 && i < step
    const isCurrent = step >= 0 && i === step
    const state = isComplete ? 'completed' : isCurrent ? 'current' : 'pending'
    return {
      ...stage,
      state,
      date: state === 'pending' ? null : stageDate.toISOString().slice(0, 10),
      time: state === 'pending' ? null : (times?.[i] ?? '10:30 AM'),
    }
  })
}

export const ORDERS = [
  {
    id: 'THR-2026-10482',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2026-10-05',
    status: ORDER_STATUS.SHIPPED,
    paymentMethod: 'UPI',
    total: 3498,
    subtotal: 3398,
    discount: 0,
    deliveryFee: 100,
    trackingNumber: 'TRD784512963',
    courier: 'THREADORA EXPRESS',
    estimatedDelivery: '2026-10-10',
    deliveryOption: 'Express Delivery',
    address: {
      line1: '42, Lajpat Nagar, Block C',
      line2: 'Near Central Market',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    items: [item(2, 'M', 'Ivory', 1), item(1, 'L', 'Black', 2)],
    timeline: buildTimeline('2026-10-05', ORDER_STATUS.SHIPPED, [
      '10:30 AM',
      '2:15 PM',
      '11:00 AM',
      '9:30 AM',
    ]),
  },
  {
    id: 'THR-2026-10481',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2026-10-01',
    status: ORDER_STATUS.DELIVERED,
    paymentMethod: 'Cash on Delivery',
    total: 5298,
    subtotal: 5198,
    discount: 200,
    deliveryFee: 0,
    trackingNumber: 'TRD771209845',
    courier: 'THREADORA EXPRESS',
    estimatedDelivery: '2026-10-06',
    deliveryOption: 'Standard Delivery',
    address: {
      line1: '42, Lajpat Nagar, Block C',
      line2: 'Near Central Market',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    items: [item(3, 'M', 'Navy', 1), item(4, 'L', 'Black', 1), item(17, 'M', 'Black', 1)],
    timeline: buildTimeline('2026-10-01', ORDER_STATUS.DELIVERED, [
      '9:10 AM',
      '12:40 PM',
      '4:20 PM',
      '8:05 AM',
      '10:30 AM',
      '2:45 PM',
    ]),
  },
  {
    id: 'THR-2026-10480',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2026-10-06',
    status: ORDER_STATUS.PROCESSING,
    paymentMethod: 'Card',
    total: 1899,
    subtotal: 1899,
    discount: 0,
    deliveryFee: 0,
    trackingNumber: 'TRD790014523',
    courier: 'THREADORA EXPRESS',
    estimatedDelivery: '2026-10-12',
    deliveryOption: 'Standard Delivery',
    address: {
      line1: '42, Lajpat Nagar, Block C',
      line2: 'Near Central Market',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    items: [item(7, '32', 'Olive', 1)],
    timeline: buildTimeline('2026-10-06', ORDER_STATUS.PROCESSING, ['11:45 AM', '3:30 PM']),
  },
  {
    id: 'THR-2026-10479',
    customer: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '+91 98111 22334',
    date: '2026-09-28',
    status: ORDER_STATUS.CANCELLED,
    paymentMethod: 'UPI',
    total: 1799,
    subtotal: 1799,
    discount: 0,
    deliveryFee: 0,
    trackingNumber: '—',
    courier: 'THREADORA EXPRESS',
    estimatedDelivery: '2026-10-03',
    deliveryOption: 'Standard Delivery',
    address: {
      line1: '18, Indiranagar, 12th Main',
      line2: 'Opp. Metro Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [item(13, 'M', 'Black', 1)],
    timeline: buildTimeline('2026-09-28', ORDER_STATUS.CANCELLED, ['10:00 AM']),
  },
  {
    id: 'THR-2026-10478',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2026-10-07',
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    paymentMethod: 'UPI',
    total: 3299,
    subtotal: 3299,
    discount: 0,
    deliveryFee: 100,
    trackingNumber: 'TRD801147526',
    courier: 'THREADORA EXPRESS',
    estimatedDelivery: '2026-10-10',
    deliveryOption: 'Express Delivery',
    address: {
      line1: '42, Lajpat Nagar, Block C',
      line2: 'Near Central Market',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
    },
    items: [item(11, 'L', 'Olive', 1)],
    timeline: buildTimeline('2026-10-07', ORDER_STATUS.OUT_FOR_DELIVERY, [
      '9:00 AM',
      '11:30 AM',
      '3:10 PM',
      '7:45 AM',
      '9:20 AM',
    ]),
  },
]

export const SAMPLE_ORDER_ID = 'THR-2026-10482'

export function findOrderById(id) {
  if (!id) return null
  return ORDERS.find((o) => o.id.toLowerCase() === String(id).trim().toLowerCase()) || null
}