# 💎 Neela Jewellery — Full-Stack E-Commerce Platform

Neela Jewellery is a fine jewellery retailer that previously had no online presence. Customers couldn't browse collections, check prices, or place orders without visiting the store in person. This website gives Neela a professional digital storefront — customers can browse by category, create accounts, track orders, and pay securely online, turning walk-ins into 24/7 online sales.

**Live Demo:** [Neela Jewellery](https://neela-jewellery-plum.vercel.app//)

---

## 🌟 Key Features

### 🛍️ Customer Experience
- Product catalog with category filters (Rings, Necklaces, Earrings, Bracelets, Bangles, Pendants)
- Live keyword search, price range filter, and sorting (Price, Rating, Newest)
- Product detail pages with multi-image gallery, stock count, gold weight specs, and reviews
- Persistent wishlist and cart with server-calculated totals (subtotal, 3% GST, shipping)
- Order tracking across 6 milestones: PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT FOR DELIVERY → DELIVERED
- Automated PDF tax invoice download per order

### 💳 Payment Gateways
1. **Razorpay (TEST MODE)** — Server-side order creation with HMAC-SHA256 signature verification
2. **Manual UPI** — Dynamic QR code + UTR reference submission for admin review
3. **Cash on Delivery** — Instant order confirmation

### 🛡️ Admin Portal (`/admin`)
- Executive dashboard: revenue analytics, order counts, customer stats, low-stock alerts
- Product management: add, edit, adjust stock/price, delete
- Order fulfillment queue: update milestones, download invoices
- Payment verification queue: approve or reject UPI/UTR submissions

---

## 🛠️ Tech Stack

| Layer      | Technologies                                                      |
|------------|-------------------------------------------------------------------|
| Frontend   | React 18, React Router v6, Tailwind CSS, Lucide Icons, Axios     |
| Backend    | Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, PDFKit         |
| Database   | PostgreSQL (10 tables with indexes and constraints)               |
| Payments   | Razorpay SDK (TEST MODE), Manual UPI QR, Cash on Delivery        |
| Deployment | Vercel (frontend), Render (backend via render.yaml)              |

---

## 🔒 Security

- JWT authentication with 7-day expiration and role-based middleware
- Passwords hashed with bcrypt (10 rounds)
- Server-side price calculation — client cannot tamper with order totals
- Cryptographic Razorpay signature verification before marking orders as PAID

---

## ⚡ Demo Credentials

| Role     | Email                      | Password      |
|----------|----------------------------|---------------|
| Customer | priya@example.com          | customer123   |
| Admin    | admin@neelajewellery.com   | admin123      |

1-click Fill buttons are available directly on the `/login` page.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Razorpay TEST account

### 1. Clone the repo

```bash
git clone https://github.com/nishandhineePalanivel/JEWELLARY-PROJECT.git
cd JEWELLARY-PROJECT
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```bash
npm start
```

### 3. Frontend setup

```bash
cd ..
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## 📁 Project Structure

JEWELLARY-PROJECT/
├── backend/
│ ├── routes/ # Auth, products, orders, payments, admin
│ ├── middleware/ # JWT auth middleware
│ ├── db.js # PostgreSQL connection
│ └── server.js # Express entry point
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Home, Product, Cart, Admin, etc.
│ ├── context/ # Auth and Cart context
│ └── App.jsx
├── render.yaml # Render deployment config
├── vercel.json # Vercel SPA routing
└── package.json


---

## 📊 Business Impact

| Problem (Before) | Solution (After) |
|---|---|
| No online presence | Professional website live 24/7 |
| Customers call to ask prices | Full catalog with filters and search |
| Orders only in-store | Online ordering with 3 payment options |
| No order visibility | Real-time 6-stage order tracking |
| Manual billing | Automated PDF tax invoices |

---

## 🔗 Links

- 💻 GitHub: https://github.com/nishandhineePalanivel
- 💼 LinkedIn: https://www.linkedin.com/in/nishandhinee-palanivel/
- 📧 Email: nishandhineepalanivel13@gmail.com
