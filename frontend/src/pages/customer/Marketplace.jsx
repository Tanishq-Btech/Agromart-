import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Other'];

const EMOJI_MAP = { Vegetables: '🥦', Fruits: '🍎', Grains: '🌾', Dairy: '🥛', Spices: '🌶️', Other: '🌿' };

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);
  const { addToCart, setCartOpen } = useCart();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [category, search]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <DashboardLayout title="Marketplace" onSearch={setSearch}>
      <div className="page-header">
        <div>
          <h1>Fresh Marketplace</h1>
          <p>{products.length} products available from verified farmers</p>
        </div>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
            {EMOJI_MAP[c] || '🛒'} {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /><p>Loading fresh products...</p></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <h3>No Products Found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`}>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-img" />
                ) : (
                  <div className="product-img-placeholder">{EMOJI_MAP[product.category] || '🌿'}</div>
                )}
              </Link>
              <div className="product-card-body">
                <div className="product-category">{product.category}</div>
                <Link to={`/product/${product._id}`}>
                  <div className="product-name">{product.name}</div>
                </Link>
                <div className="product-farmer">
                  👨‍🌾 {product.farmer?.name} · {product.farmerProfile?.farmLocation || 'India'}
                </div>
                <div className="product-footer">
                  <div>
                    <div className="product-price">₹{product.price} <span>/ {product.unit}</span></div>
                    <div className={`product-stock${product.stock < 10 ? ' low' : ''}`}>
                      {product.stock < 10 ? `⚠️ Only ${product.stock} left` : `✅ ${product.stock} ${product.unit} available`}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product)}
                    style={addedId === product._id ? { background: 'var(--green-light)' } : {}}
                  >
                    {addedId === product._id ? '✅ Added' : '+ Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
