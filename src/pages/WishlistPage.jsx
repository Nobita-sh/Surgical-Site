import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach(item => {
      addToCart(item, 1);
    });
    clearWishlist();
  };

  return (
    <div className="site-container" style={{ padding: '30px 15px 60px' }}>
      
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #ECECEC', paddingBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link> / <strong style={{ color: '#000' }}>My Wishlist</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#0F172A' }}>
            Saved Equipment ({wishlist.length})
          </h1>
          {wishlist.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="btn-solid-maroon"
                style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
              >
                Move All to Cart
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="btn-framed"
                style={{ padding: '8px 14px', borderRadius: 6, fontSize: 13 }}
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Items List */}
      {wishlist.length === 0 ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px dashed #CBD5E1', marginBottom: 40 }}>
          <div style={{ marginBottom: 16 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px', color: '#0F172A' }}>Your Wishlist is Empty</h2>
          <p style={{ color: '#64748B', fontSize: 13, maxWidth: 460, margin: '0 auto 24px' }}>
            Explore our catalog of genuine hospital equipment, diagnostic tools, and physiotherapy supplies to save items for later purchase.
          </p>
          <Link to="/shop" className="btn-solid-maroon" style={{ padding: '10px 24px', borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}>
            Explore Medical Catalog &rarr;
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 40
        }}>
          {wishlist.map(product => {
            const stockNum = Number(product.stock) || 0;
            const isOut = stockNum <= 0;

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Thumbnail */}
                <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', position: 'relative', padding: 20, backgroundColor: '#FAFAFA', textAlign: 'center' }}>
                  <img
                    src={product.image || '/assets/banners/wheelchair.png'}
                    alt={product.name}
                    style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', margin: '0 auto' }}
                  />
                  {product.onSale && (
                    <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#800020', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                      SALE
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                      {product.categoryName || 'Medical Equipment'}
                    </div>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', textDecoration: 'none', lineHeight: 1.4, display: 'block', marginBottom: 8 }}
                    >
                      {product.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#800020' }}>
                        Rs. {Number(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'line-through' }}>
                          Rs. {Number(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, marginBottom: 14 }}>
                      <span style={{ color: isOut ? '#991B1B' : '#047857', fontWeight: 600 }}>
                        {isOut ? '● Out of Stock' : '● In Stock & Ready to Ship'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      disabled={isOut}
                      className="btn-solid-maroon"
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: isOut ? 'not-allowed' : 'pointer',
                        opacity: isOut ? 0.6 : 1
                      }}
                    >
                      {isOut ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="btn-framed"
                      title="Remove from wishlist"
                      style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEO & Brand Trust Story */}
      <SiteStorySection />
    </div>
  );
};
