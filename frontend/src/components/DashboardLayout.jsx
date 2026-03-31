import React from 'react';
import Sidebar from './Sidebar';
import CartDrawer from './CartDrawer';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title, onSearch }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} onSearch={onSearch} />
        <div className="page-content">
          {children}
        </div>
      </div>
      <CartDrawer />
    </div>
  );
}
