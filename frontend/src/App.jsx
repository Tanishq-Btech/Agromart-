import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Chatbot from './components/Chatbot';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import FarmerRegister from './pages/farmer/FarmerRegister';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import AddProduct from './pages/farmer/AddProduct';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerProfile from './pages/farmer/FarmerProfile';
import Marketplace from './pages/customer/Marketplace';
import ProductDetail from './pages/customer/ProductDetail';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerProfile from './pages/customer/CustomerProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminQueries from './pages/admin/AdminQueries';
import ContactAdmin from './pages/shared/ContactAdmin';

// Protected Route
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={!user ? <Landing /> : (
        user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
        user.role === 'farmer' ? <Navigate to="/farmer/dashboard" /> :
        <Navigate to="/marketplace" />
      )} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

      {/* Farmer */}
      <Route path="/farmer/register" element={<ProtectedRoute roles={['farmer']}><FarmerRegister /></ProtectedRoute>} />
      <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/products" element={<ProtectedRoute roles={['farmer']}><FarmerProducts /></ProtectedRoute>} />
      <Route path="/farmer/add-product" element={<ProtectedRoute roles={['farmer']}><AddProduct /></ProtectedRoute>} />
      <Route path="/farmer/orders" element={<ProtectedRoute roles={['farmer']}><FarmerOrders /></ProtectedRoute>} />
      <Route path="/farmer/profile" element={<ProtectedRoute roles={['farmer']}><FarmerProfile /></ProtectedRoute>} />
      <Route path="/farmer/help" element={<ProtectedRoute roles={['farmer']}><ContactAdmin /></ProtectedRoute>} />

      {/* Customer */}
      <Route path="/marketplace" element={<ProtectedRoute roles={['customer']}><Marketplace /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProtectedRoute roles={['customer']}><ProductDetail /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
      <Route path="/order-confirmation/:id" element={<ProtectedRoute roles={['customer']}><OrderConfirmation /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={['customer']}><CustomerOrders /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute roles={['customer']}><CustomerProfile /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute roles={['customer']}><ContactAdmin /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute roles={['admin']}><AdminFarmers /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/queries" element={<ProtectedRoute roles={['admin']}><AdminQueries /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
          <Chatbot />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}


