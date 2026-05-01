# DRIP SHOP – Mini E-Commerce App

A ReactJS + TypeScript mini e-commerce application.

## Tech Stack
- React 19 + TypeScript, React Router v7
- Redux Toolkit + redux-persist (filter/search persisted on refresh)
- Styled Components + Tailwind CSS
- Vite build tool
- Data: FakeStore API + DummyJSON API (100+ products)

## Setup
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
```

## Features
- 100+ products from two APIs
- Skeleton loading on first fetch
- Error handling with retry
- Search by title (persisted)
- Category + Size filter dropdowns (persisted)
- Infinite scroll (no pagination)
- Product detail page with cache-first loading
# mini-ecommerce
