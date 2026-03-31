import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return setError('Your cart is empty');
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, quantity: i.cartQty })),
        deliveryAddress: form,
        paymentMethod
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-confirmation/${data._id}`, { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/marketplace');
    return null;
  }

  return (
    <DashboardLayout title="Checkout">
      <div className="page-header">
        <div><h1>Checkout</h1><p>Complete your order</p></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header"><h3>📍 Delivery Address</h3></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-control" placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-control" placeholder="House No., Street, Area" value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-control" value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-control" value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input className="form-control" placeholder="6-digit PIN" value={form.pincode} maxLength={6}
                  onChange={e => setForm({ ...form, pincode: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '16px' }}>
            <div className="card-header"><h3>💳 Payment Method</h3></div>
            <div className="card-body">
              {['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Net Banking'].map(method => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: paymentMethod === method ? '2px solid var(--green-mid)' : '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', background: paymentMethod === method ? 'var(--green-pale)' : 'white', cursor: 'pointer', marginBottom: '8px' }}>
                  <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{method === 'Cash on Delivery' ? '💵' : method === 'UPI' ? '📱' : method === 'Credit/Debit Card' ? '💳' : '🏦'} {method}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>{method === 'Cash on Delivery' ? 'Pay when your order arrives' : 'Pay seamlessly online'}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '16px' }} disabled={loading}>
            {loading ? '⏳ Placing Order...' : '✅ Place Order'}
          </button>
        </form>

        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div className="card-header"><h3>🛒 Order Summary</h3></div>
          <div className="card-body">
            {cart.map(item => (
              <div key={item._id} className="order-item-row">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="order-item-img" />
                ) : (
                  <div className="order-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green-pale)', fontSize: '1.3rem', flexShrink: 0 }}>🌿</div>
                )}
                <div className="order-item-details">
                  <div className="order-item-name">{item.name}</div>
                  <div className="order-item-qty">Qty: {item.cartQty} {item.unit}</div>
                </div>
                <div className="order-item-price">₹{(item.price * item.cartQty).toFixed(2)}</div>
              </div>
            ))}

            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
              <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
              <span>Delivery</span><span style={{ color: 'var(--green-mid)' }}>FREE</span>
            </div>
            <div className="divider" />
            <div className="confirmation-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', textAlign: 'center', marginTop: '8px' }}>
              🚚 Estimated delivery: 3-5 business days
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
