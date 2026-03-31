import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import '../../index.css';

export default function ContactAdmin() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await api.get('/queries/my-queries');
      setQueries(res.data);
    } catch (err) {
      console.error('Failed to fetch queries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/queries', { subject, message });
      setQueries([res.data, ...queries]);
      setSuccess('Your query has been submitted successfully to the admin team!');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Help & Support">
      <div className="contact-admin-container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Submit Form */}
        <div className="dashboard-card" style={{ padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>💬 Contact Admin Team</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--gray-500)', fontSize: '0.95rem' }}>
            Have a question about selling, a problem with a product, or need help? Send us a message and we'll reply as soon as possible.
          </p>
          
          {error && <div className="error-message" style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
          {success && <div className="success-message" style={{ color: 'green', background: '#e8f5e9', padding: '10px', borderRadius: '6px', marginBottom: '1rem' }}>{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Brief summary of your issue..." 
                className="form-control"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--gray-300)', borderRadius: '8px' }}
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Describe your issue in detail..." 
                className="form-control"
                rows="5"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--gray-300)', borderRadius: '8px', resize: 'vertical' }}
                disabled={submitting}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', alignSelf: 'flex-start' }} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Previous Queries */}
        <div className="dashboard-card" style={{ padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>📋 My Support History</h3>
          
          {loading ? (
            <p>Loading your queries...</p>
          ) : queries.length === 0 ? (
            <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem 0' }}>You have not submitted any queries yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {queries.map(q => (
                <div key={q._id} style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{q.subject}</h4>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      background: q.status === 'resolved' ? '#e8f5e9' : '#fff3e0',
                      color: q.status === 'resolved' ? '#2e7d32' : '#e65100'
                    }}>
                      {q.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--gray-600)' }}><strong>You:</strong> {q.message}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', margin: '0 0 1rem 0' }}>
                      Sent on {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                    
                    {q.reply && (
                      <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#0d47a1' }}><strong>Admin Reply:</strong></p>
                        <p style={{ margin: 0, color: '#1565c0' }}>{q.reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
