import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const STAGES = ['placed', 'accepted', 'shipped', 'delivered'];

const OrderTracker = ({ status }) => {
  if (status === 'cancelled') {
    return <div style={{ color: 'var(--red)', fontWeight: 600, padding: '16px 0', textAlign: 'center' }}>🚫 Order Cancelled</div>;
  }
  const currentIndex = STAGES.indexOf(status);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 10%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '34px', left: '15%', right: '15%', height: '3px', background: 'var(--gray-200)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '34px', left: '15%', width: `${(Math.max(0, currentIndex) / 3) * 70}%`, height: '3px', background: 'var(--green-mid)', zIndex: 0, transition: 'width 0.4s' }} />
      
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

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Orders">
      <div className="page-header">
        <div><h1>My Orders</h1><p>Track all your orders</p></div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>Start shopping from our marketplace</p>
          <Link to="/marketplace" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="card-header">
                <div>
                  <div style={{ fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                  <span style={{ fontWeight: 700, color: 'var(--green-dark)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <OrderTracker status={order.status} />
              <div className="divider" style={{ margin: '0' }} />

              <div className="card-body">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gray-100)', padding: '6px 10px', borderRadius: '6px' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                      ) : <span>🌿</span>}
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>× {item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                  <span>🚚 {order.estimatedDelivery}</span>
                  <span>·</span>
                  <span>💵 {order.paymentMethod}</span>
                  <span>·</span>
                  <span>📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.state}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
