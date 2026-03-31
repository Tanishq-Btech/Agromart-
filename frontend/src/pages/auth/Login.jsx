import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/marketplace');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🌾 Agro<span>Mart</span></h1>
          <p>Farm to Table Marketplace</p>
        </div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue to your dashboard</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }} /> Signing in...</>
            ) : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          Don't have an account? <Link to="/signup" className="auth-link">Create one free →</Link>
        </p>

        <div className="divider" />

        <div style={{
          background: 'linear-gradient(135deg, var(--green-pale), #f0fdf4)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          fontSize: '0.78rem',
          color: 'var(--gray-600)',
          border: '1px solid rgba(74, 222, 128, 0.2)'
        }}>
          <strong style={{ color: 'var(--green-dark)' }}>🔑 Demo Accounts</strong><br />
          <span style={{ display: 'inline-block', marginTop: '6px' }}>
            <strong>Farmer:</strong> signup as farmer role<br />
            <strong>Customer:</strong> signup as customer role
          </span>
        </div>
      </div>
    </div>
  );
}
