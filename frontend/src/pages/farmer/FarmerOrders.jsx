import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  return (
    <DashboardLayout title="Orders">
      <div className="page-header">
        <div><h1>Incoming Orders</h1><p>Manage and track customer orders</p></div>
      </div>

      <div className="tabs">
        {['all', 'placed', 'accepted', 'shipped', 'delivered', 'cancelled'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t !== 'all' && <span style={{ marginLeft: '4px', fontSize: '0.7rem', background: 'var(--gray-200)', padding: '1px 6px', borderRadius: '10px' }}>
              {orders.filter(o => o.status === t).length}
            </span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><h3>No Orders</h3><p>No orders in this category</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(order => (
            <div key={order._id} className="card">
              <div className="card-header">
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '2px' }}>
                    {order.customer?.name} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                  <span style={{ fontWeight: 700, color: 'var(--green-dark)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '16px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--gray-200)' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌿</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--green-dark)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {order.status === 'placed' && (
                    <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order._id, 'accepted')}>✅ Accept Order</button>
                  )}
                  {order.status === 'accepted' && (
                    <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order._id, 'shipped')}>🚚 Mark as Shipped</button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order._id, 'delivered')}>✅ Mark as Delivered</button>
                  )}
                  {['placed', 'accepted'].includes(order.status) && (
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(order._id, 'cancelled')}>❌ Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
