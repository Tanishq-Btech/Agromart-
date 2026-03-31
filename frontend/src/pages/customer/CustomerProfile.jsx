import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfile() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="My Profile">
      <div className="page-header">
        <div><h1>My Profile</h1><p>Your account information</p></div>
      </div>
      <div style={{ maxWidth: '540px' }}>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ color: 'var(--gray-600)' }}>{user?.email}</div>
                <span className="badge badge-placed" style={{ marginTop: '6px' }}>Customer</span>
              </div>
            </div>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'Phone', value: user?.phone || 'Not provided' },
              { label: 'Member Since', value: 'AgroMart Member' },
            ].map(item => (
              <div key={item.label} className="order-detail-row">
                <span className="detail-label">{item.label}</span>
                <span className="detail-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
