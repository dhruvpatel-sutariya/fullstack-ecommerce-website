# QuickMart / Fullstack E-commerce — Progress

## Phase 1 — Wishlist + Bacola-like catalog UX
- [x] Implement wishlist state + persistence (`src/context/WishlistContext.js`)
- [x] Add Wishlist page + route (`/wishlist`)
- [x] Wire ProductCard heart button to toggle wishlist
- [x] Add Wishlist link + count badge to Header (nav + actions)
- [x] Replace Home hardcoded banner with reusable Banner component

## Phase 2 — Components
- [x] Banner component (`src/components/Banner/`) — reusable hero slider
- [x] Sidebar component (`src/components/Sidebar/`) — reusable category filter panel

## Phase 3 — Order tracking UX
- [x] Update Orders + OrderDetail to show `statusMessage`
- [x] Add CSS for order status message

## Phase 4 — Admin product management UI
- [x] Admin Products page — create, edit, delete products
- [x] Admin Orders page — filter, search, update status
- [x] Admin Dashboard — summary stats + approve/cancel orders

## Phase 5 — Polish & Fixes
- [x] Clean up App.css — global resets, btn utilities, status-pill classes
- [x] Remove dead address form from Cart page (Checkout handles it)
- [x] Add isAdmin badge to Profile sidebar
- [x] Cart page simplified — single "Proceed to Checkout" flow

## To Run
1. `cd backend && npm run seed` — seed DB with admin + products
2. `cd backend && npm run dev` — start API on port 5000
3. `npm start` — start React on port 3000
4. Login: admin@quickmart.test / admin123
