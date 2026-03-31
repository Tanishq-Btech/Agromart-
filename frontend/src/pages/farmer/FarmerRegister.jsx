import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AIVerification from '../../components/AIVerification';


export default function FarmerRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    farmName: '', farmLocation: '', cropTypes: '', farmSize: '',
    bankName: '', accountNumber: '', ifscCode: ''
  });
  const [files, setFiles] = useState({ govIdProof: null, landProof: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAiVerified, setIsAiVerified] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (files.govIdProof) fd.append('govIdProof', files.govIdProof);
      if (files.landProof) fd.append('landProof', files.landProof);

      await api.post('/farmer/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '620px' }}>
        <div className="auth-logo">
          <h1>Agro<span>Mart</span></h1>
          <p>Complete your farmer profile to get verified</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: s <= step ? 'var(--green-mid)' : 'var(--gray-200)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: '20px' }}>
          Step {step} of 3 — {step === 1 ? 'Farm Details' : step === 2 ? 'Verification Documents' : 'Bank Details'}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h3 className="form-section-title">🌾 Farm Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Farm Name *</label>
                  <input className="form-control" placeholder="Green Valley Farm" value={form.farmName}
                    onChange={e => setForm({ ...form, farmName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Farm Location *</label>
                  <input className="form-control" placeholder="Village, District, State" value={form.farmLocation}
                    onChange={e => setForm({ ...form, farmLocation: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Crop Types *</label>
                  <input className="form-control" placeholder="Tomato, Rice, Wheat..." value={form.cropTypes}
                    onChange={e => setForm({ ...form, cropTypes: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Farm Size *</label>
                  <input className="form-control" placeholder="e.g. 5 acres" value={form.farmSize}
                    onChange={e => setForm({ ...form, farmSize: e.target.value })} required />
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={() => setStep(2)}>
                Next: Upload Documents →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="form-section-title">📄 Verification Documents</h3>
              <div className="form-group">
                <label className="form-label">Government ID Proof (Aadhaar/PAN) *</label>
                <input type="file" className="form-control" accept="image/*,.pdf"
                  onChange={e => setFiles({ ...files, govIdProof: e.target.files[0] })} />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Upload Aadhaar Card, PAN Card, or Voter ID
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Land Ownership Proof *</label>
                <input type="file" className="form-control" accept="image/*,.pdf"
                  onChange={e => setFiles({ ...files, landProof: e.target.files[0] })} />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Upload land registry document or khata
                </p>
              </div>

              {files.govIdProof && files.landProof && (
                <AIVerification 
                  onVerifySuccess={() => setIsAiVerified(true)} 
                  onVerifyFail={() => setIsAiVerified(false)} 
                />
              )}

              {!isAiVerified && (
                <div className="alert alert-warning" style={{ marginTop: '16px' }}>
                  ⚠️ Please upload both documents and complete AI verification to proceed.
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn btn-primary" style={{ flex: 1 }} 
                  onClick={() => setStep(3)} disabled={!isAiVerified}>
                  {isAiVerified ? 'Next: Bank Details →' : 'Wait for Verification...'}
                </button>
              </div>

            </>
          )}

          {step === 3 && (
            <>
              <h3 className="form-section-title">🏦 Bank Details</h3>
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <input className="form-control" placeholder="State Bank of India" value={form.bankName}
                  onChange={e => setForm({ ...form, bankName: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Account Number *</label>
                  <input className="form-control" placeholder="XXXXXXXXXX" value={form.accountNumber}
                    onChange={e => setForm({ ...form, accountNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code *</label>
                  <input className="form-control" placeholder="SBIN0001234" value={form.ifscCode}
                    onChange={e => setForm({ ...form, ifscCode: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Submitting...' : '✅ Submit for Verification'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
