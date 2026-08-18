# 🥬 FreshCart - Vegetable Marketplace Frontend

A modern, responsive **React 19 single-page web application** built with **Vite** and **React Router DOM v7**. Connects customers directly with local vegetable farmers and vendors.

---

## 🎨 UI/UX Features & Highlights

- **Sticky Navigation Header**: Fixed top header with frosted glass backdrop blur that stays pinned while scrolling through produce catalogs.
- **Contextual Search & Cart**: Search bar and shopping bag dropdown automatically display only for authenticated users browsing market views.
- **Role-Based Authentication**: Custom Sign In & Register screens featuring segmented pill controls ("🛒 Customer" vs "🏪 Vendor") and compulsory shop name validation.
- **Interactive Freshness Filters**: Quick filter produce items by freshness condition ("All Produce", "Fresh Today", "1 Day Old", "Limited Stock").
- **Vendor Inventory Dashboard**: Complete stock management panel for vendors to log produce, view summary metrics, edit stock prices/quantities inline, and manage items.
- **Dedicated Farmer Storefronts**: Dedicated store pages showcasing seller profiles, location, contact details, and available stock.
- **Persistent Shopping Bag & Order Checkout**: Real-time cart calculations with persistent local storage sync and backend checkout processing.
- **Route Access Protection**: Authorization route wrapper (`ProtectedRoute.jsx`) safeguarding `/vendor` and `/admin` paths.

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Styling**: Modern Vanilla CSS Design Tokens (Plus Jakarta Sans & Inter Google Fonts)
- **Linter**: Oxlint

---

## 🛠️ Local Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/prathyushaj456-rgb/vegetable-marketplace-frontend.git
   cd vegetable-marketplace-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`. Ensure backend server is running at `http://localhost:5000`.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
vegetable-marketplace-frontend/
├── public/
│   └── images/              # Produce artwork assets
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx # Route access control wrapper
│   ├── pages/
│   │   ├── MarketPlace.jsx    # Main customer produce catalog
│   │   ├── VendorStore.jsx    # Dedicated vendor storefront view
│   │   ├── VendorDashboard.jsx# Vendor inventory control panel
│   │   ├── AdminDashboard.jsx # Executive admin management panel
│   │   ├── Login.jsx          # Role-based sign in page
│   │   └── Register.jsx       # User registration page
│   ├── App.jsx              # Navbar, shopping bag & router setup
│   ├── index.css            # Global design tokens & CSS system
│   └── main.jsx             # React entrypoint
├── index.html               # Main HTML template with Google Fonts
└── package.json             # Frontend dependencies & scripts
```
