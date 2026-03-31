import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, setCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <DashboardLayout title="Product Details">
      <div className="loading-screen"><div className="spinner" /></div>
    </DashboardLayout>
  );

  if (!product) return null;

  return (
    <DashboardLayout title="Product Details">
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="product-detail">
        <div>
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-detail-img" />
          ) : (
            <div className="product-detail-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--green-pale)' }}>🌿</div>
          )}
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>
            <span className="badge badge-approved">{product.category}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green-dark)', marginBottom: '8px' }}>
            {product.name}
          </h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '20px', lineHeight: '1.7' }}>
            {product.description || 'Fresh, quality produce directly from the farm.'}
          </p>

          <div style={{ background: 'var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--green-dark)', fontFamily: 'var(--font-display)' }}>
              ₹{product.price}
              <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--gray-600)' }}> / {product.unit}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: product.stock < 10 ? 'var(--red)' : 'var(--green-mid)', marginTop: '4px' }}>
              {product.stock < 10 ? `⚠️ Only ${product.stock} ${product.unit} left` : `✅ ${product.stock} ${product.unit} in stock`}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body" style={{ padding: '16px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--green-dark)', marginBottom: '12px' }}>👨‍🌾 Farmer Details</h4>
              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Name:</strong> {product.farmer?.name}</div>
                <div><strong>Farm:</strong> {product.farmerProfile?.farmName || 'Local Farm'}</div>
                <div><strong>Location:</strong> {product.farmerProfile?.farmLocation || 'India'}</div>
                <div><strong>Crops:</strong> {product.farmerProfile?.cropTypes || product.category}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gray-100)', borderRadius: '8px', padding: '8px' }}>
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-value" style={{ minWidth: '30px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Total: <strong style={{ color: 'var(--green-dark)' }}>₹{(product.price * qty).toFixed(2)}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
              {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => { addToCart(product, qty); setCartOpen(true); }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
