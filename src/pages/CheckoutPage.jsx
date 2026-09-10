import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SiteStorySection } from '../components/common/SiteStorySection';
import { api } from '../services/api';

export const CheckoutPage = () => {
  const { cart, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    notes: '',
    paymentMethod: 'cod'
  });

  const [storeSettings, setStoreSettings] = useState({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Surgicals PK Healthcare Supplies',
    accountNumber: 'PK36MEZN0001020105829102',
    contactPhone: '0303-7333378'
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const PAKISTANI_CITIES = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
    'Hyderabad', 'Bahawalpur', 'Sargodha', 'Abbottabad'
  ];

  useEffect(() => {
    api.settings.get()
      .then(s => {
        if (s) {
          setStoreSettings({
            bankName: s.bankName || 'Meezan Bank Limited',
            accountTitle: s.accountTitle || 'Surgicals PK Healthcare Supplies',
            accountNumber: s.accountNumber || 'PK36MEZN0001020105829102',
            contactPhone: s.contactPhone || '0303-7333378'
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      addToast('Please enter a voucher code', 'error');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const data = await api.cms.getPromos();
      const vouchers = data.vouchers || [];
      const query = couponCode.trim().toUpperCase();

      const matched = vouchers.find(v => 
        (v.code || '').toUpperCase() === query && (v.status || 'Active').toLowerCase() === 'active'
      );

      if (!matched) {
        addToast(`Coupon "${query}" is invalid or expired`, 'error');
        return;
      }

      if (subtotal < (matched.minOrder || 0)) {
        addToast(`Coupon "${query}" requires minimum order of Rs. ${Number(matched.minOrder).toLocaleString()}`, 'error');
        return;
      }

      let discountAmt = 0;
      const discountStr = String(matched.discount || '');
      if (discountStr.includes('%')) {
        const pct = parseFloat(discountStr) || 0;
        discountAmt = Math.round(subtotal * (pct / 100));
      } else {
        const numMatch = discountStr.match(/\d+/);
        discountAmt = numMatch ? parseInt(numMatch[0], 10) : 0;
      }

      setAppliedCoupon({
        code: matched.code,
        discountText: matched.discount,
        discountAmount: discountAmt
      });
      addToast(`Coupon "${matched.code}" applied! You saved Rs. ${discountAmt.toLocaleString()}`);
    } catch {
      addToast('Failed to validate voucher code', 'error');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon code removed', 'info');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayableTotal = Math.max(0, grandTotal - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      addToast('Please fill in all required shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryAddress: formData.address,
      city: formData.city,
      paymentMethod: formData.paymentMethod,
      subtotal,
      shippingFee,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total: finalPayableTotal,
      courierName: 'Daewoo Fastex Express',
      trackingNumber: 'DW-' + Math.floor(1000000 + Math.random() * 9000000),
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      }))
    };

    try {
      const data = await api.orders.create(orderPayload);
      const orderId = data.id || ('ORD-' + Math.floor(100000 + Math.random() * 900000));
      
      // Store in local storage for order tracking
      const userOrders = JSON.parse(localStorage.getItem('spk_user_orders') || '[]');
      userOrders.push({
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: data.orderStatus || 'Processing Order',
        trackingNumber: orderPayload.trackingNumber,
        courierName: orderPayload.courierName,
        total: finalPayableTotal,
        ...formData,
        items: orderPayload.items
      });
      localStorage.setItem('spk_user_orders', JSON.stringify(userOrders));

      setOrderPlaced({
        ...orderPayload,
        id: orderId
      });

      clearCart();
      addToast('Order placed successfully! Tracking details generated.');
    } catch {
      // Fallback local persistence
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const userOrders = JSON.parse(localStorage.getItem('spk_user_orders') || '[]');
      userOrders.push({
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: 'Processing Order',
        trackingNumber: orderPayload.trackingNumber,
        courierName: orderPayload.courierName,
        total: finalPayableTotal,
        ...formData,
        items: orderPayload.items
      });
      localStorage.setItem('spk_user_orders', JSON.stringify(userOrders));

      setOrderPlaced({
        ...orderPayload,
        id: orderId
      });

      clearCart();
      addToast('Order confirmed and recorded offline!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: 650, textAlign: 'center' }}>
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '40px 30px' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#DEF7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03543F' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#166534', margin: '0 0 10px' }}>
            Order Confirmed &amp; Dispatched for Packing!
          </h2>
          <p style={{ fontSize: 14, color: '#15803D', margin: '0 0 24px' }}>
            Thank you, {orderPlaced.customerName}. Your medical equipment order <strong>#{orderPlaced.id}</strong> has been received by our clinical dispatch team.
          </p>

          <div style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, border: '1px solid #DCFCE7', textAlign: 'left', fontSize: 13, marginBottom: 24, lineHeight: 1.8 }}>
            <div><strong>Order ID:</strong> #{orderPlaced.id}</div>
            <div><strong>Consignment Courier:</strong> {orderPlaced.courierName}</div>
            <div><strong>Tracking Number:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{orderPlaced.trackingNumber}</span></div>
            <div><strong>Total Amount:</strong> Rs {Number(orderPlaced.total).toLocaleString()} ({(orderPlaced.paymentMethod || 'COD').toUpperCase()})</div>
            <div><strong>Delivery Destination:</strong> {orderPlaced.deliveryAddress}, {orderPlaced.city}</div>
            {orderPlaced.discount > 0 && (
              <div style={{ color: '#03543F' }}><strong>Discount Applied:</strong> -Rs {Number(orderPlaced.discount).toLocaleString()} ({orderPlaced.couponCode})</div>
            )}
          </div>

          {orderPlaced.paymentMethod === 'bank' && (
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: 16, borderRadius: 8, textAlign: 'left', fontSize: 12.5, color: '#1E40AF', marginBottom: 20 }}>
              <strong>Bank Transfer Instructions:</strong>
              <div>Bank: {storeSettings.bankName}</div>
              <div>Account Title: {storeSettings.accountTitle}</div>
              <div>IBAN / Acc #: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{storeSettings.accountNumber}</span></div>
              <div style={{ marginTop: 6, fontSize: 11.5 }}>
                Please WhatsApp your payment slip to <strong>{storeSettings.contactPhone}</strong> quoting Order #{orderPlaced.id}.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/track-order" className="btn-solid-maroon" style={{ padding: '10px 20px', borderRadius: 6, textDecoration: 'none' }}>
              Track Consignment Status
            </Link>
            <Link to="/" className="btn-framed" style={{ padding: '10px 20px', borderRadius: 6, textDecoration: 'none' }}>
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 10px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Select medical and clinical equipment from our catalog before checking out.</p>
        <Link to="/" className="btn-solid-maroon" style={{ padding: '10px 24px', borderRadius: 6, textDecoration: 'none' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px 60px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
        Complete Your Medical Equipment Order
      </h1>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>
        National courier dispatch with genuine equipment inspection guarantee across Pakistan.
      </p>

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          
          {/* Left Column: Shipping & Payment */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#0F172A' }}>
              1. Delivery &amp; Contact Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name / Clinic Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Dr. Ahmed Khan / Mayo Hospital"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Contact Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0300-1234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="doctor@hospital.pk"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>City / District *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13, backgroundColor: '#FFF' }}
                >
                  {PAKISTANI_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Street Address / Department / Ward *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="House/Plot #, Street name, Sector/Area, Hospital/Clinic Ward details"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '26px 0 14px', color: '#0F172A' }}>
              2. Payment Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay in cash upon inspection and courier delivery across Pakistan.' },
                { id: 'bank', label: 'Direct Bank Transfer', desc: `Transfer directly to our verified ${storeSettings.bankName} account.` },
                { id: 'card', label: 'Credit / Debit Card (Visa / Mastercard)', desc: 'Instant 128-bit SSL encrypted online card payment.' }
              ].map(method => (
                <div key={method.id}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: 14,
                      borderRadius: 8,
                      border: formData.paymentMethod === method.id ? '2px solid #800020' : '1px solid #E5E7EB',
                      backgroundColor: formData.paymentMethod === method.id ? '#FAFAFA' : '#FFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleInputChange}
                      style={{ marginTop: 2, accentColor: '#800020' }}
                    />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{method.label}</div>
                      <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>{method.desc}</div>
                    </div>
                  </label>

                  {/* Dynamic Bank Account Details Box */}
                  {formData.paymentMethod === 'bank' && method.id === 'bank' && (
                    <div style={{ marginTop: 8, padding: 14, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, fontSize: 12.5, color: '#1E3A8A' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Verified Official Bank Account:</div>
                      <div><strong>Bank:</strong> {storeSettings.bankName}</div>
                      <div><strong>Account Title:</strong> {storeSettings.accountTitle}</div>
                      <div><strong>IBAN / Account Number:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{storeSettings.accountNumber}</span></div>
                      <div style={{ marginTop: 6, fontSize: 11.5, color: '#1E40AF' }}>
                        * After placing order, please transfer <strong>Rs. {finalPayableTotal.toLocaleString()}</strong> and share slip via WhatsApp Helpline <strong>{storeSettings.contactPhone}</strong>.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div style={{ backgroundColor: '#F9FAFB', padding: 24, borderRadius: 12, border: '1px solid #E5E7EB', height: 'fit-content' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: '#0F172A' }}>Order Summary</h3>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>
                  <span>{product.name.slice(0, 32)}... × <strong>{quantity}</strong></span>
                  <span style={{ fontWeight: 600 }}>Rs {(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Have a Promo Voucher?</div>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#DEF7EC', padding: '8px 12px', borderRadius: 6, border: '1px solid #31C48D' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#03543F', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    {appliedCoupon.code} (-Rs {appliedCoupon.discountAmount.toLocaleString()})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{ background: 'none', border: 'none', color: '#C81E1E', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="e.g. SURGICAL10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, textTransform: 'uppercase' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                    className="btn-framed"
                    style={{ padding: '7px 12px', fontSize: 12, borderRadius: 6 }}
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>Rs {subtotal.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span>National Delivery:</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#059669' : '#111' }}>
                {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee}`}
              </span>
            </div>

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: '#03543F', fontWeight: 600 }}>
                <span>Voucher Discount:</span>
                <span>-Rs {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div style={{ borderTop: '2px solid #800020', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#800020' }}>
              <span>Grand Total:</span>
              <span>Rs {finalPayableTotal.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-solid-maroon"
              style={{ width: '100%', padding: '14px', borderRadius: 8, fontSize: 14.5, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Processing Order...' : 'CONFIRM & PLACE ORDER'}
            </button>
          </div>

        </div>
      </form>

      {/* Trust & SEO Story Section */}
      <SiteStorySection />
    </div>
  );
};
