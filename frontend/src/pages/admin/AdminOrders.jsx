import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/admin/orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <DashboardLayout title="Order Management">
      <div className="page-header">
        <div>
          <h1>All Orders</h1>
          <p>{orders.length} total orders · ₹{totalRevenue.toLocaleString('en-IN')} delivered revenue</p>
        </div>
      </div>

      <div className="tabs">
        {['all', 'placed', 'accepted', 'shipped', 'delivered', 'cancelled'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>{order.customer?.email}</div>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>{order.items.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--green-dark)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state"><div className="empty-icon">📦</div><p>No orders in this category</p></div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
