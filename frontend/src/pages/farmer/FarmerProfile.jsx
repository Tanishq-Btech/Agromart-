import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/farmer/profile')
      .then(r => setProfile(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="My Profile">
      <div className="loading-screen"><div className="spinner" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="My Profile">
      <div className="page-header">
        <div><h1>My Profile</h1><p>Your farmer account details</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><h3>👤 Personal Details</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{user?.email}</div>
              </div>
            </div>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone || 'Not provided' },
              { label: 'Role', value: 'Farmer' },
            ].map(item => (
              <div key={item.label} className="order-detail-row">
                <span className="detail-label">{item.label}</span>
                <span className="detail-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {profile ? (
          <>
            <div className="card">
              <div className="card-header">
                <h3>🌾 Farm Details</h3>
                <span className={`badge badge-${profile.verificationStatus}`}>{profile.verificationStatus}</span>
              </div>
              <div className="card-body">
                {[
                  { label: 'Farm Name', value: profile.farmName },
                  { label: 'Location', value: profile.farmLocation },
                  { label: 'Crop Types', value: profile.cropTypes },
                  { label: 'Farm Size', value: profile.farmSize },
                ].map(item => (
                  <div key={item.label} className="order-detail-row">
                    <span className="detail-label">{item.label}</span>
                    <span className="detail-value">{item.value}</span>
                  </div>
                ))}
                {profile.rejectionReason && (
                  <div className="alert alert-error" style={{ marginTop: '12px' }}>
                    Rejection: {profile.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>🏦 Bank Details</h3></div>
              <div className="card-body">
                {[
                  { label: 'Bank Name', value: profile.bankName },
                  { label: 'Account Number', value: '••••' + profile.accountNumber?.slice(-4) },
                  { label: 'IFSC Code', value: profile.ifscCode },
                ].map(item => (
                  <div key={item.label} className="order-detail-row">
                    <span className="detail-label">{item.label}</span>
                    <span className="detail-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>📄 Documents</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.govIdProof ? (
                  <a href={`/uploads/${profile.govIdProof}`} target="_blank" rel="noreferrer"
                    className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    🪪 View Government ID
                  </a>
                ) : <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>No Government ID uploaded</p>}
                {profile.landProof ? (
                  <a href={`/uploads/${profile.landProof}`} target="_blank" rel="noreferrer"
                    className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    📃 View Land Ownership Proof
                  </a>
                ) : <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>No Land Proof uploaded</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Farm Not Registered</h3>
                <p>Complete your farmer profile to start selling</p>
                <Link to="/farmer/register" className="btn btn-primary">Register Farm →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
