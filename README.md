# 🛍️ Shopify Custom Bundle Store — Assignment 2

A **Shopify-style custom bundle e-commerce store** built with the **MEAN stack** (MongoDB, Express, Angular 17, Node.js). Customers can browse products, build custom bundles of 2–8 items with automatic discounts, add to cart, and complete checkout.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Product Catalog** | 18 seeded products across 7 categories, search & filter |
| **Bundle Builder** | Pick 2–8 products, name the bundle, set discount type & value |
| **Live Pricing Preview** | Real-time discount calculation before saving |
| **Shopping Cart** | Add individual products OR bundles, update quantities |
| **Bundle Discounts** | Percentage-based or fixed-amount discounts |
| **Checkout Flow** | Shipping form → order summary → order confirmation |
| **Order History** | View all past orders per browser session |
| **Session-based Cart** | No login required (UUID session in localStorage) |
| **Free Shipping Logic** | Free shipping on orders ≥ $50 |

---

## 🏗 Tech Stack

- **M** – MongoDB (Mongoose 8)
- **E** – Express.js 4.18  
- **A** – Angular 17 (Standalone, Signals, `@if`/`@for`, lazy-loaded routes)
- **N** – Node.js (ESM)

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env          # fill in MONGODB_URI
npm install
npm run seed                   # seed 18 demo products
npm run dev                    # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm start                      # starts on http://localhost:4201
```

> The Angular dev server proxies `/api/*` to `http://localhost:3001` via `proxy.conf.json`.

---

## 🛒 How Bundle Building Works

1. Go to **Bundle Builder**
2. Click products on the left panel to add them (2–8 max)
3. Set **Bundle Name**, **Discount Type** (%), and **Discount Value**
4. Live pricing preview shows original vs. discounted price
5. Click **Save Bundle** → then **Add Bundle to Cart**
6. The entire bundle is stored as one cart item with the discount applied

---

## 🔑 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (filter by category/search) |
| GET | `/api/products/categories` | Unique categories |
| POST | `/api/bundles` | Create a bundle |
| POST | `/api/bundles/preview` | Preview bundle pricing |
| GET | `/api/bundles` | Get bundles (by sessionId) |
| GET | `/api/cart/:sessionId` | Get cart |
| POST | `/api/cart/:sessionId/product` | Add product to cart |
| POST | `/api/cart/:sessionId/bundle` | Add bundle to cart |
| DELETE | `/api/cart/:sessionId/item/:id` | Remove item |
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders/session/:id` | Order history |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/          # Product, Bundle, Cart, Order
│   ├── controllers/     # productController, bundleController, cartController, orderController
│   ├── routes/
│   └── seed/products.js # 18 demo products
frontend/
└── src/app/
    ├── components/
    │   ├── header/          # navbar with cart badge
    │   ├── home/            # hero + featured products
    │   ├── products/        # catalog with search/filter
    │   ├── bundle-builder/  # 🎯 core feature
    │   ├── cart/            # cart with totals
    │   ├── checkout/        # shipping + order placement
    │   └── orders/          # order history
    ├── services/        # ProductService, BundleService, CartService, OrderService
    └── models/          # TypeScript interfaces
```

---

## 🌐 Deploy

### Backend → Vercel
Add `vercel.json` (same pattern as Assignment 1) and deploy.

### Frontend → Vercel/Netlify
```bash
npm run build   # outputs dist/shopify-bundle-store/
```
Upload the `dist` folder or connect repo to Vercel.
