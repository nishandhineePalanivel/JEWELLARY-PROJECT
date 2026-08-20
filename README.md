# 💎 Neela Jewellery — Full-Stack E-Commerce Platform

A production-grade jewellery e-commerce application built to real-world standards — covering customer shopping experience, secure multi-gateway payments, automated billing, and an executive admin portal.

**Live Demo:** [Neela Jewellery](https://jewellary-project-7g3z-git-main-nishandhinee.vercel.app/)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, PDFKit |
| **Database** | PostgreSQL — 10 tables with relational schema, indexes, and constraints |
| **Payments** | Razorpay SDK (TEST MODE), Manual UPI QR, Cash on Delivery |
| **Deployment** | Vercel (frontend) · Render via `render.yaml` IaC (backend) |

---

## 🌟 Features

### 🛍️ Customer Experience
- Product catalog with category filters (Rings, Necklaces, Earrings, Bracelets, Bangles, Pendants), live keyword search, price range filter, and sorting
- Product detail page: multi-image gallery, SKU, stock count, net gold weight, material specs, quantity controls, wishlist toggle, Quick Add & Buy Now
- Persistent cart with server-calculated subtotal, 3% GST, insured shipping, and grand total
- Persistent wishlist with one-click Move to Cart

### 💳 Payment Gateways
1. **Razorpay (TEST MODE)** — Server-side order creation + HMAC-SHA256 cryptographic signature verification before marking orders as `PAID`
2. **Manual UPI / Bank Transfer** — Dynamic QR code generator; customer submits UTR reference; order placed under `PAYMENT_PENDING_VERIFICATION` for admin review
3. **Cash on Delivery** — Order confirmed directly with `PENDING` payment status

### 📜 Order Tracking & Billing
- Live 6-stage fulfillment pipeline: `PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT FOR DELIVERY → DELIVERED`
- Automated PDF tax invoice with company branding, invoice number, itemized breakdown, GST, and payment details

### 🛡️ Executive Admin Portal (`/admin`)
- Dashboard: real-time revenue analytics, total orders, registered customers, low-stock alerts, recent orders
- Product management: add, edit, adjust stock and pricing, delete
- Order fulfillment queue: update milestones, download invoices
- Payment verification queue: review customer UTR/UPI references, approve or reject with one click

### 🔒 Security
- JWT authentication with 7-day expiration and role-based middleware (`authenticateToken`, `requireAdmin`)
- bcrypt password hashing (10 rounds)
- Server-side order total calculation — client cannot tamper with prices
- Cryptographic Razorpay payment signature verification

---

## ⚡ Demo Credentials

| Role | Email | Password |
|:---|:---|:---|
| **Customer** | `priya@example.com` | `customer123` |
| **Admin** | `admin@neelajewellery.com` | `admin123` |

One-click **Fill Customer** / **Fill Admin** buttons available on the `/login` screen.

---

## 📁 Project Structure

JEWELLARY-PROJECT/
├── backend/ # Node.js + Express REST API
├── src/ # React 18 frontend
├── public/
├── render.yaml # Render IaC deployment config
├── vercel.json # Vercel routing config
└── package.json


## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/nishandhineePalanivel/JEWELLARY-PROJECT.git
cd JEWELLARY-PROJECT

# Frontend
npm install
npm run dev

# Backend (separate terminal)
cd backend
npm install
node index.js
```

Set your environment variables for PostgreSQL connection string and Razorpay keys before running the backend.

---

## 💡 What I Built & Learned

This project started as a React frontend internship deliverable. I extended it into a full-stack system to understand how real e-commerce platforms work end-to-end — JWT auth flows, role-based access, server-side price validation, cryptographic payment verification, and automated PDF invoice generation. Deploying both layers independently (Vercel + Render via IaC) gave me hands-on experience with production-grade split deployment.

---

*Built by [Nishandhinee P](https://linkedin.com/in/nishandhinee-palanivel) — ECE Undergraduate, Coimbatore*
