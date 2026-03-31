import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(r => setAnalytics(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="Admin Dashboard">
      <div className="loading-screen"><div className="spinner" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Platform overview and management</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div className="stat-info">
            <div className="stat-value">{analytics?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon earth">👨‍🌾</div>
          <div className="stat-info">
            <div className="stat-value">{analytics?.totalFarmers || 0}</div>
            <div className="stat-label">Farmers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🛒</div>
          <div className="stat-info">
            <div className="stat-value">{analytics?.totalCustomers || 0}</div>
            <div className="stat-label">Customers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">🌿</div>
          <div className="stat-info">
            <div className="stat-value">{analytics?.totalProducts || 0}</div>
            <div className="stat-label">Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div className="stat-info">
            <div className="stat-value">{analytics?.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon earth">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {analytics?.pendingFarmers > 0 && (
        <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>⏳ <strong>{analytics.pendingFarmers}</strong> farmer registration(s) pending verification</span>
          <a href="/admin/farmers" className="btn btn-sm" style={{ background: 'var(--yellow)', color: 'white', border: 'none' }}>Review Now →</a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '8px' }}>
        <div className="card">
          <div className="card-header"><h3>Quick Actions</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/admin/farmers" className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '10px' }}>
              👨‍🌾 Manage Farmer Verifications
            </a>
            <a href="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '10px' }}>
              👥 View All Users
            </a>
            <a href="/admin/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '10px' }}>
              📦 Monitor All Orders
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Platform Stats</h3></div>
          <div className="card-body">
            {[
              { label: 'Total Users', value: analytics?.totalUsers || 0 },
              { label: 'Total Farmers', value: analytics?.totalFarmers || 0 },
              { label: 'Pending Verifications', value: analytics?.pendingFarmers || 0 },
              { label: 'Total Orders', value: analytics?.totalOrders || 0 },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-200)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--gray-600)' }}>{s.label}</span>
                <span style={{ fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
