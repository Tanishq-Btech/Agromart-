import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty, cartTotal, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>🛒 Your Cart ({cart.length})</h3>
          <button className="modal-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>Cart is Empty</h3>
              <p>Add products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                ) : (
                  <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🌿</div>
                )}
                <div className="cart-item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">₹{(item.price * item.cartQty).toFixed(2)}</div>
                  <div className="quantity-ctrl">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.cartQty - 1)}>−</button>
                    <span className="qty-value">{item.cartQty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.cartQty + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="total-label">Total Amount</span>
              <span className="total-value">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
