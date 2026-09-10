import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useProducts } from '../../context/ProductContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { openQuickView } = useProducts();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = Number(product.stock) <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const formattedPrice = typeof product.price === 'number' 
    ? Math.round(product.price).toLocaleString() 
    : Math.round(parseFloat(product.price) || 0).toLocaleString();

  const formattedOriginalPrice = product.originalPrice 
    ? (typeof product.originalPrice === 'number'
        ? Math.round(product.originalPrice).toLocaleString()
        : Math.round(parseFloat(product.originalPrice) || 0).toLocaleString())
    : null;

  return (
    <div className="product-card-clean" style={{ position: 'relative' }}>
      
      {/* 1:1 Image Box with Badges & Action Buttons */}
      <div className="product-thumb-box" style={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          {/* Sale or Out of Stock Badge */}
          {isOutOfStock ? (
            <span style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#1E293B',
              color: '#FFF',
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              zIndex: 3
            }}>
              Out of Stock
            </span>
          ) : product.onSale ? (
            <span className="badge-sale-pill">Sale</span>
          ) : null}

          <img
            src={product.image || '/assets/banners/wheelchair.png'}
            alt={product.name}
            loading="lazy"
            style={{ opacity: isOutOfStock ? 0.6 : 1 }}
          />
        </Link>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 4,
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isFavorited ? '#800020' : 'none'}
            stroke={isFavorited ? '#800020' : '#475569'}
            strokeWidth="2.2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Card Action Buttons (Quick View + Quick Add) */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          display: 'flex',
          gap: 6,
          zIndex: 4
        }}>
          {/* Quick View Button */}
          <button
            type="button"
            onClick={handleQuickView}
            className="card-bag-btn"
            title="Quick View"
            style={{
              flex: 1,
              height: 34,
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid #CBD5E1',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Quick View
          </button>

          {/* Quick Add Shopping Bag Icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="card-bag-btn"
            title={isOutOfStock ? 'Out of stock' : 'Add to Cart'}
            style={{
              width: 36,
              height: 34,
              backgroundColor: isOutOfStock ? '#E2E8F0' : '#800020',
              border: 'none',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="6" width="14" height="15" rx="2" />
              <path d="M9 6V5a3 3 0 0 1 6 0v1" />
              <path d="M10 10a2 2 0 0 0 4 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info Box: Title, Rating, Price, & Compare */}
      <div className="card-info-box" style={{ padding: '12px 10px 10px' }}>
        
        {/* Rating Stars & SKU */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748B', marginBottom: 4 }}>
          <span style={{ color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {product.rating || '4.9'}
          </span>
          <span style={{ fontFamily: 'monospace' }}>{product.sku || ''}</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug || product.id}`}
          className="card-product-title"
          title={product.name}
          style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}
        >
          {product.name}
        </Link>

        {/* Pricing Row */}
        <div className="card-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          {product.onSale && formattedOriginalPrice ? (
            <>
              <span className="card-price-del" style={{ fontSize: 11.5, color: '#94A3B8', textDecoration: 'line-through' }}>
                Rs.{formattedOriginalPrice}
              </span>
              <span className="card-price-sale" style={{ fontSize: 15, fontWeight: 800, color: '#800020' }}>
                Rs.{formattedPrice}
              </span>
            </>
          ) : (
            <span className="card-price-regular" style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
              Rs.{formattedPrice}
            </span>
          )}
        </div>

        {/* Compare Checkbox */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9', fontSize: 11 }}>
          <label
            onClick={handleCompareToggle}
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: isCompared ? '#800020' : '#64748B', cursor: 'pointer', fontWeight: 600 }}
          >
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => {}}
              style={{ width: 13, height: 13, accentColor: '#800020' }}
            />
            {isCompared ? 'Comparing' : 'Compare'}
          </label>

          {/* Quick WhatsApp Quote */}
          <a
            href={`https://wa.me/923037333378?text=${encodeURIComponent(`Hello Surgicals.pk, I'd like an inquiry on: ${product.name} (SKU: ${product.sku || 'N/A'}, Price: Rs ${formattedPrice})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Ask on WhatsApp"
            style={{ color: '#059669', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
            </svg>
            Ask
          </a>
        </div>

      </div>
    </div>
  );
};
