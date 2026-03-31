import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title, onSearch }) {
  const { cartCount, setCartOpen } = useCart();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    else navigate(`/marketplace?search=${query}`);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div className="topbar">
      <div>
        <h2 className="topbar-title">{title}</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }}>
          {greeting()}, {user?.name?.split(' ')[0]}
        </p>
      </div>
      <div className="topbar-actions">
        {user?.role === 'customer' && (
          <form className="search-bar" onSubmit={handleSearch}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search fresh products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
        )}
        {user?.role === 'customer' && (
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
