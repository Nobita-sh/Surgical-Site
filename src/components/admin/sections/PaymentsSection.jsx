import React from 'react';

export const PaymentsSection = ({ orders = [] }) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  // Compute real financial metrics from orders
  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  const totalShipping = safeOrders.reduce((sum, o) => sum + (Number(o?.shippingFee) || 0), 0);
  const avgOrderValue = safeOrders.length > 0 ? Math.round(totalRevenue / safeOrders.length) : 0;

  const codOrders = safeOrders.filter(o => (o?.paymentMethod || 'cod').toLowerCase() === 'cod');
  const bankOrders = safeOrders.filter(o => (o?.paymentMethod || '').toLowerCase().includes('bank'));
  const paidOrders = safeOrders.filter(o => o?.paymentStatus && o.paymentStatus.toLowerCase() === 'paid');
  const pendingPayments = safeOrders.filter(o => !o?.paymentStatus || o.paymentStatus.toLowerCase() === 'pending');

  const codTotal = codOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  const bankTotal = bankOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Payments &amp; Financial Ledger</h3>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
          Revenue analytics derived from {orders.length} order{orders.length !== 1 ? 's' : ''} in the system.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>Rs. {totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>Across all orders</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Avg Order Value</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>Rs. {avgOrderValue.toLocaleString()}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Shipping Collected</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>Rs. {totalShipping.toLocaleString()}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Payment Status</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#03543F', marginTop: 6 }}>{paidOrders.length} Paid</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#800020', marginTop: 2 }}>{pendingPayments.length} Pending</div>
          </div>
        </div>
      </div>

      {/* Payment method breakdown */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: '#0F172A' }}>Payment Channel Breakdown</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Cash on Delivery</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>Rs. {codTotal.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{codOrders.length} order{codOrders.length !== 1 ? 's' : ''} via COD</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Direct Bank Transfer</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>Rs. {bankTotal.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{bankOrders.length} order{bankOrders.length !== 1 ? 's' : ''} via bank</div>
          </div>
        </div>
      </div>
    </div>
  );
};
