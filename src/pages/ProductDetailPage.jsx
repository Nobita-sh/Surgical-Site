import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { ProductCard } from '../components/common/ProductCard';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', name: '', email: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const product = products.find(p => p.slug === slug || p.id === slug) || products[0];
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || '');

  useEffect(() => {
    if (product?.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant('');
    }
  }, [product]);

  const relatedProducts = products.filter(p => p.id !== product?.id).slice(0, 5);

  const isFavorited = product ? isInWishlist(product.id) : false;
  const isCompared = product ? isInCompare(product.id) : false;

  const defaultReviews = [
    {
      id: 1,
      author: 'Dr. M. Usman Tariq (Lahore General Hospital)',
      rating: 5,
      comment: 'Excellent build quality and exact clinical calibration as specified. Arrived packed securely via TCS with genuine documentation.',
      date: 'Verified Hospital Order'
    },
    {
      id: 2,
      author: 'Dr. Fatima Zahra (Allied Hospital Faisalabad)',
      rating: 5,
      comment: 'Genuine medical equipment with complete accessories and official warranty card. Highly recommended for clinical setup.',
      date: 'Verified Buyer'
    }
  ];

  // Persistent Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('spk_reviews_' + (product?.id || 'default'));
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultReviews;
  });

  useEffect(() => {
    if (!product?.id) return;
    try {
      const saved = localStorage.getItem('spk_reviews_' + product.id);
      if (saved) {
        setReviews(JSON.parse(saved));
        return;
      }
    } catch {}
    setReviews(defaultReviews);
  }, [product?.id]);

  // Track Recently Viewed Products
  useEffect(() => {
    if (!product?.id) return;
    try {
      const stored = JSON.parse(localStorage.getItem('spk_recently_viewed') || '[]');
      const updated = [product.id, ...stored.filter(id => id !== product.id)].slice(0, 8);
      localStorage.setItem('spk_recently_viewed', JSON.stringify(updated));

      const matching = updated
        .filter(id => id !== product.id)
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
      setRecentlyViewed(matching);
    } catch {}
  }, [product?.id, products]);

  // Delivery Dates Calculation
  const now = new Date();
  const lahoreDate = new Date(now.getTime() + 2 * 86400000);
  const nationalDate = new Date(now.getTime() + 4 * 86400000);
  const dateOpts = { weekday: 'short', month: 'short', day: 'numeric' };
  const lahoreDeliveryStr = lahoreDate.toLocaleDateString('en-US', dateOpts);
  const nationalDeliveryStr = nationalDate.toLocaleDateString('en-US', dateOpts);

  if (!product) {
    return (
      <div className="site-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn-framed" style={{ marginTop: 20 }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const basePrice = parseFloat(product.price) || 0;
  const currentPrice = Math.round(basePrice);
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const handleWhatsAppOrder = () => {
    const variantText = selectedVariant ? `\n*Option:* ${selectedVariant}` : '';
    const message = encodeURIComponent(
      `Hello Surgicals.pk! I am interested in ordering:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku || 'N/A'}\n*Price:* Rs ${currentPrice.toLocaleString()}${variantText}\n*Qty:* ${quantity}\n\nPlease confirm availability and delivery timeframe to my clinic.`
    );
    window.open(`https://wa.me/923037333378?text=${message}`, '_blank');
  };


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim() || !reviewForm.name.trim()) return;

    const newRev = {
      id: Date.now(),
      author: reviewForm.name,
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString()
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      localStorage.setItem('spk_reviews_' + product.id, JSON.stringify(updated));
    } catch {}

    setReviewForm({ rating: 5, comment: '', name: '', email: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'additional', label: 'Additional information' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case 'description':
        return (
          <div style={{ maxWidth: 850 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px', color: '#000000' }}>
              Description
            </h3>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 16px' }}>{product.description}</p>
              {product.shortDescription && (
                <p style={{ margin: '0 0 16px' }}>{product.shortDescription}</p>
              )}
              {product.certifications && (
                <div style={{ marginTop: 20 }}>
                  <strong style={{ display: 'block', marginBottom: 8, color: '#000' }}>Certifications &amp; Standards:</strong>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {product.certifications.map((c, i) => (
                      <span key={i} style={{ backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#1F2937' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'additional':
        return (
          <div style={{ maxWidth: 750 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#000000' }}>
              Additional information
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <tbody>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700, width: '35%', color: '#111' }}>Weight</td>
                  <td style={{ padding: '11px 16px', color: '#4B5563' }}>{product.specifications?.Weight || '2.5 kg'}</td>
                </tr>
                <tr style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700, width: '35%', color: '#111' }}>Dimensions</td>
                  <td style={{ padding: '11px 16px', color: '#4B5563' }}>{product.specifications?.Dimensions || '35 × 25 × 20 cm'}</td>
                </tr>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700, width: '35%', color: '#111' }}>Model / SKU</td>
                  <td style={{ padding: '11px 16px', color: '#4B5563' }}>{product.sku || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'reviews':
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#000000' }}>
              Customer &amp; Hospital Reviews ({reviews.length})
            </h3>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '14px 16px', backgroundColor: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <strong style={{ fontSize: 14, color: '#111827' }}>{r.author}</strong>
                      <span style={{ fontSize: 11.5, color: '#03543F', marginLeft: 8, fontWeight: 700 }}>
                        Verified Clinical Buyer
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{r.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <svg
                        key={sIdx}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={sIdx < (r.rating || 5) ? '#D97706' : '#E2E8F0'}
                        stroke={sIdx < (r.rating || 5) ? '#D97706' : '#CBD5E1'}
                        strokeWidth="1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Submit Review Form */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>Add Clinical Review</h4>
              {reviewSubmitted && (
                <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: 6, marginBottom: 14, fontSize: 13, fontWeight: 600 }}>
                  Thank you! Your verified review has been submitted and saved.
                </div>
              )}
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, backgroundColor: '#FFF' }}
                  >
                    <option value={5}>5/5 - Exceptional Quality</option>
                    <option value={4}>4/5 - Very Good</option>
                    <option value={3}>3/5 - Average</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Doctor / Clinic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Tariq / Services Hospital"
                      value={reviewForm.name}
                      onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="doctor@hospital.pk"
                      value={reviewForm.email}
                      onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Review Comment *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Share clinical observations, equipment packaging, or usability..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-solid-maroon"
                  style={{ padding: '10px 22px', borderRadius: 6, fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}
                >
                  SUBMIT VERIFIED REVIEW
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="site-container" style={{ padding: '24px 15px 60px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ fontSize: 13, color: '#555555', marginBottom: 20 }}>
        <Link to="/" style={{ color: '#555555', textDecoration: 'none' }}>Home</Link> &raquo;{' '}
        <Link to="/shop" style={{ color: '#555555', textDecoration: 'none' }}>Shop</Link> &raquo;{' '}
        <span style={{ color: '#111111' }}>{product.name}</span>
      </div>

      {/* Main Product Showcase: 2-Column */}
      <div className="pdp-showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, marginBottom: 40 }}>
        
        {/* Left Column: Image Box */}
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 440,
              aspectRatio: '1/1',
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECECEC',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              overflow: 'hidden',
              margin: '0 auto'
            }}
          >
            {product.onSale && (
              <span className="badge-sale-circle" style={{ width: 36, height: 36, fontSize: 11 }}>
                Sale!
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#D97706', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              4.9 / 5.0
            </span>
            <span style={{ color: '#64748B', fontWeight: 500 }}>({reviews.length} Clinical Reviews)</span>
          </div>

          <h1 className="pdp-title" style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, margin: '0 0 10px', color: '#0F172A', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          <div className="pdp-hatched-divider" aria-hidden="true">
            {"/".repeat(45)}
          </div>

          {/* Pricing */}
          <div className="pdp-price" style={{ fontSize: 24, fontWeight: 800, color: '#800020', margin: '14px 0' }}>
            Rs {currentPrice.toLocaleString()}
            {product.originalPrice && (
              <span style={{ fontSize: 16, color: '#94A3B8', textDecoration: 'line-through', marginLeft: 10, fontWeight: 500 }}>
                Rs {Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Variety Selector (Only rendered if product defines variants) */}
          {variants.length > 0 && (
            <div className="pdp-variety-row" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#000000', minWidth: 60 }}>
                {product.variantLabel || 'Option'}
              </span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {variants.map(v => {
                  const isSelected = selectedVariant === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '6px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        border: isSelected ? '1.5px solid #800020' : '1px solid #CBD5E1',
                        backgroundColor: isSelected ? '#FFF1F2' : '#FFFFFF',
                        borderRadius: 6,
                        cursor: 'pointer',
                        color: isSelected ? '#800020' : '#334155'
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart & Wishlist */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, width: '100%' }}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: 52,
                height: 44,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 700,
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                outline: 'none',
                flexShrink: 0,
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />

            <button
              onClick={() => addToCart({ ...product, price: currentPrice, ...(selectedVariant ? { selectedVariant } : {}) }, quantity)}
              className="btn-solid-maroon"
              style={{
                flex: 1,
                minWidth: 120,
                height: 44,
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                boxSizing: 'border-box'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Add to Cart</span>
            </button>

            {/* Wishlist Toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
              aria-label={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
              style={{
                width: 44,
                height: 44,
                minWidth: 44,
                padding: 0,
                border: isFavorited ? '1.5px solid #800020' : '1px solid #CBD5E1',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFavorited ? '#FFF1F2' : '#FFFFFF',
                color: isFavorited ? '#800020' : '#475569',
                cursor: 'pointer',
                flexShrink: 0,
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? '#800020' : 'none'} stroke={isFavorited ? '#800020' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => toggleCompare(product)}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              aria-label={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              style={{
                width: 44,
                height: 44,
                minWidth: 44,
                padding: 0,
                border: isCompared ? '1.5px solid #800020' : '1px solid #CBD5E1',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCompared ? '#FFF1F2' : '#FFFFFF',
                color: isCompared ? '#800020' : '#475569',
                cursor: 'pointer',
                flexShrink: 0,
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isCompared ? '#800020' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M12 3v18" />
                <path d="M3 7h18" />
                <path d="M6 7l-3 7h6L6 7z" />
                <path d="M18 7l-3 7h6l-3-7z" />
                <path d="M8 21h8" />
              </svg>
            </button>
          </div>

          {/* 1-Tap WhatsApp Order Button */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '12px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              marginBottom: 18,
              boxShadow: '0 2px 6px rgba(37,211,102,0.25)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
            </svg>
            Instant Order on WhatsApp (Direct Hospital Helpline)
          </button>

          {/* Estimated National Delivery Widget */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Estimated National Delivery</span>
            </div>
            <div style={{ fontSize: 12.5, color: '#334155', marginTop: 4, lineHeight: 1.5 }}>
              Order within the next 4 hours to receive by <strong>{lahoreDeliveryStr}</strong> in Lahore or <strong>{nationalDeliveryStr}</strong> nationwide across Pakistan via TCS Express / Daewoo Fastex.
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, fontSize: 11.5, color: '#03543F', fontWeight: 600 }}>
              <span>100% Genuine Clinical Guarantee</span>
              <span>7-Day Testing Warranty</span>
              <span>DRAP &amp; ISO Approved</span>
            </div>
          </div>

          {/* Short Clinical Description */}
          <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, marginBottom: 20 }}>
            {product.shortDescription || product.description}
          </div>

        </div>
      </div>

      {/* Tabs Section (Description, Specs, Reviews) */}
      <div style={{ margin: '40px 0 60px', borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #800020' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#800020' : '#64748B',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Related Products Section */}
      <div style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 18 }}>
          RELATED CLINICAL EQUIPMENT
        </h2>
        <div className="products-grid-5">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginBottom: 50, borderTop: '1px solid #E2E8F0', paddingTop: 30 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 18 }}>
            RECENTLY VIEWED MEDICAL EQUIPMENT
          </h2>
          <div className="products-grid-5">
            {recentlyViewed.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* SEO & Medical Authority Story */}
      <SiteStorySection />

    </div>
  );
};
