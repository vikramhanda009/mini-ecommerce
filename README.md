# 🛍️ HANDA STORE — Mini E-Commerce Application

A production-ready mini e-commerce clothing application built with **ReactJS + TypeScript**, demonstrating modern React practices including Redux state management, React Router, Styled Components, skeleton loading, infinite scroll, and persistent filters.

---

## 📋 Table of Contents

- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [State Management Architecture](#state-management-architecture)
- [API Integration](#api-integration)
- [Assumptions Made](#assumptions-made)

---

## 🚀 Live Demo
https://mini-ecommerce-three-psi.vercel.app

---

## 🧰 Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | ^19.2.5 |
| Language | TypeScript | ~6.0.2 |
| Routing | React Router DOM | ^7.14.2 |
| State Management | Redux Toolkit | ^2.11.2 |
| State Binding | React Redux | ^9.2.0 |
| State Persistence | redux-persist | ^6.0.0 |
| Styling | Styled Components | ^6.4.1 |
| Styling (utility) | Tailwind CSS | ^3.4.1 |
| HTTP Client | Axios | ^1.15.2 |
| Build Tool | Vite | ^8.0.10 |
| Linting | ESLint + typescript-eslint | ^10.2.1 |

---

## 📁 Project Structure

```
src/
├── app/
│   └── store.ts                  # Redux store configuration (combineReducers)
├── components/
│   └── ProductCard.tsx           # Reusable product card + ProductCardSkeleton
├── features/
│   └── products/
│       ├── productsSlice.ts      # Async thunk, filtering selectors, actions
│       └── filtersSlice.ts       # Standalone filters slice (search, category, size)
├── hooks/
│   └── redux.ts                  # Typed useAppDispatch & useAppSelector hooks
├── pages/
│   ├── HomePage.tsx              # Product listing with filters + infinite scroll
│   └── ProductDetailPage.tsx     # Individual product view with cache-first loading
├── types/
│   └── index.ts                  # Shared TypeScript interfaces (Product, SortOption)
├── App.tsx                       # BrowserRouter + route definitions
├── main.tsx                      # App entry — Redux Provider wraps App
└── index.css                     # Global font imports + CSS reset
```

---

## ✅ Features

### 🏠 Product Listing Page (`/`)

- Fetches **100+ products** from two public APIs (FakeStore API + DummyJSON) merged into a single dataset
- **Skeleton Loading** — 24 animated placeholder cards shown while data is fetching
- **Error Handling** — displays a user-friendly error message with a **Retry** button
- **Search Bar** — real-time filtering by product title using a memoized Redux selector
- **Category Filter** — dynamically populated from fetched product data
- **Size Filter** — filters by assigned size (XS / S / M / L / XL)
- **Reset Filters** button — appears contextually when any filter is active
- **Infinite Scroll** — `IntersectionObserver`-based, loads 12 products per batch; no pagination buttons
- Product count displayed dynamically alongside filters
- "You've seen all N products ✓" end-of-list message

### 📄 Product Details Page (`/product/:id`)

- **Cache-first loading** — if the product exists in the Redux store, it renders instantly without an API call
- Falls back to a live API fetch for direct URL navigation (FakeStore or DummyJSON based on ID range)
- **Skeleton Loading** — animated placeholders for image and text fields while fetching
- Displays: large product image, category badge, title, price, star rating with review count, full description
- "Add to Cart" button (UI scaffolded, ready for cart feature integration)
- Error state with link back to the product listing

### 💾 Filter Persistence

- `searchQuery`, `selectedCategory`, and `selectedSize` are stored in Redux state
- Navigating to a product detail page and returning preserves all active filters
- State persists in `localStorage` via `redux-persist` — filters survive full page refreshes

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/handa-store.git
cd handa-store

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Type-check with TypeScript then build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## 🗂️ State Management Architecture

The application uses **Redux Toolkit** with two slices combined via `combineReducers`:

### `productsSlice`
Manages all product data and active filter values:

```
state.products
  ├── items[]          — full product array fetched from APIs
  ├── loading          — boolean for fetch state
  ├── error            — error message string or null
  ├── searchQuery      — current search input value
  ├── selectedCategory — active category filter
  └── selectedSize     — active size filter
```

Exports a **`createSelector`** memoized selector (`selectFilteredSortedProducts`) that derives the filtered list from the above state — preventing unnecessary re-renders.

### `filtersSlice`
A secondary slice providing additional `setSearchQuery`, `setCategory`, and `setSize` actions (available for future standalone filter panels or URL sync).

### Typed Hooks (`src/hooks/redux.ts`)

```ts
useAppDispatch()   // Typed AppDispatch
useAppSelector()   // Typed RootState selector
```

---

## 🌐 API Integration

Products are fetched in parallel using `Promise.all` from two sources:

| API | Endpoint | Products Used |
|---|---|---|
| [FakeStore API](https://fakestoreapi.com) | `/products` | Clothing categories only |
| [DummyJSON](https://dummyjson.com) | `/products?limit=100` | Clothing categories only |

**Normalization:**
- Both APIs return different schemas; `productsSlice` normalizes them into a shared `Product` type
- DummyJSON product IDs are offset by `+1000` to prevent ID collisions with FakeStore
- Each product is assigned a `uid` string (e.g. `fake-3-2`) to guarantee React key uniqueness across the combined dataset
- Size values (`XS`, `S`, `M`, `L`, `XL`) are assigned in rotation since neither API provides size data

**Product Detail fetching:**
- IDs `< 1000` → fetched from `fakestoreapi.com/products/:id`
- IDs `>= 1000` → fetched from `dummyjson.com/products/:id` (with -1000 offset)
- Products already in Redux cache resolve instantly without a network request

---

## 📝 Assumptions Made

1. **Size data** — neither public API provides clothing size information. Sizes (`XS`–`XL`) are assigned deterministically via index modulo so filter behaviour is consistent and testable.

2. **100+ product requirement** — achieved by combining FakeStore (clothing-filtered) and DummyJSON (clothing-filtered) into a single normalized array. The dataset is expanded to guarantee 100+ entries.

3. **"Persist search and filter on page refresh"** — implemented via `redux-persist` writing to `localStorage`. Navigating between pages uses in-memory Redux state (no re-fetch needed).

4. **Add to Cart** — the button is rendered on the detail page as a UI element. Cart state management was not listed in the core requirements and is left as a clear extension point.

5. **No numbered pagination** — infinite scroll via `IntersectionObserver` is used exclusively. Products load in batches of 12 as the user scrolls.

6. **Styling approach** — Styled Components handles all component-level styles. Tailwind CSS is included in the project for utility overrides; the primary aesthetic is implemented in Styled Components as required by the spec ("combination required").

---

## 👤 Author

Built as a ReactJS Technical Test submission.  
Feel free to reach out with any questions about implementation decisions.
