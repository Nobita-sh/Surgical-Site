import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const DeliveryDispatchSection = () => {
  const { addToast } = useToast();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'out', 'completed', 'all'
  const [selectedExceptionOrder, setSelectedExceptionOrder] = useState(null);
  const [exceptionReason, setExceptionReason] = useState('Customer Phone Unanswered');
  const [exceptionDetail, setExceptionDetail] = useState('');

  const fetchAssignedDeliveries = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setAssignedOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(err.message || 'Failed to load assigned deliveries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus, customNote) => {
    try {
      setUpdatingId(orderId);
      const note = customNote || deliveryNote[orderId] || '';
      await api.orders.updateDeliveryStatus(orderId, {
        status: newStatus,
        deliveryNotes: note
      });
      addToast(`Order ${orderId} marked as ${newStatus}!`, 'success');
      setDeliveryNote(prev => ({ ...prev, [orderId]: '' }));
      fetchAssignedDeliveries();
    } catch (err) {
      addToast(err.message || 'Failed to update delivery status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRecordException = async (e) => {
    e.preventDefault();
    if (!selectedExceptionOrder) return;
    const fullNote = `[Delivery Exception: ${exceptionReason}] ${exceptionDetail ? '- ' + exceptionDetail : ''}`;
    await handleUpdateStatus(selectedExceptionOrder.id, 'Delivery Attempted', fullNote);
    setSelectedExceptionOrder(null);
    setExceptionDetail('');
  };

  const handleQuickNoteChip = (orderId, chipText) => {
    setDeliveryNote(prev => ({
      ...prev,
      [orderId]: prev[orderId] ? `${prev[orderId]} | ${chipText}` : chipText
    }));
  };

  const generateRiderWhatsApp = (o) => {
    const rawPhone = (o.customerPhone || o.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${o.customerName || 'Valued Client'}!\n\n` +
      `Your Surgicals.pk delivery rider is on the way to your address:\n` +
      `*Order ID:* ${o.id}\n` +
      `*Address:* ${o.deliveryAddress || 'Address on file'}, ${o.city || 'Pakistan'}\n` +
      `*COD Total to Collect:* Rs. ${Number(o.total || 0).toLocaleString()}\n\n` +
      `Please ensure someone is available to receive the medical consignment. Thank you!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Calculations & Financial Metrics
  const metrics = useMemo(() => {
    let pendingCount = 0;
    let outCount = 0;
    let completedCount = 0;
    let pendingCod = 0;
    let collectedCod = 0;

    assignedOrders.forEach(o => {
      const amt = Number(o.total || 0);
      const st = (o.orderStatus || '').toLowerCase();
      if (st === 'delivered') {
        completedCount++;
        collectedCod += amt;
      } else {
        pendingCount++;
        pendingCod += amt;
        if (st === 'out for delivery') {
          outCount++;
        }
      }
    });

    const total = assignedOrders.length;
    const rate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return { pendingCount, outCount, completedCount, pendingCod, collectedCod, total, rate };
  }, [assignedOrders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    return assignedOrders.filter(o => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(q)) ||
        (o.city && o.city.toLowerCase().includes(q))
      );

      if (!matchesSearch) return false;

      const st = (o.orderStatus || '').toLowerCase();
      if (activeTab === 'active') return st !== 'delivered';
      if (activeTab === 'out') return st === 'out for delivery';
      if (activeTab === 'completed') return st === 'delivered';
      return true; // 'all'
    });
  }, [assignedOrders, searchQuery, activeTab]);

  return (
    <div className="admin-content-section" style={{ animation: 'fadeIn 0.2s ease-in' }}>
      {/* Top Header & Fast Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: '#0F172A' }}>
              Delivery Dispatch & Rider Operations
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: 6, border: '1px solid #BFDBFE' }}>
              Field Operations
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Live consignment routing, route navigation, recipient alerts, and COD cash reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-framed"
            style={{ padding: '7px 14px', fontSize: 12.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Run-Sheet
          </button>
          <button
            type="button"
            onClick={fetchAssignedDeliveries}
            className="btn-solid-maroon"
            style={{ padding: '7px 16px', fontSize: 12.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Refresh Schedule
          </button>
        </div>
      </div>

      {/* Cash Collection & Dispatch Reconciliation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 22 }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Consignments
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
            {metrics.pendingCount} <span style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>({metrics.outCount} en route)</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            COD Cash In Field (Pending)
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            Rs. {metrics.pendingCod.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            COD Cash Collected (Delivered)
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 4 }}>
            Rs. {metrics.collectedCod.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Delivery Success Rate
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563EB', marginTop: 4 }}>
            {metrics.rate}% <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>({metrics.completedCount}/{metrics.total})</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'active', label: `Active Queue (${metrics.pendingCount})` },
            { id: 'out', label: `Out for Delivery (${metrics.outCount})` },
            { id: 'completed', label: `Completed & Reconciled (${metrics.completedCount})` },
            { id: 'all', label: `All Consignments (${metrics.total})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderRadius: 6,
                border: activeTab === tab.id ? '1px solid #800020' : '1px solid #E2E8F0',
                backgroundColor: activeTab === tab.id ? '#800020' : '#FFF',
                color: activeTab === tab.id ? '#FFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            placeholder="Search address, phone, ID..."
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

      {/* Main Delivery Cards Grid */}
      {loading ? (
        <div style={{ backgroundColor: '#fff', padding: 50, borderRadius: 10, border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
          Loading active delivery run-sheet...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: 50, borderRadius: 10, border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
          No consignments found in this view.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18, marginBottom: 30 }}>
          {filteredOrders.map(order => {
            const isDelivered = (order.orderStatus || '').toLowerCase() === 'delivered';
            const isOut = (order.orderStatus || '').toLowerCase() === 'out for delivery';
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.deliveryAddress || ''}, ${order.city || 'Pakistan'}`)}`;

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#fff',
                  border: isOut ? '2px solid #2563EB' : isDelivered ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: 18,
                  boxShadow: isOut ? '0 4px 12px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Top Bar: Order ID & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 14.5, color: '#0F172A' }}>#{order.id}</span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      backgroundColor: isDelivered ? '#DEF7EC' : isOut ? '#DBEAFE' : '#FEF3C7',
                      color: isDelivered ? '#03543F' : isOut ? '#1E40AF' : '#92400E',
                      padding: '3px 9px',
                      borderRadius: 6
                    }}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </div>

                  {/* Recipient & Contact Details */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      {order.customerName || 'Valued Recipient'}
                    </div>

                    {/* Delivery Address & 1-Click Map */}
                    <div style={{ fontSize: 13, color: '#334155', margin: '6px 0 10px', lineHeight: 1.5 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{order.deliveryAddress || 'Address on file'}, <strong>{order.city || 'Pakistan'}</strong></span>
                      </div>
                    </div>

                    {/* Rider Contact Shortcuts */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${order.customerPhone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          color: '#0F172A',
                          padding: '5px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Call ({order.customerPhone})
                      </a>

                      <a
                        href={generateRiderWhatsApp(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          backgroundColor: '#25D366',
                          color: '#FFF',
                          padding: '5px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        Notify via WhatsApp
                      </a>

                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#1E40AF',
                          padding: '5px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        Maps Route
                      </a>
                    </div>
                  </div>

                  {/* Financial COD Card */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>COD CASH TO COLLECT</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: '#059669', marginTop: 1 }}>
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: '#64748B' }}>
                      <strong>{order.items?.length || 1} item(s)</strong>
                      <div>{order.paymentMethod || 'Cash on Delivery'}</div>
                    </div>
                  </div>

                  {/* Quick Note Chips */}
                  {!isDelivered && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>
                        Quick Handoff Tag:
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                        {['Handed to Reception', 'Received by Doctor', 'Cash Collected in Full', 'Paid Online'].map(chip => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleQuickNoteChip(order.id, chip)}
                            style={{
                              fontSize: 10.5,
                              padding: '3px 7px',
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              borderRadius: 4,
                              color: '#334155',
                              cursor: 'pointer'
                            }}
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Handoff note (e.g. Given to Dr. Tariq / Cash in full)..."
                        value={deliveryNote[order.id] || ''}
                        onChange={e => setDeliveryNote({ ...deliveryNote, [order.id]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          border: '1px solid #CBD5E1',
                          borderRadius: 6,
                          fontSize: 12
                        }}
                      />
                    </div>
                  )}

                  {/* Existing Delivery Note if already marked */}
                  {order.deliveryNotes && (
                    <div style={{ fontSize: 12, color: '#065F46', backgroundColor: '#ECFDF5', padding: '6px 10px', borderRadius: 6, marginBottom: 12 }}>
                      <strong>Handoff Confirmation:</strong> {order.deliveryNotes}
                    </div>
                  )}
                </div>

                {/* Bottom Action Triggers */}
                {!isDelivered && (
                  <div style={{ display: 'grid', gridTemplateColumns: isOut ? '1fr 1fr' : '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
                    {!isOut && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                        disabled={updatingId === order.id}
                        style={{
                          backgroundColor: '#2563EB',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: 6,
                          padding: '9px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Start Trip
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedExceptionOrder(order)}
                      style={{
                        backgroundColor: '#FFF',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        borderRadius: 6,
                        padding: '9px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Reschedule
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                      disabled={updatingId === order.id}
                      style={{
                        backgroundColor: '#059669',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: 6,
                        padding: '9px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Mark Delivered
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Exception / Reschedule Modal */}
      {selectedExceptionOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 24,
            maxWidth: 480,
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
              Log Delivery Exception / Reschedule
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Record reason for delayed or unfulfilled attempt on Order #{selectedExceptionOrder.id}.
            </p>

            <form onSubmit={handleRecordException} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Exception Reason *
                </label>
                <select
                  value={exceptionReason}
                  onChange={e => setExceptionReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option value="Customer Phone Unanswered">Customer Phone Unanswered / Switched Off</option>
                  <option value="Hospital / Clinic Gate Closed">Hospital / Clinic Gate Closed</option>
                  <option value="Recipient Requested Later Slot">Recipient Requested Later Slot Today</option>
                  <option value="Incomplete Address / Location Unreachable">Incomplete Address / Location Unreachable</option>
                  <option value="Cash Not Arranged">Cash Not Arranged by Recipient</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g., Called three times at 2:30 PM, guard said doctor is in OT until 5 PM..."
                  value={exceptionDetail}
                  onChange={e => setExceptionDetail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setSelectedExceptionOrder(null)}
                  className="btn-framed"
                  style={{ padding: '8px 16px', fontSize: 13, borderRadius: 6 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Record Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
