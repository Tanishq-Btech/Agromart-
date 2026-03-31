import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
  const [stats, setStats] = useState({ products: 0, activeOrders: 0, totalEarnings: 0 });
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, o, p] = await Promise.all([
          api.get('/farmer/dashboard'),
          api.get('/orders'),
          api.get('/farmer/profile')
        ]);
        setStats(s.data);
        setOrders(o.data.slice(0, 5));
        setProfile(p.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <DashboardLayout title="Farmer Dashboard">
      <div className="loading-screen"><div className="spinner" /><p>Loading dashboard...</p></div>
    </DashboardLayout>
  );

  if (!profile) return (
    <DashboardLayout title="Farmer Dashboard">
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Complete Your Profile</h3>
        <p>Register your farm details to get started</p>
        <Link to="/farmer/register" className="btn btn-primary">Register Farm →</Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Farmer Dashboard">
      {profile.verificationStatus === 'pending' && (
        <div className="alert alert-warning">
          ⏳ Your farmer profile is under review. You'll be able to add products once approved.
        </div>
      )}
      {profile.verificationStatus === 'rejected' && (
        <div className="alert alert-error">
          ❌ Your verification was rejected. Reason: {profile.rejectionReason || 'Please contact support.'}
        </div>
      )}
      {profile.verificationStatus === 'approved' && (
        <div className="alert alert-success">
          ✅ Your farmer profile is verified! You can now add and sell products.
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Good day, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's what's happening on your farm today</p>
        </div>
        {profile.verificationStatus === 'approved' && (
          <Link to="/farmer/add-product" className="btn btn-primary">+ Add Product</Link>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">🌿</div>
          <div className="stat-info">
            <div className="stat-value">{stats.products}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon earth">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeOrders}</div>
            <div className="stat-label">Active Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{stats.totalEarnings.toLocaleString('en-IN')}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🏪</div>
          <div className="stat-info">
            <div className="stat-value" style={{ textTransform: 'capitalize', fontSize: '1rem' }}>{profile.verificationStatus}</div>
            <div className="stat-label">Verification Status</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Orders</h3>
          <Link to="/farmer/orders" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div className="table-wrapper">
          {orders.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📦</div><p>No orders yet</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.customer?.name || 'Customer'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--green-dark)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
