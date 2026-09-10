import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export const ProductQuickViewModal = () => {
  const { selectedProduct, isQuickViewOpen, closeQuickView } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProduct?.variants && Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant('');
    }
  }, [selectedProduct]);

  if (!isQuickViewOpen || !selectedProduct) return null;

  return (
    <div className="product-modal-overlay active" onClick={closeQuickView}>
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 750, width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="modal-close-btn" onClick={closeQuickView}>×</button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, padding: 24 }}>
          {/* Left Thumbnail */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', borderRadius: 12, border: '1px solid #ECECEC', padding: 20 }}>
            {selectedProduct.onSale && (
              <span className="badge-sale-circle">
                Sale!
              </span>
            )}
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }}
            />
          </div>

          {/* Right Info */}
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#666', fontWeight: 600, letterSpacing: 0.5 }}>
              {selectedProduct.categoryName || 'Medical Equipment'}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 10px', lineHeight: 1.3 }}>
              {selectedProduct.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
              {selectedProduct.onSale && selectedProduct.originalPrice ? (
                <>
                  <span style={{ fontSize: 14, color: '#888', textDecoration: 'line-through' }}>
                    Rs {selectedProduct.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#000' }}>
                    Rs {selectedProduct.price.toLocaleString()}
                  </span>
                </>
              ) : selectedProduct.priceRange ? (
                <span style={{ fontSize: 20, fontWeight: 800, color: '#000' }}>
                  {selectedProduct.priceRange}
                </span>
              ) : (
                <span style={{ fontSize: 20, fontWeight: 800, color: '#000' }}>
                  Rs {selectedProduct.price.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6, marginBottom: 16 }}>
              {selectedProduct.shortDescription || selectedProduct.description}
            </p>

            <div style={{ fontSize: 12, color: '#374151', marginBottom: 16, display: 'flex', gap: 16 }}>
              <div><strong>SKU:</strong> {selectedProduct.sku}</div>
              <div><strong>Stock:</strong> <span style={{ color: '#059669' }}>In Stock ({selectedProduct.stock} units)</span></div>
            </div>

            {/* Variety Selector */}
            {selectedProduct.variants && Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
                  {selectedProduct.variantLabel || 'Option'}: <span style={{ color: '#800020' }}>{selectedVariant}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedProduct.variants.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 6,
                        border: selectedVariant === v ? '1.5px solid #800020' : '1px solid #CBD5E1',
                        backgroundColor: selectedVariant === v ? '#FFF1F2' : '#FFFFFF',
                        color: selectedVariant === v ? '#800020' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DDD', borderRadius: 6 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontWeight: 600, fontSize: 13 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart({ ...selectedProduct, ...(selectedVariant ? { selectedVariant } : {}) }, quantity);
                  closeQuickView();
                }}
                className="btn-solid-maroon"
                style={{ flex: 1, padding: '10px 16px', fontSize: 13, borderRadius: 6 }}
              >
                Add to Cart
              </button>
            </div>

            <Link
              to={`/product/${selectedProduct.slug}`}
              onClick={closeQuickView}
              style={{ fontSize: 12, color: '#111', fontWeight: 600, textDecoration: 'underline' }}
            >
              View Full Product Specifications &amp; Reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
