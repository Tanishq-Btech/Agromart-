import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Signup() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: params.get('role') || 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: form.role
      });
      login(data);
      if (data.role === 'farmer') navigate('/farmer/register');
      else navigate('/marketplace');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-logo">
          <h1>🌾 Agro<span>Mart</span></h1>
          <p>Farm to Table Marketplace</p>
        </div>

        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Join thousands of farmers and customers across India</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I want to join as</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['customer', 'farmer'].map(role => (
                <label key={role} style={{
                  flex: 1,
                  padding: '16px',
                  border: `2px solid ${form.role === role ? 'var(--green-mid)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: form.role === role ? 'var(--green-pale)' : 'white',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  transform: form.role === role ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: form.role === role ? '0 4px 12px rgba(22,101,52,0.15)' : 'none',
                }}>
                  <input type="radio" name="role" value={role} checked={form.role === role}
                    onChange={e => setForm({ ...form, role: e.target.value })} style={{ display: 'none' }} />
                  <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{role === 'farmer' ? '👨‍🌾' : '🛒'}</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: form.role === role ? 'var(--green-dark)' : 'var(--gray-600)'
                  }}>{role}</div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--gray-400)',
                    marginTop: '2px'
                  }}>{role === 'farmer' ? 'Sell your produce' : 'Buy fresh produce'}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Your full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" placeholder="+91 XXXXX XXXXX" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Re-enter password" value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          Already have an account? <Link to="/login" className="auth-link">Sign In →</Link>
        </p>
      </div>
    </div>
  );
}
