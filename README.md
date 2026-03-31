# 🌾 AgroMart – Farm to Table Marketplace

A full-stack MERN application connecting verified farmers directly with customers.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

---

## 📦 Installation

### 1. Clone / Extract the project

### 2. Setup Backend
```bash
cd backend
npm install
```

Create/edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/agromart
JWT_SECRET=agromart_secret_key_2024
PORT=5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Seed the Database (creates admin, farmer, customer + 12 products)
```bash
cd backend
node seed.js
```

---

## ▶️ Running the App

Open **two terminals**:

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Demo Login Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@agromart.com       | admin123    |
| Farmer   | ramesh@farm.com          | farmer123   |
| Customer | priya@example.com        | customer123 |

---

## 🏗️ Project Structure

```
agromart/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── FarmerProfile.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── farmer.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          ← document uploads stored here
│   ├── seed.js
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── components/
        │   ├── DashboardLayout.jsx
        │   ├── Sidebar.jsx
        │   ├── Topbar.jsx
        │   └── CartDrawer.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── Landing.jsx
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Signup.jsx
        │   ├── farmer/
        │   │   ├── FarmerRegister.jsx  ← 3-step verification
        │   │   ├── FarmerDashboard.jsx
        │   │   ├── FarmerProducts.jsx
        │   │   ├── AddProduct.jsx
        │   │   ├── FarmerOrders.jsx
        │   │   └── FarmerProfile.jsx
        │   ├── customer/
        │   │   ├── Marketplace.jsx
        │   │   ├── ProductDetail.jsx
        │   │   ├── Checkout.jsx
        │   │   ├── OrderConfirmation.jsx ← success page
        │   │   ├── CustomerOrders.jsx
        │   │   └── CustomerProfile.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminFarmers.jsx   ← approve/reject
        │       ├── AdminUsers.jsx
        │       └── AdminOrders.jsx
        ├── utils/
        │   └── api.js
        ├── App.jsx
        └── index.css
```

---

## ✅ Features

### 🌾 Farmer
- 3-step registration: Farm Details → Document Upload → Bank Details
- Verification status: Pending → Approved → Rejected
- Dashboard: Products, Active Orders, Total Earnings
- Add / Edit / Delete products with image URLs
- Order management: Accept, Ship, Deliver

### 🛒 Customer
- Browse marketplace with category filters & search
- Product detail page with farmer info
- Cart with quantity controls
- Checkout with delivery address
- **Order confirmation page** with order ID, items, amount, address
- View order history with status tracking

### 🔧 Admin
- Approve/Reject farmer registrations with reason
- View all users
- Monitor all orders across the platform
- Analytics dashboard

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite         |
| Routing   | React Router v6         |
| HTTP      | Axios                   |
| Backend   | Node.js + Express.js    |
| Database  | MongoDB + Mongoose      |
| Auth      | JWT + bcryptjs          |
| Uploads   | Multer                  |
| Styling   | Custom CSS (no Tailwind)|

---

## 🔑 API Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login

POST   /api/farmer/register       (multipart/form-data with documents)
GET    /api/farmer/profile
GET    /api/farmer/dashboard

GET    /api/products               (public, filterable)
GET    /api/products/my            (farmer only)
GET    /api/products/:id           (public)
POST   /api/products               (approved farmers only)
PUT    /api/products/:id
DELETE /api/products/:id

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status

GET    /api/admin/farmers
PUT    /api/admin/verify-farmer
GET    /api/admin/users
GET    /api/admin/analytics
GET    /api/admin/orders
```

---

## 💡 Notes

- Cart is stored in `localStorage` (no server-side cart needed)
- Product images use Unsplash URLs by default; custom URLs supported
- Uploaded documents stored in `backend/uploads/`
- Prices displayed in Indian Rupees (₹) throughout
