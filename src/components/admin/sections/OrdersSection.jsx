import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

export const OrdersSection = ({
  orders = [],
  isLoading = false,
  onRefresh,
  onStatusChange,
  onUpdateOrder
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ courierName: 'Daewoo Fastex', trackingNumber: '', courierStaffId: '' });
  const [courierStaffList, setCourierStaffList] = useState([]);

  useEffect(() => {
    api.staff.getAll()
      .then(list => {
        if (Array.isArray(list)) {
          setCourierStaffList(list.filter(s => s.permissions && s.permissions.includes('delivery') && s.status === 'active'));
        }
      })
      .catch(() => {});
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter by status tab & search query
  const filteredOrders = safeOrders.filter(o => {
    const status = (o.orderStatus || o.status || 'Pending').toLowerCase();
    let matchesTab = true;
    if (selectedStatusTab === 'pending') matchesTab = status.includes('pending');
    else if (selectedStatusTab === 'processing') matchesTab = status.includes('processing');
    else if (selectedStatusTab === 'dispatched') matchesTab = status.includes('dispatched');
    else if (selectedStatusTab === 'delivered') matchesTab = status.includes('delivered');
    else if (selectedStatusTab === 'cancelled') matchesTab = status.includes('cancelled');

    const query = search.toLowerCase();
    const matchesSearch = !search ||
      String(o.id).toLowerCase().includes(query) ||
      (o.customerName || o.fullName || '').toLowerCase().includes(query) ||
      (o.customerPhone || o.phone || '').includes(query) ||
      (o.city || '').toLowerCase().includes(query) ||
      (o.trackingNumber || '').toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const countByStatus = (keyword) => {
    if (!keyword) return safeOrders.length;
    return safeOrders.filter(o => (o.orderStatus || o.status || '').toLowerCase().includes(keyword)).length;
  };

  const getStatusBadge = (status = 'Processing') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return { bg: '#DEF7EC', text: '#03543F' };
    if (s.includes('dispatched')) return { bg: '#E1EFFE', text: '#1E429F' };
    if (s.includes('cancelled')) return { bg: '#FDE8E8', text: '#9B1C1C' };
    return { bg: '#FEF08A', text: '#713F12' }; // Pending / Processing
  };

  const openTrackingEditor = (order) => {
    setEditingTrackingId(order.id);
    setTrackingForm({
      courierName: order.assignedCourierName || order.courierName || 'Daewoo Fastex',
      trackingNumber: order.trackingNumber || '',
      courierStaffId: order.assignedCourierId || ''
    });
  };

  const saveTracking = async (orderId) => {
    try {
      if (trackingForm.courierStaffId) {
        const rider = courierStaffList.find(s => s.id === trackingForm.courierStaffId);
        await api.orders.assignCourier(orderId, {
          courierId: trackingForm.courierStaffId,
          courierName: rider ? rider.name : trackingForm.courierName,
          trackingNumber: trackingForm.trackingNumber
        });
        if (onRefresh) onRefresh();
      } else if (onUpdateOrder) {
        await onUpdateOrder(orderId, trackingForm);
      }
    } catch {
      // Fallback update
      if (onUpdateOrder) await onUpdateOrder(orderId, trackingForm);
    }
    setEditingTrackingId(null);
  };

  const generateWhatsAppMessage = (o) => {
    const phone = (o.customerPhone || o.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum ${o.customerName || 'Valued Customer'}!\n\nYour Surgicals.pk order #${o.id} has been dispatched.\n\n` +
      `*Courier:* ${o.courierName || 'TCS Express / Daewoo Fastex'}\n` +
      `*Tracking #:* ${o.trackingNumber || 'Pending Tracking'}\n` +
      `*Total Amount:* Rs. ${Number(o.total || 0).toLocaleString()}\n\n` +
      `You can track your order at: https://surgicals.pk/track-order\nThank you for choosing Surgicals.pk!`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'City',
      'Delivery Address',
      'Payment Method',
      'Payment Status',
      'Total (PKR)',
      'Courier Partner',
      'Tracking Number',
      'Order Status'
    ];

    const rows = filteredOrders.map(o => [
      `"${o.id || ''}"`,
      `"${o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}"`,
      `"${(o.customerName || o.fullName || '').replace(/"/g, '""')}"`,
      `"${(o.customerPhone || o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
      `"${(o.city || '').replace(/"/g, '""')}"`,
      `"${(o.deliveryAddress || o.address || '').replace(/"/g, '""')}"`,
      `"${(o.paymentMethod || 'COD').toUpperCase()}"`,
      `"${(o.paymentStatus || 'Pending')}"`,
      `"${Number(o.total || 0)}"`,
      `"${(o.courierName || 'Daewoo Fastex').replace(/"/g, '""')}"`,
      `"${(o.trackingNumber || '').replace(/"/g, '""')}"`,
      `"${(o.orderStatus || o.status || 'Processing')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `surgicals_pk_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #E2E8F0' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            Customer Orders &amp; Fulfillment
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '3px 0 0' }}>
            Manage order dispatch, couriers, payment verification, and generate official customer invoices.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-solid-maroon"
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Export Orders (CSV)
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="btn-framed"
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6 }}
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* 2. Order Pipeline Status Tabs & Search Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${countByStatus('')})` },
            { id: 'pending', label: `Pending (${countByStatus('pending')})` },
            { id: 'processing', label: `Processing (${countByStatus('processing')})` },
            { id: 'dispatched', label: `Dispatched (${countByStatus('dispatched')})` },
            { id: 'delivered', label: `Delivered (${countByStatus('delivered')})` },
            { id: 'cancelled', label: `Cancelled (${countByStatus('cancelled')})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatusTab(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: selectedStatusTab === tab.id ? '1px solid #800020' : '1px solid #E2E8F0',
                backgroundColor: selectedStatusTab === tab.id ? '#800020' : '#F8FAFC',
                color: selectedStatusTab === tab.id ? '#FFFFFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <input
          type="text"
          placeholder="Search Order ID, Name, Phone, City..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '7px 14px',
            borderRadius: 6,
            border: '1px solid #CBD5E1',
            fontSize: 12.5,
            minWidth: 260,
            outline: 'none'
          }}
        />
      </div>

      {/* 3. Orders List */}
      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
          Loading orders from database...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px dashed #CBD5E1' }}>
          <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
            No orders found matching this filter criteria.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredOrders.map(o => {
            const badge = getStatusBadge(o.orderStatus || o.status);
            const isEditingThisTracking = editingTrackingId === o.id;

            return (
              <div key={o.id} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, backgroundColor: '#FAFAFA', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                
                {/* Card Top: Order ID, Date & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong style={{ fontSize: 16, color: '#0F172A' }}>Order #{o.id}</strong>
                    <span style={{ fontSize: 12, color: '#64748B' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Recent'}
                    </span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.text
                    }}>
                      {o.orderStatus || o.status || 'Processing'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {/* Status Changer */}
                    <select
                      value={o.orderStatus || o.status || 'Processing'}
                      onChange={(e) => onStatusChange(o.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, backgroundColor: '#FFFFFF', fontWeight: 600 }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing Order">Processing Order</option>
                      <option value="Dispatched via Daewoo Fastex">Dispatched via Daewoo Fastex</option>
                      <option value="Dispatched via TCS">Dispatched via TCS</option>
                      <option value="Dispatched via Leopards">Dispatched via Leopards</option>
                      <option value="Dispatched via Trax">Dispatched via Trax</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Print Invoice Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(o)}
                      className="btn-framed"
                      style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      Invoice
                    </button>

                    {/* WhatsApp Customer Alert */}
                    <a
                      href={generateWhatsAppMessage(o)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-framed"
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        borderRadius: 6,
                        backgroundColor: '#25D366',
                        color: '#FFF',
                        borderColor: '#25D366',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      WhatsApp Customer
                    </a>
                  </div>
                </div>

                {/* Card Middle: Customer, Address & Financials */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>CUSTOMER INFO</div>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{o.customerName || o.fullName || 'Valued Customer'}</div>
                    <div>Phone: {o.customerPhone || o.phone || 'No phone'}</div>
                    {o.customerEmail && <div>Email: {o.customerEmail}</div>}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>DELIVERY DESTINATION</div>
                    <div style={{ fontWeight: 600, color: '#0F172A', marginTop: 2 }}>{o.city || 'Pakistan'}</div>
                    <div style={{ color: '#475569' }}>{o.deliveryAddress || o.address || 'Address on file'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>PAYMENT &amp; LOGISTICS</div>
                    <div>
                      <strong>Method:</strong> {(o.paymentMethod || 'COD').toUpperCase()} &bull;{' '}
                      <span style={{ fontWeight: 700, color: o.paymentStatus === 'Paid' ? '#03543F' : '#800020' }}>
                        {o.paymentStatus || 'Payment Pending'}
                      </span>
                    </div>
                    <div>
                      <strong>Total:</strong> <span style={{ fontSize: 15, fontWeight: 800, color: '#800020' }}>Rs. {Number(o.total || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Courier & Tracking Line */}
                    <div style={{ marginTop: 4 }}>
                      {isEditingThisTracking ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <select
                              value={trackingForm.courierStaffId || trackingForm.courierName}
                              onChange={e => {
                                const val = e.target.value;
                                const selectedRider = courierStaffList.find(s => s.id === val);
                                if (selectedRider) {
                                  setTrackingForm({ ...trackingForm, courierStaffId: selectedRider.id, courierName: selectedRider.name });
                                } else {
                                  setTrackingForm({ ...trackingForm, courierStaffId: '', courierName: val });
                                }
                              }}
                              style={{ fontSize: 11, padding: '4px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}
                            >
                              <optgroup label="Third-Party Logistics">
                                <option value="Daewoo Fastex">Daewoo Fastex</option>
                                <option value="TCS Express">TCS Express</option>
                                <option value="Leopards Courier">Leopards Courier</option>
                                <option value="Trax Logistics">Trax</option>
                              </optgroup>
                              {courierStaffList.length > 0 && (
                                <optgroup label="Operations Delivery Riders">
                                  {courierStaffList.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.phone || 'Staff'})</option>
                                  ))}
                                </optgroup>
                              )}
                            </select>
                            <input
                              type="text"
                              placeholder="Tracking #"
                              value={trackingForm.trackingNumber}
                              onChange={e => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                              style={{ fontSize: 11, padding: '4px 6px', width: 90, borderRadius: 4, border: '1px solid #CBD5E1' }}
                            />
                            <button
                              type="button"
                              onClick={() => saveTracking(o.id)}
                              style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, backgroundColor: '#800020', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTrackingId(null)}
                              style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, backgroundColor: '#E2E8F0', color: '#334155', border: 'none', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>
                              <strong>Courier:</strong> {o.assignedCourierName ? o.assignedCourierName : (o.courierName || 'Daewoo Fastex')} ({o.trackingNumber || 'Unassigned'})
                            </span>
                            <button
                              type="button"
                              onClick={() => openTrackingEditor(o)}
                              style={{ background: 'none', border: 'none', color: '#1E429F', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              Edit / Assign
                            </button>
                          </div>
                          {o.deliveryNotes && (
                            <div style={{ fontSize: 11, color: '#047857', backgroundColor: '#ECFDF5', padding: '3px 6px', borderRadius: 4 }}>
                              <strong>Delivery Note:</strong> {o.deliveryNotes}
                            </div>
                          )}
                          {Array.isArray(o.supportNotes) && o.supportNotes.length > 0 && (
                            <div style={{ fontSize: 11, color: '#1E40AF', backgroundColor: '#EFF6FF', padding: '3px 6px', borderRadius: 4 }}>
                              <strong>Latest Support Note:</strong> {o.supportNotes[0].note} <span style={{ color: '#64748B' }}>({o.supportNotes[0].author})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Order Items List */}
                {Array.isArray(o.items) && o.items.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed #E2E8F0', fontSize: 12, color: '#475569' }}>
                    <strong>Ordered Items ({o.items.length}):</strong>{' '}
                    {o.items.map((item, i) => (
                      <span key={i} style={{ display: 'inline-block', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 4, margin: '2px 4px' }}>
                        {item.name} &times; <strong>{item.quantity}</strong> (Rs {Number(item.price || 0).toLocaleString()})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Professional Printable Customer Invoice Modal */}
      {selectedInvoiceOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            width: '100%',
            maxWidth: 750,
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: 32,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #EEE', paddingBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#64748B' }}>
                CUSTOMER SALES INVOICE &amp; DISPATCH SLIP
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-solid-maroon"
                  style={{ padding: '6px 14px', fontSize: 12.5, borderRadius: 6 }}
                >
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="btn-framed"
                  style={{ padding: '6px 12px', fontSize: 12.5, borderRadius: 6 }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div id="printable-invoice" style={{ color: '#111', fontFamily: 'sans-serif' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #800020', paddingBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#800020', margin: 0 }}>
                    SURGICALS.PK
                  </h2>
                  <p style={{ fontSize: 12, color: '#444', margin: '4px 0 0', lineHeight: 1.4 }}>
                    Hospital, Diagnostic &amp; Rehabilitation Equipment<br />
                    Surgical Market, Railway Road / Nishtar Road, Lahore, Pakistan<br />
                    Helpline: 0303-7333378 &bull; NTN: 8192041-3
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>OFFICIAL INVOICE</h3>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#800020', marginTop: 4 }}>
                    #{selectedInvoiceOrder.id}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    Date: {selectedInvoiceOrder.createdAt ? new Date(selectedInvoiceOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, margin: '20px 0', fontSize: 13 }}>
                <div style={{ padding: 14, backgroundColor: '#F9FAFB', borderRadius: 8, border: '1px solid #ECECEC' }}>
                  <strong style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>BILLED &amp; SHIPPED TO:</strong>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedInvoiceOrder.customerName || selectedInvoiceOrder.fullName}</div>
                  <div>Phone: {selectedInvoiceOrder.customerPhone || selectedInvoiceOrder.phone}</div>
                  <div>{selectedInvoiceOrder.deliveryAddress || selectedInvoiceOrder.address}</div>
                  <div><strong>City:</strong> {selectedInvoiceOrder.city || 'Pakistan'}</div>
                </div>

                <div style={{ padding: 14, backgroundColor: '#F9FAFB', borderRadius: 8, border: '1px solid #ECECEC' }}>
                  <strong style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>DISPATCH LOGISTICS:</strong>
                  <div><strong>Payment Method:</strong> {(selectedInvoiceOrder.paymentMethod || 'COD').toUpperCase()}</div>
                  <div><strong>Payment Status:</strong> {selectedInvoiceOrder.paymentStatus || 'Payment on Delivery'}</div>
                  <div><strong>Courier Partner:</strong> {selectedInvoiceOrder.courierName || 'Daewoo Fastex / TCS Express'}</div>
                  <div><strong>Tracking Consignment:</strong> {selectedInvoiceOrder.trackingNumber || 'DW-7829104'}</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '20px 0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#800020', color: '#FFF', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>#</th>
                    <th style={{ padding: '10px 12px' }}>Item Description</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedInvoiceOrder.items) && selectedInvoiceOrder.items.map((item, idx) => {
                    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '10px 12px', color: '#666' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>Rs {Number(item.price || 0).toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>Rs {itemTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Calculation Summary */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <div style={{ width: 280, fontSize: 13, lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <strong>Rs. {Number(selectedInvoiceOrder.subtotal || selectedInvoiceOrder.total || 0).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping Courier Fee:</span>
                    <span>Rs. {Number(selectedInvoiceOrder.shippingFee || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #800020', paddingTop: 6, marginTop: 6, fontSize: 16, color: '#800020' }}>
                    <strong>Grand Total:</strong>
                    <strong>Rs. {Number(selectedInvoiceOrder.total || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Notice */}
              <div style={{ marginTop: 35, paddingTop: 16, borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11, color: '#666' }}>
                <div>
                  <p style={{ margin: 0 }}>
                    * This is a computer-generated commercial invoice and inspection receipt.<br />
                    * 7-day warranty claims require original invoice and un-tampered equipment seals.
                  </p>
                </div>
                <div style={{ textAlign: 'center', border: '1px solid #CCC', padding: '8px 16px', borderRadius: 4 }}>
                  <div style={{ fontWeight: 800, color: '#03543F' }}>SURGICALS.PK</div>
                  <div style={{ fontSize: 9 }}>VERIFIED DISPATCH STAMP</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
