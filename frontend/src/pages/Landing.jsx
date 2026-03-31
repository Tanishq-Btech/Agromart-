import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '✅', title: 'Verified Farmers', desc: 'Every farmer on our platform is verified with government ID and land ownership documents. Trust every purchase.' },
  { icon: '💰', title: 'Fair Pricing in ₹', desc: 'No middlemen means better prices for both farmers and customers. Transparent pricing in Indian Rupees.' },
  { icon: '🌱', title: 'Fresh Produce', desc: 'Direct farm-to-table ensures freshness. Vegetables, fruits, grains, and more delivered to your door.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Estimated delivery in 3-5 business days with real-time order tracking from placement to your doorstep.' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Browse, add to cart, and checkout in minutes. Cash on delivery available for all orders.' },
  { icon: '🤝', title: 'Support Farmers', desc: 'Every purchase directly supports Indian farmers and helps them earn more for their hard work.' },
];

const steps = [
  { num: '1', icon: '📝', title: 'Register & Verify', desc: 'Sign up as a farmer or customer. Farmers get verified by our admin team quickly.' },
  { num: '2', icon: '🌾', title: 'Browse & Buy', desc: 'Explore fresh products listed by verified farmers. Add to cart and checkout securely.' },
  { num: '3', icon: '🚜', title: 'Delivered Fresh', desc: 'Your order is packed fresh and delivered directly from the farm to your doorstep.' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="logo">🌾 Agro<span>Mart</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="btn btn-sm" style={{ border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', background: 'transparent', borderRadius: '8px' }}>Login</Link>
          <Link to="/signup" className="btn btn-sm" style={{ background: 'var(--green-light)', color: 'var(--green-dark)', fontWeight: 700, borderRadius: '8px' }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Fresh from the Farm,<br />Direct to <span>Your Table</span></h1>
        <p>AgroMart connects verified farmers directly with customers. Buy fresh produce without middlemen — at fair prices, in Indian Rupees.</p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-lg" style={{ background: 'var(--green-light)', color: 'var(--green-dark)', fontWeight: 700, borderRadius: '14px', padding: '16px 36px', fontSize: '1rem' }}>
            🛒 Start Shopping
          </Link>
          <Link to="/signup?role=farmer" className="btn btn-lg" style={{ color: 'white', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)', padding: '16px 36px', fontSize: '1rem' }}>
            👨‍🌾 Sell as Farmer
          </Link>
        </div>
        {/* Trust Indicators */}
        <div style={{ marginTop: '56px', display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', animation: 'heroFadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.45s both' }}>
          {[
            { val: '10,000+', label: 'Active Farmers' },
            { val: '50,000+', label: 'Happy Customers' },
            { val: '₹5 Cr+', label: 'Farmer Earnings' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-light)', fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Why Choose AgroMart?</h2>
        <p className="features-subtitle">Everything you need for a seamless farm-to-table experience</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how">
        <h2>How It Works</h2>
        <p className="how-subtitle">Get started in 3 simple steps</p>
        <div className="how-grid">
          {steps.map((s, i) => (
            <div className="how-step" key={i}>
              <div className="step-number">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="contact">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🌾 Agro<span>Mart</span></h3>
            <p>India's trusted farm-to-table marketplace. Connecting verified farmers directly with customers for fresh, fair-priced produce.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
          <div className="footer-col">
            <h4>For Farmers</h4>
            <Link to="/signup?role=farmer">Register</Link>
            <a href="#">Pricing</a>
            <a href="#">Support</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AgroMart · Farm to Table Marketplace · Made with 💚 in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
