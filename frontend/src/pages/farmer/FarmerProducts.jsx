import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const SAMPLE_IMAGES = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  Fruits: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=80',
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  Other: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
};

const defaultForm = { name: '', description: '', category: 'Vegetables', price: '', unit: 'kg', stock: '', imageUrl: '' };

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/my');
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(defaultForm); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', category: p.category, price: p.price, unit: p.unit, stock: p.stock, imageUrl: p.image || '' });
    setEditProduct(p);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (!form.imageUrl && SAMPLE_IMAGES[form.category]) {
        fd.set('imageUrl', SAMPLE_IMAGES[form.category]);
      }
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, fd);
        setMsg('Product updated!');
      } else {
        await api.post('/products', fd);
        setMsg('Product added!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <DashboardLayout title="My Products">
      <div className="page-header">
        <div>
          <h1>My Products</h1>
          <p>Manage your farm products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <h3>No Products Yet</h3>
          <p>Add your first product to start selling</p>
          <button className="btn btn-primary" onClick={openAdd}>Add Product</button>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌿</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>per {p.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-approved">{p.category}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--green-dark)' }}>₹{p.price}/{p.unit}</td>
                    <td>{p.stock} {p.unit}</td>
                    <td><span className={`badge ${p.isAvailable ? 'badge-approved' : 'badge-rejected'}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
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
                      {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} placeholder="Describe your product..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input type="number" className="form-control" placeholder="0.00" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-control" value={form.unit}
                      onChange={e => setForm({ ...form, unit: e.target.value })}>
                      {['kg', 'g', 'litre', 'piece', 'dozen', 'quintal', 'ton'].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input type="number" className="form-control" placeholder="0" value={form.stock}
                      onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL (optional)</label>
                    <input className="form-control" placeholder="https://..." value={form.imageUrl}
                      onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                  💡 Leave image URL empty to use a default category image from Unsplash.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editProduct ? '✅ Update Product' : '➕ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
