import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [rejReason, setRejReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchFarmers = async () => {
    try {
      const { data } = await api.get('/admin/farmers');
      setFarmers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFarmers(); }, []);

  const handleVerify = async (farmerId, status) => {
    setProcessing(true);
    try {
      await api.put('/admin/verify-farmer', { farmerId, status, rejectionReason: rejReason });
      setMsg(`Farmer ${status} successfully`);
      setSelected(null);
      setRejReason('');
      fetchFarmers();
    } catch (err) { console.error(err); }
    finally { setProcessing(false); }
  };

  const filtered = farmers.filter(f => f.verificationStatus === tab);

  return (
    <DashboardLayout title="Farmer Management">
      <div className="page-header">
        <div><h1>Farmer Verifications</h1><p>Review and approve farmer registrations</p></div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="tabs">
        {['pending', 'approved', 'rejected'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span style={{ marginLeft: '6px', background: 'var(--gray-200)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>
              {farmers.filter(f => f.verificationStatus === t).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍🌾</div>
          <h3>No {tab} registrations</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(farmer => (
            <div key={farmer._id} className="card">
              <div className="card-header">
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>
                    {farmer.user?.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    {farmer.user?.email} · {farmer.user?.phone}
                  </div>
                </div>
                <span className={`badge badge-${farmer.verificationStatus}`}>{farmer.verificationStatus}</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  {[
                    { icon: '🏡', label: 'Farm Name', value: farmer.farmName },
                    { icon: '📍', label: 'Location', value: farmer.farmLocation },
                    { icon: '🌾', label: 'Crops', value: farmer.cropTypes },
                    { icon: '📏', label: 'Farm Size', value: farmer.farmSize },
                    { icon: '🏦', label: 'Bank', value: farmer.bankName },
                    { icon: '🔑', label: 'IFSC', value: farmer.ifscCode },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-600)', marginBottom: '2px' }}>{item.icon} {item.label}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  {farmer.govIdProof && (
                    <a href={`/uploads/${farmer.govIdProof}`} target="_blank" rel="noreferrer"
                      className="btn btn-outline btn-sm">
                      📄 View Gov ID
                    </a>
                  )}
                  {farmer.landProof && (
                    <a href={`/uploads/${farmer.landProof}`} target="_blank" rel="noreferrer"
                      className="btn btn-outline btn-sm">
                      📃 View Land Proof
                    </a>
                  )}
                  {!farmer.govIdProof && !farmer.landProof && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>⚠️ No documents uploaded</span>
                  )}
                </div>

                {farmer.verificationStatus === 'pending' && (
                  <div>
                    {selected === farmer._id ? (
                      <div style={{ background: 'var(--red-light)', border: '1px solid #e57373', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '10px' }}>
                        <label className="form-label">Rejection Reason</label>
                        <textarea className="form-control" rows={2} placeholder="Provide reason for rejection..."
                          value={rejReason} onChange={e => setRejReason(e.target.value)} />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button className="btn btn-danger btn-sm" disabled={processing}
                            onClick={() => handleVerify(farmer._id, 'rejected')}>
                            ❌ Confirm Reject
                          </button>
                          <button className="btn btn-outline btn-sm" onClick={() => { setSelected(null); setRejReason(''); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-primary btn-sm" disabled={processing}
                          onClick={() => handleVerify(farmer._id, 'approved')}>
                          ✅ Approve Farmer
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setSelected(farmer._id)}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {farmer.rejectionReason && (
                  <div className="alert alert-error" style={{ marginTop: '10px' }}>
                    Rejection Reason: {farmer.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
