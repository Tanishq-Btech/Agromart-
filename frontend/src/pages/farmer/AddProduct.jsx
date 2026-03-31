import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const SAMPLE_IMAGES = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
  Fruits: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&q=80',
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  Other: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'
};

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '', description: '', category: 'Vegetables', price: '', unit: 'kg', stock: '', imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
          if (k !== 'imageFile' && v !== null && v !== undefined) {
              fd.append(k, v);
          }
      });
      if (form.imageFile) fd.append('image', form.imageFile);
      else fd.append('imageUrl', SAMPLE_IMAGES[form.category]);
      await api.post('/products', fd);
      navigate('/farmer/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const preview = previewUrl || SAMPLE_IMAGES[form.category];

  return (
    <DashboardLayout title="Add Product">
      <div className="page-header">
        <div><h1>Add New Product</h1><p>List your farm produce for sale</p></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header"><h3>Product Information</h3></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-control" placeholder="e.g. Fresh Tomatoes" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {Object.keys(SAMPLE_IMAGES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3}
                  placeholder="Describe your product — freshness, how it's grown, any certifications..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-control" placeholder="0" min="1" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-control" value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}>
                    {['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'quintal', 'ton', 'bundle'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" className="form-control" placeholder="0" min="0" value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image (optional)</label>
                <input type="file" accept="image/*" className="form-control"
                  onChange={e => {
                      const file = e.target.files[0];
                      if(file) {
                          setForm({ ...form, imageFile: file });
                          setPreviewUrl(URL.createObjectURL(file));
                      }
                  }} />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Choose a file from your device. Leave blank to use a default {form.category.toLowerCase()} image.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/farmer/products')}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? '⏳ Adding Product...' : '✅ Add Product'}
            </button>
          </div>
        </form>

        <div style={{ position: 'sticky', top: '80px' }}>
          <div className="card">
            <div className="card-header"><h3>Preview</h3></div>
            <div>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--green-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  {form.category}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>
                  {form.name || 'Product Name'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-dark)' }}>
                  {form.price ? `₹${form.price}` : '₹0'}
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 400 }}> / {form.unit}</span>
                </div>
                {form.stock && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--green-mid)', marginTop: '4px' }}>
                    ✅ {form.stock} {form.unit} in stock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
