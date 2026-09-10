import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const PromoBannersSection = () => {
  const { addToast } = useToast();
  const [announcementText, setAnnouncementText] = useState('');
  const [promoVouchers, setPromoVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: '', minOrder: 1000, status: 'Active' });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    setIsLoading(true);
    try {
      const data = await api.cms.getPromos();
      setAnnouncementText(data.announcementText || '');
      setPromoVouchers(data.vouchers || []);
    } catch (err) {
      addToast('Failed to load promo data: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    try {
      await api.cms.updatePromos({ announcementText, vouchers: promoVouchers });
      addToast('Storefront announcement bar updated successfully!');
    } catch (err) {
      addToast('Failed to update announcement: ' + err.message, 'error');
    }
  };

  const handleAddVoucher = async (e) => {
    e.preventDefault();
    if (!newVoucher.code || !newVoucher.discount) {
      addToast('Please provide both voucher code and discount value', 'error');
      return;
    }
    const updatedVouchers = [...promoVouchers, { ...newVoucher, code: newVoucher.code.toUpperCase().trim() }];
    try {
      await api.cms.updatePromos({ announcementText, vouchers: updatedVouchers });
      setPromoVouchers(updatedVouchers);
      setNewVoucher({ code: '', discount: '', minOrder: 1000, status: 'Active' });
      setShowAddVoucher(false);
      addToast(`Promo voucher "${newVoucher.code.toUpperCase()}" added!`);
    } catch (err) {
      addToast('Failed to add voucher: ' + err.message, 'error');
    }
  };

  const handleDeleteVoucher = async (code) => {
    if (!window.confirm(`Delete voucher code "${code}"?`)) return;
    const updatedVouchers = promoVouchers.filter(v => v.code !== code);
    try {
      await api.cms.updatePromos({ announcementText, vouchers: updatedVouchers });
      setPromoVouchers(updatedVouchers);
      addToast(`Voucher "${code}" removed.`);
    } catch (err) {
      addToast('Failed to remove voucher: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #E2E8F0' }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', color: '#0F172A' }}>Promotional Banners &amp; Vouchers</h3>
      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
        Manage top announcement bar alerts and checkout discount vouchers.
      </p>

      {/* Announcement Marquee Editor */}
      <div style={{ marginBottom: 24, padding: 18, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
        <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#0F172A' }}>
          Storefront Top Announcement Bar
        </label>
        <input
          type="text"
          value={announcementText}
          onChange={e => setAnnouncementText(e.target.value)}
          placeholder="Enter top marquee announcement banner text..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, backgroundColor: '#FFFFFF' }}
        />
        <button
          type="button"
          onClick={handleSaveAnnouncement}
          className="btn-solid-maroon"
          style={{ marginTop: 10, padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}
        >
          Save Announcement
        </button>
      </div>

      {/* Active Promo Codes */}
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
            Active Promo Vouchers ({promoVouchers.length})
          </span>
          <button
            type="button"
            onClick={() => setShowAddVoucher(!showAddVoucher)}
            className="btn-framed"
            style={{ padding: '4px 10px', fontSize: 12, borderRadius: 4 }}
          >
            {showAddVoucher ? 'Close Form' : '+ Add Voucher'}
          </button>
        </div>

        {showAddVoucher && (
          <form onSubmit={handleAddVoucher} style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #CBD5E1', marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. SAVE20"
                value={newVoucher.code}
                onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #D1D5DB', fontSize: 12, textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Discount Text *</label>
              <input
                type="text"
                required
                placeholder="e.g. 20% OFF or Rs 500"
                value={newVoucher.discount}
                onChange={e => setNewVoucher({ ...newVoucher, discount: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Min Order (PKR)</label>
              <input
                type="number"
                value={newVoucher.minOrder}
                onChange={e => setNewVoucher({ ...newVoucher, minOrder: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <button type="submit" className="btn-solid-maroon" style={{ padding: '8px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                Save
              </button>
            </div>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#64748B' }}>Loading vouchers...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 14px' }}>Coupon Code</th>
                  <th style={{ padding: '10px 14px' }}>Discount Value</th>
                  <th style={{ padding: '10px 14px' }}>Minimum Order</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoVouchers.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#800020', fontFamily: 'monospace' }}>{v.code}</td>
                    <td style={{ padding: '12px 14px', color: '#0F172A', fontWeight: 600 }}>{v.discount}</td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>Rs {Number(v.minOrder || 0).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteVoucher(v.code)}
                        style={{ background: 'none', border: 'none', color: '#BE123C', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
