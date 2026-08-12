# 💎 Neela Jewellery — Realistic Full-Stack E-Commerce Platform

**Neela Jewellery** is an interview-ready, full-stack luxury jewellery e-commerce application built with **React.js**, **Node.js/Express**, **PostgreSQL**, **JWT Authentication**, and integrated payment gateways (**Razorpay TEST Mode**, **Manual UPI Verification**, and **Cash on Delivery**).

Designed to reflect real-world e-commerce standards, the system enforces server-side order calculation, cryptographic payment verification, automated PDF tax invoice generation, and a comprehensive Executive Admin Portal.

Url of neela jewelley https://neela-website-jewellary-project-git-main-nishandhinee.vercel.app/shop

## 🌟 Key Features

### 🛍️ Customer Shopping Experience
- **Luxury Aesthetic**: Modern dark/gold theme (`ink`, `ivory`, `gold`), smooth micro-animations, skeleton loaders, and toast alerts.
- **Product Catalog**: Filter by categories (*Rings, Necklaces, Earrings, Bracelets, Bangles, Pendants*), live keyword search, price range filter, and sorting (Price Low/High, Rating, Newest).
- **Product Detail**: Multi-image thumbnail gallery, SKU, stock count, net gold weight (grams), material specs, quantity controls, Wishlist heart toggle, Quick Add & Buy Now actions, and customer review submission.
- **Persistent Wishlist**: Saved items grid with 1-click *"Move to Cart"* action.
- **Persistent Cart & Cost Breakdown**: Server-calculated subtotal, discount savings, **3% GST** (Indian gold jewellery tax), insured shipping calculation, and grand total.

---

### 💳 Payment Gateways & Security
1. **Razorpay TEST MODE**:
   - Server-side order creation via Razorpay SDK.
   - Cryptographic HMAC-SHA256 signature verification before marking orders as `PAID`.
2. **Manual UPI / Bank Transfer**:
   - Dynamic QR Code generator & UPI ID (`neela.jewellery@upi`).
   - Customer submits UTR/UPI transaction reference number.
   - Order is placed under `PAYMENT_PENDING_VERIFICATION` status for Admin review.
3. **Cash on Delivery (COD)**:
   - Sets payment status to `PENDING` and order status to `CONFIRMED`.

---

### 📜 Order Tracking & Billing
- **Live Fulfillment Progress**: Track order progress across 6 milestones (*PENDING ➔ CONFIRMED ➔ PROCESSING ➔ SHIPPED ➔ OUT FOR DELIVERY ➔ DELIVERED*).
- **PDF Tax Invoice Download**: Automated PDF invoice generation containing company branding, invoice number, customer address, itemized breakdown, tax breakdown, and payment details.

---

### 🛡️ Executive Admin Portal (`/admin`)
- **Executive Dashboard**: Real-time revenue analytics, total orders, registered customer counts, low-stock alert warnings, and recent orders.
- **Product Management (`/admin/products`)**: Add new jewellery pieces, edit details, inline stock count adjuster, price/discount adjuster, and deletion.
- **Order Fulfillment Queue (`/admin/orders`)**: View orders, update fulfillment milestones, and download invoices.
- **Payment Verification Queue (`/admin/payments`)**: Review customer-submitted UTR / UPI reference numbers with 1-click **Approve Payment** or **Reject Payment**.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, PDFKit |
| **Database** | PostgreSQL (Relational schema with 10 tables, indexes, constraints) |
| **Payment** | Razorpay SDK (TEST MODE), Manual UPI QR, Cash on Delivery |
| **Deployment**| Render (Blueprint Infrastructure as Code via `render.yaml`) |

---

## 🔒 Security Architecture
- **JWT Authentication**: Token-based security with 7-day expiration and role-based middleware (`authenticateToken`, `requireAdmin`).
- **Password Protection**: Passwords hashed using `bcrypt` (10 rounds).
- **Server Price Validation**: All order totals are calculated strictly on the backend to prevent client-side price tampering.
- **Cryptographic Signature Verification**: Razorpay payment responses are verified server-side using secret keys.

---

## ⚡ Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `priya@example.com` | `customer123` |
| **Admin** | `admin@neelajewellery.com` | `admin123` |

*(Convenient 1-click **Fill Customer** and **Fill Admin** buttons are provided directly on the `/login` screen).*
