import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const STAGES = ['placed', 'accepted', 'shipped', 'delivered'];

const OrderTracker = ({ status }) => {
  if (status === 'cancelled') {
    return <div style={{ color: 'var(--red)', fontWeight: 600, padding: '16px 0', textAlign: 'center' }}>🚫 Order Cancelled</div>;
  }
  const currentIndex = STAGES.indexOf(status);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10% 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '24px', left: '15%', right: '15%', height: '3px', background: 'var(--gray-200)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '24px', left: '15%', width: `${(Math.max(0, currentIndex) / 3) * 70}%`, height: '3px', background: 'var(--green-mid)', zIndex: 0, transition: 'width 0.4s' }} />
      
      {STAGES.map((stage, idx) => {
        const isCompleted = idx <= currentIndex;
        const isActive = idx === currentIndex;
        return (
          <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCompleted ? 'var(--green-mid)' : 'white', border: `3px solid ${isCompleted ? 'var(--green-mid)' : 'var(--gray-200)'}`, color: isCompleted ? 'white' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              {isCompleted ? '✓' : ''}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--green-dark)' : 'var(--gray-600)', textTransform: 'capitalize' }}>
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      api.get(`/orders/${id}`)
        .then(r => setOrder(r.data))
        .catch(() => navigate('/marketplace'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!order) return null;

  const addr = order.deliveryAddress;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-banner">
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll deliver it fresh to your door.</p>
        </div>

        <div style={{ background: 'var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--green-dark)' }}>Order ID</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--green-dark)' }}>
            #{order._id.slice(-10).toUpperCase()}
          </span>
        </div>

        <OrderTracker status={order.status} />

        <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--green-dark)', marginBottom: '12px' }}>📦 Ordered Items</h4>
        <div className="order-items-list">
          {order.items.map((item, i) => (
            <div key={i} className="order-item-row">
              {item.image ? (
                <img src={item.image} alt={item.name} className="order-item-img" />
              ) : (
                <div className="order-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green-pale)', fontSize: '1.3rem', flexShrink: 0, borderRadius: '8px' }}>🌿</div>
              )}
              <div className="order-item-details">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-qty">Quantity: {item.quantity}</div>
              </div>
              <div className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="confirmation-total">
          <span>Total Amount</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="divider" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '4px' }}>📍 DELIVERY ADDRESS</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{addr?.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{addr?.street}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{addr?.city}, {addr?.state} - {addr?.pincode}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>📞 {addr?.phone}</div>
          </div>
          <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '4px' }}>🚚 DELIVERY INFO</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{order.estimatedDelivery}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: '4px' }}>Payment: {order.paymentMethod}</div>
            <div style={{ marginTop: '8px' }}><span className={`badge badge-${order.status}`}>{order.status}</span></div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/marketplace" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
            🛒 Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            📦 View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
