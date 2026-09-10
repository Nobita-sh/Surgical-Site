import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    grandTotal
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-drawer-overlay active" onClick={() => setIsDrawerOpen(false)}>
      <div
        className="cart-drawer"
        style={{ transform: 'translateX(0)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Your Shopping Cart</h3>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Drawer Items */}
        <div className="cart-drawer-body" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#666' }}>
              <div style={{ marginBottom: 12 }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h4 style={{ margin: 0, color: '#111' }}>Your cart is empty</h4>
              <p style={{ fontSize: 12, marginTop: 4 }}>Add quality surgical and medical supplies to get started.</p>
              <button
                className="btn-framed btn-framed-sm"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    paddingBottom: 12,
                    borderBottom: '1px solid #ECECEC'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'contain',
                      borderRadius: 8,
                      border: '1px solid #ECECEC',
                      padding: 4
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => setIsDrawerOpen(false)}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#111',
                        textDecoration: 'none',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.name}
                    </Link>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                      Rs {product.price.toLocaleString()}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DDD', borderRadius: 4 }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '0 6px' }}>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: 11,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer" style={{ padding: 16, borderTop: '1px solid #ECECEC', backgroundColor: '#FAFAFA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
              <span>Shipping:</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#059669' : '#111' }}>
                {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, borderTop: '1px solid #DDD', paddingTop: 10, marginBottom: 16 }}>
              <span>Grand Total:</span>
              <span>Rs {grandTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/checkout');
                }}
                className="btn-solid-maroon"
                style={{ width: '100%', padding: '12px', textAlign: 'center', borderRadius: 6, fontWeight: 700 }}
              >
                PROCEED TO CHECKOUT
              </button>
              
              <Link
                to="/cart"
                onClick={() => setIsDrawerOpen(false)}
                className="btn-framed"
                style={{ width: '100%', padding: '10px', textAlign: 'center', borderRadius: 6, fontSize: 12 }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
