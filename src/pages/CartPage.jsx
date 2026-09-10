import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, shippingFee, grandTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="site-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.6" style={{ display: 'inline-block' }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 10px' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
          Browse our extensive catalog of genuine hospital-grade medical and surgical equipment.
        </p>
        <Link to="/shop" className="btn-framed" style={{ display: 'inline-block', padding: '10px 24px' }}>
          Explore Products
        </Link>
        <div style={{ marginTop: 50 }}>
          <SiteStorySection />
        </div>
      </div>
    );
  }

  return (
    <div className="site-container" style={{ padding: '30px 15px 60px' }}>
      <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>
        Shopping Cart
      </h1>

      <div className="cart-layout-grid">
        
        {/* Left: Cart Items Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #ECECEC', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #ECECEC', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Product</th>
                <th style={{ padding: '14px 16px' }}>Price</th>
                <th style={{ padding: '14px 16px' }}>Quantity</th>
                <th style={{ padding: '14px 16px' }}>Subtotal</th>
                <th style={{ padding: '14px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(({ product, quantity }) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #ECECEC' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 6, border: '1px solid #ECECEC' }}
                      />
                      <Link to={`/product/${product.slug}`} style={{ color: '#111', fontWeight: 600, textDecoration: 'none', maxWidth: 220 }}>
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td style={{ padding: 16, fontWeight: 600 }}>
                    Rs {product.price.toLocaleString()}
                  </td>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #DDD', borderRadius: 4 }}>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 8px', fontWeight: 600 }}>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: 16, fontWeight: 700 }}>
                    Rs {(product.price * quantity).toLocaleString()}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 16 }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Cart Summary Box */}
        <div style={{ backgroundColor: '#F9FAFB', padding: 24, borderRadius: 12, border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
            <span>Subtotal:</span>
            <span style={{ fontWeight: 600 }}>Rs {subtotal.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
            <span>Delivery Charges:</span>
            <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#059669' : '#111' }}>
              {shippingFee === 0 ? 'FREE (Orders over Rs. 5,000)' : `Rs ${shippingFee}`}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #DDD', paddingTop: 14, marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
            <span>Total:</span>
            <span>Rs {grandTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-solid-maroon"
            style={{ width: '100%', padding: '14px', marginTop: 24, borderRadius: 8, fontSize: 14, fontWeight: 700 }}
          >
            PROCEED TO CHECKOUT
          </button>

          <Link
            to="/shop"
            style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 12, color: '#4B5563', textDecoration: 'underline' }}
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
