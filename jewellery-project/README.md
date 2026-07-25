# Anaya Jewels

A jewellery e-commerce storefront built with React, React Router, and Tailwind CSS.

## Features
- Home, Shop (with category filter), Product detail, Cart, About, Contact
- Cart state via React Context — persists while the tab is open
- Fully responsive, keyboard-focus visible, respects reduced-motion
- No external image dependencies — product art is rendered in CSS/SVG so it never breaks

## Run locally
```
npm install
npm start
```

## Build
```
npm run build
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → Import the repo.
3. Framework preset: Create React App (auto-detected). No config needed —
   `vercel.json` already handles client-side routing.
4. Deploy.

## Notes
- Product data lives in `src/data/products.js` — edit that array to change the catalog.
- Checkout button is a stub (shows an alert). Wire it to a real payment
  provider (Razorpay, Stripe) before taking real orders.
