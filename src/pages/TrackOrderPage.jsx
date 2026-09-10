import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteStorySection } from '../components/common/SiteStorySection';
import { api } from '../services/api';

export const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const query = orderId.trim() || phone.trim();
    if (!query) return;

    setSearched(true);
    setIsLoading(true);

    try {
      // 1. Query Backend REST API
      const order = await api.orders.getById(query);
      if (order) {
        setTrackedOrder(order);
        setIsLoading(false);
        return;
      }
    } catch {
      // 2. Fallback to localStorage
      const userOrders = JSON.parse(localStorage.getItem('spk_user_orders') || '[]');
      const match = userOrders.find(
        o => o.id?.toLowerCase() === query.toLowerCase() ||
             (phone && o.phone?.includes(phone.trim())) ||
             (phone && o.customerPhone?.includes(phone.trim()))
      );
      setTrackedOrder(match || null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="site-container" style={{ padding: '40px 15px 50px', maxWidth: 680 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>
            TRACK YOUR SURGICALS.PK ORDER
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13 }}>
            Enter your Order ID or phone number to check current fulfillment and courier status.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid #ECECEC', marginBottom: 30 }}>
          <form onSubmit={handleTrack}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Order ID</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-98421 or ORD-1001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Billing Phone Number</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #DDD', fontSize: 13 }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-solid-maroon"
                style={{ width: '100%', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 700, marginTop: 6 }}
              >
                {isLoading ? 'SEARCHING REAL-TIME TRACKING...' : 'TRACK STATUS'}
              </button>
            </div>
          </form>
        </div>

        {searched && (
          <div>
            {trackedOrder ? (
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Order #{trackedOrder.id}</h3>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    ● {trackedOrder.orderStatus || trackedOrder.status || 'Dispatched via Daewoo Fastex'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
                  <div><strong>Customer:</strong> {trackedOrder.customerName || trackedOrder.fullName}</div>
                  <div><strong>Delivery Destination:</strong> {trackedOrder.deliveryAddress || trackedOrder.address}, {trackedOrder.city}, Pakistan</div>
                  <div><strong>Total Amount:</strong> Rs {trackedOrder.total?.toLocaleString()} ({(trackedOrder.paymentMethod || 'COD').toUpperCase()})</div>
                  <div><strong>Courier Partner:</strong> {trackedOrder.courierName || 'Daewoo Fastex Express Cargo'}</div>
                  {trackedOrder.trackingNumber && (
                    <div><strong>Courier Tracking No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111' }}>{trackedOrder.trackingNumber}</span></div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', backgroundColor: '#FEF2F2', border: '1px solid #F87171', borderRadius: 8, color: '#991B1B', fontSize: 13 }}>
                No order record matching that ID/Phone was found. Please check details or contact helpline at <strong>0303-7333378</strong>.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
