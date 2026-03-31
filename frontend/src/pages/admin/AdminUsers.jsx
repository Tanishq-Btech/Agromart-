import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="User Management">
      <div className="page-header">
        <div><h1>All Users</h1><p>Manage platform users</p></div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          className="form-control"
          style={{ maxWidth: '320px' }}
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-dark)' }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-600)' }}>{user.email}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{user.phone || '—'}</td>
                    <td>
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-rejected' :
                        user.role === 'farmer' ? 'badge-approved' : 'badge-placed'
                      }`}>{user.role}</span>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon">👥</div><p>No users found</p></div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
