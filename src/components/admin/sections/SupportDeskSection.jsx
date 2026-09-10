import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const QUICK_TEMPLATES = [
  {
    title: 'Dispatched & Tracking Details',
    category: 'Logistics',
    text: 'Your order has been dispatched via our express courier partner. Tracking number is attached to your file and package is en route.'
  },
  {
    title: 'Address Verification Requested',
    category: 'Logistics',
    text: 'Called customer to verify clinic room number and street landmark. Customer confirmed delivery to reception between 9 AM and 5 PM.'
  },
  {
    title: 'Payment & Bank Transfer Acknowledged',
    category: 'Payment',
    text: 'Customer provided online bank transfer transaction reference. Verified by accounts team and order cleared for dispatch.'
  },
  {
    title: 'Clinical Warranty / Defect Inquiry',
    category: 'Warranty',
    text: 'Inquiry regarding 7-day testing warranty & DRAP compliance certificate. Provided technical support instructions and warranty card info.'
  }
];

export const SupportDeskSection = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'with_notes', 'pending', 'high_value'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteCategory, setNoteCategory] = useState('Logistics');
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch support orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !noteContent.trim()) return;

    const formattedNote = `[${noteCategory}] ${noteContent.trim()}`;

    try {
      setIsAddingNote(true);
      const res = await api.orders.addSupportNote(selectedOrder.id, formattedNote);
      addToast('Internal support note recorded.', 'success');

      const updatedNotes = res.notes || [
        { author: 'Support Desk', note: formattedNote, timestamp: new Date().toISOString() },
        ...(selectedOrder.supportNotes || [])
      ];

      setSelectedOrder({
        ...selectedOrder,
        supportNotes: updatedNotes
      });

      setOrders(prev =>
        prev.map(o => (o.id === selectedOrder.id ? { ...o, supportNotes: updatedNotes } : o))
      );

      setNoteContent('');
    } catch (err) {
      addToast(err.message || 'Failed to add note.', 'error');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      setIsUpdatingStatus(true);
      await api.orders.updateStatus(selectedOrder.id, newStatus);
      addToast(`Order #${selectedOrder.id} status updated to ${newStatus}`, 'success');
      setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      setOrders(prev =>
        prev.map(o => (o.id === selectedOrder.id ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const generateWhatsAppSupport = (o) => {
    const rawPhone = (o.customerPhone || o.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${o.customerName || 'Doctor'}!\n\n` +
      `This is Surgicals.pk Clinical Support regarding your Order #${o.id}.\n` +
      `Status: ${o.orderStatus || 'Processing'}\n` +
      `Total: Rs. ${Number(o.total || 0).toLocaleString()}\n\n` +
      `How may our specialist team assist you today?`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Customer CRM Stats
  const customerStats = useMemo(() => {
    if (!selectedOrder) return null;
    const phone = selectedOrder.customerPhone || '';
    const email = selectedOrder.customerEmail || '';

    const matchingOrders = orders.filter(o => 
      (phone && o.customerPhone === phone) || 
      (email && o.customerEmail === email)
    );

    const totalSpent = matchingOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const count = matchingOrders.length;

    let tier = 'Standard Client';
    if (totalSpent > 50000 || count >= 5) tier = 'Hospital / Institutional Buyer';
    else if (count >= 2) tier = 'Frequent Clinical Buyer';

    return { count, totalSpent, tier };
  }, [selectedOrder, orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
        (o.city && o.city.toLowerCase().includes(q))
      );

      if (!matchesSearch) return false;

      const hasNotes = Array.isArray(o.supportNotes) && o.supportNotes.length > 0;
      const isPending = (o.orderStatus || '').toLowerCase() !== 'delivered' && (o.orderStatus || '').toLowerCase() !== 'cancelled';
      const isHighValue = Number(o.total || 0) >= 20000;

      if (filterTab === 'with_notes') return hasNotes;
      if (filterTab === 'pending') return isPending;
      if (filterTab === 'high_value') return isHighValue;
      return true;
    });
  }, [orders, searchQuery, filterTab]);

  return (
    <div className="admin-content-section" style={{ animation: 'fadeIn 0.2s ease-in' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: '#0F172A' }}>
              Customer Support &amp; Clinical Inquiries Desk
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: 6, border: '1px solid #BFDBFE' }}>
              Support Operations
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Omnichannel ticket management, customer CRM insights, WhatsApp escalation, and audit logging.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="btn-framed"
          style={{ padding: '7px 16px', fontSize: 12.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh Inquiries
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Inquiries (${orders.length})` },
            { id: 'pending', label: `Active / Unresolved` },
            { id: 'with_notes', label: `With Support Notes` },
            { id: 'high_value', label: `Hospital / High Value (≥ 20k)` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: filterTab === tab.id ? 700 : 500,
                borderRadius: 6,
                border: filterTab === tab.id ? '1px solid #800020' : '1px solid #E2E8F0',
                backgroundColor: filterTab === tab.id ? '#800020' : '#FFF',
                color: filterTab === tab.id ? '#FFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 320 }}>
          <input
            type="text"
            placeholder="Search customer, phone, or order ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 30px 7px 10px',
              fontSize: 12.5,
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFF'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Support Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? 'minmax(320px, 420px) 1fr' : '1fr', gap: 20 }}>
        {/* Left Column: Orders List */}
        <div style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: 700, fontSize: 13, color: '#334155' }}>
            Inquiry Queue ({filteredOrders.length})
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              Loading inquiries...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              No inquiries found in this view.
            </div>
          ) : (
            <div style={{ maxHeight: 620, overflowY: 'auto' }}>
              {filteredOrders.map(order => {
                const isSelected = selectedOrder && selectedOrder.id === order.id;
                const notesCount = (order.supportNotes && order.supportNotes.length) || 0;
                const isDelivered = (order.orderStatus || '').toLowerCase() === 'delivered';

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFF',
                      borderLeft: isSelected ? '4px solid #1E40AF' : '4px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>#{order.id}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isDelivered ? '#DEF7EC' : '#FEF3C7',
                        color: isDelivered ? '#03543F' : '#92400E',
                        padding: '2px 7px',
                        borderRadius: 4
                      }}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E293B' }}>{order.customerName}</div>
                    
                    <div style={{ fontSize: 12, color: '#64748B', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span>Phone: {order.customerPhone}</span>
                      <span style={{ fontWeight: 600, color: '#059669' }}>Rs. {Number(order.total || 0).toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 11 }}>
                      <span style={{ color: '#94A3B8' }}>{order.city || 'Pakistan'}</span>
                      {notesCount > 0 ? (
                        <span style={{ color: '#2563EB', fontWeight: 600, backgroundColor: '#DBEAFE', padding: '1px 6px', borderRadius: 4 }}>
                          {notesCount} Note{notesCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>No notes</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Order CRM & Support Thread */}
        {selectedOrder ? (
          <div style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {/* Header & Quick Status Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, borderBottom: '1px solid #F1F5F9', paddingBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Order #{selectedOrder.id}
                  </h3>
                  <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, backgroundColor: '#F1F5F9', color: '#475569' }}>
                    Placed: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Change Status Dropdown */}
                <select
                  value={selectedOrder.orderStatus || 'Pending'}
                  disabled={isUpdatingStatus}
                  onChange={e => handleUpdateOrderStatus(e.target.value)}
                  style={{ fontSize: 12, padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontWeight: 600, backgroundColor: '#FFF' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  title="Close details"
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Customer CRM Profile Card */}
            {customerStats && (
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Customer Profile &amp; CRM
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                      {selectedOrder.customerName}
                    </div>
                  </div>

                  <span style={{ fontSize: 11.5, fontWeight: 700, backgroundColor: '#DEF7EC', color: '#03543F', padding: '3px 8px', borderRadius: 6 }}>
                    {customerStats.tier}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, fontSize: 12.5, color: '#334155' }}>
                  <div>
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${selectedOrder.customerPhone}`} style={{ color: '#0284C7', textDecoration: 'none', fontWeight: 600 }}>
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </div>
                  )}
                  <div>
                    <strong>Order History:</strong> {customerStats.count} total order(s)
                  </div>
                  <div>
                    <strong>Lifetime Spend:</strong> Rs. {customerStats.totalSpent.toLocaleString()}
                  </div>
                </div>

                {/* Direct Action Launchers */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      backgroundColor: '#FFF',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Call Customer
                  </a>

                  <a
                    href={generateWhatsAppSupport(selectedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      backgroundColor: '#25D366',
                      color: '#FFF',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>
            )}

            {/* Consignment Items Summary */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                Consignment Contents
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 800, paddingTop: 6 }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#059669' }}>Rs. {Number(selectedOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Response Templates Dropdown */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase', marginBottom: 4 }}>
                Insert Support Quick Response
              </label>
              <select
                onChange={e => {
                  const tmpl = QUICK_TEMPLATES.find(t => t.title === e.target.value);
                  if (tmpl) {
                    setNoteCategory(tmpl.category);
                    setNoteContent(tmpl.text);
                  }
                }}
                defaultValue=""
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, backgroundColor: '#FFF' }}
              >
                <option value="" disabled>-- Select Quick Template --</option>
                {QUICK_TEMPLATES.map(t => (
                  <option key={t.title} value={t.title}>[{t.category}] {t.title}</option>
                ))}
              </select>
            </div>

            {/* Add Support Note Form */}
            <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <select
                  value={noteCategory}
                  onChange={e => setNoteCategory(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, fontWeight: 600 }}
                >
                  <option value="Logistics">Logistics</option>
                  <option value="Payment">Payment</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Clinical Specs">Clinical Specs</option>
                  <option value="General">General</option>
                </select>

                <textarea
                  rows={3}
                  required
                  placeholder="Record internal customer note, warranty claim detail, or dispatch resolution..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: 6,
                    fontSize: 12.5,
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isAddingNote || !noteContent.trim()}
                  className="btn-solid-maroon"
                  style={{ padding: '7px 16px', fontSize: 12.5, borderRadius: 6 }}
                >
                  {isAddingNote ? 'Saving...' : 'Add Support Note'}
                </button>
              </div>
            </form>

            {/* Support Notes Log Thread */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 10 }}>
                Audit Thread &amp; Support Notes ({(selectedOrder.supportNotes && selectedOrder.supportNotes.length) || 0})
              </div>

              <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedOrder.supportNotes && selectedOrder.supportNotes.length > 0) ? (
                  selectedOrder.supportNotes.map((note, idx) => (
                    <div key={idx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: '#1E293B' }}>{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4 }}>
                        {note.note}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', padding: 14, backgroundColor: '#F8FAFC', borderRadius: 6 }}>
                    No support notes logged yet for this order.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px dashed #CBD5E1', padding: 40, color: '#64748B', fontSize: 13.5 }}>
            Select any inquiry from the left queue to view customer CRM history, WhatsApp escalation, and notes.
          </div>
        )}
      </div>
    </div>
  );
};
