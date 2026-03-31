import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const farmerLinks = [
  { to: '/farmer/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/farmer/products', icon: '🌿', label: 'My Products' },
  { to: '/farmer/add-product', icon: '➕', label: 'Add Product' },
  { to: '/farmer/orders', icon: '📦', label: 'Orders' },
  { to: '/farmer/profile', icon: '👤', label: 'Profile' },
  { to: '/farmer/help', icon: '💬', label: 'Help & Support' },
];

const customerLinks = [
  { to: '/marketplace', icon: '🛒', label: 'Marketplace' },
  { to: '/orders', icon: '📦', label: 'My Orders' },
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/help', icon: '💬', label: 'Help & Support' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/farmers', icon: '👨‍🌾', label: 'Farmers' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/orders', icon: '📦', label: 'Orders' },
  { to: '/admin/queries', icon: '💬', label: 'User Queries' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'farmer' ? farmerLinks
    : user?.role === 'admin' ? adminLinks
    : customerLinks;

  const roleLabel = user?.role === 'farmer' ? '🌾 Farmer Panel'
    : user?.role === 'admin' ? '🛡️ Admin Panel'
    : '🛒 Customer';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Agro<span>Mart</span></h2>
        <p>{roleLabel}</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
      </div>
    </aside>
  );
}
