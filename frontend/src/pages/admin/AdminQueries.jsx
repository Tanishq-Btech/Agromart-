import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import '../../index.css';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await api.get('/queries');
      setQueries(res.data);
    } catch (err) {
      console.error('Failed to fetch queries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (queryId) => {
    if (!replyText.trim()) return;
    
    setSubmittingReply(true);
    try {
      const res = await api.put(`/queries/${queryId}/reply`, { reply: replyText });
      // Update local state
      setQueries(queries.map(q => q._id === queryId ? res.data : q));
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      console.error('Failed to submit reply', err);
      alert('Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <DashboardLayout title="User Queries">
      <div className="admin-queries-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>Respond to support requests and questions from Farmers and Customers.</p>

        {loading ? (
          <p>Loading queries...</p>
        ) : queries.length === 0 ? (
          <p>No queries found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {queries.map(q => (
              <div key={q._id} style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                borderLeft: q.status === 'pending' ? '4px solid #f59e0b' : '4px solid #10b981'
              }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{q.subject}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                        From: <strong>{q.user?.name}</strong> ({q.user?.email}) - Active {q.user?.role}
                      </p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                        Submitted {new Date(q.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      background: q.status === 'resolved' ? '#e8f5e9' : '#fff3e0',
                      color: q.status === 'resolved' ? '#2e7d32' : '#e65100'
                    }}>
                      {q.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <p style={{ margin: 0, color: 'var(--gray-700)' }}>{q.message}</p>
                  </div>

                  {q.status === 'pending' && replyingTo !== q._id && (
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setReplyingTo(q._id)}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      ↩️ Reply to User
                    </button>
                  )}

                  {q.status === 'resolved' && (
                    <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#0d47a1', fontSize: '0.9rem', fontWeight: 'bold' }}>Your Reply:</p>
                      <p style={{ margin: 0, color: '#1565c0' }}>{q.reply}</p>
                    </div>
                  )}

                  {replyingTo === q._id && (
                    <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid var(--primary-color)', borderRadius: '8px', padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-dark)' }}>Write Reply</h4>
                      <textarea 
                        className="form-control"
                        rows="4" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response to the user here..."
                        style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--gray-300)', borderRadius: '8px', resize: 'vertical', marginBottom: '1rem' }}
                        disabled={submittingReply}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleReplySubmit(q._id)}
                          disabled={submittingReply || !replyText.trim()}
                        >
                          {submittingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          disabled={submittingReply}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
