import React from 'react';

export const CheckoutsSection = ({ orders = [] }) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const now = Date.now();
  const oneDayMs = 86400000;

  // Derive real stats from orders
  const recentOrders = safeOrders.filter(o => {
    if (!o?.createdAt) return false;
    const created = new Date(o.createdAt).getTime();
    return !isNaN(created) && (now - created) < oneDayMs;
  });

  const completedOrders = safeOrders.filter(o =>
    o?.orderStatus && (o.orderStatus.toLowerCase().includes('delivered') || o.orderStatus.toLowerCase().includes('completed'))
  );

  const pendingOrders = safeOrders.filter(o =>
    o?.orderStatus && (o.orderStatus.toLowerCase().includes('processing') || o.orderStatus.toLowerCase().includes('pending'))
  );

  const conversionRate = safeOrders.length > 0
    ? ((completedOrders.length / safeOrders.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Active Checkouts &amp; Cart Sessions</h3>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
          Real-time order pipeline derived from live order data.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Orders (Last 24h)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{recentOrders.length} Session{recentOrders.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Fulfillment Rate</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', marginTop: 4 }}>{conversionRate}%</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Pending Processing</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#800020', marginTop: 4 }}>{pendingOrders.length} Order{pendingOrders.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Lifetime Orders</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Recent orders mini-table */}
      {recentOrders.length > 0 && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
            <strong style={{ fontSize: 14, color: '#0F172A' }}>Last 24h Checkout Activity</strong>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 16px' }}>Order ID</th>
                  <th style={{ padding: '10px 16px' }}>Customer</th>
                  <th style={{ padding: '10px 16px' }}>Total</th>
                  <th style={{ padding: '10px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 10).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{o.id}</td>
                    <td style={{ padding: '10px 16px', color: '#334155' }}>{o.customerName}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 700 }}>Rs. {Number(o.total).toLocaleString()}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ backgroundColor: '#E0E7FF', color: '#3730A3', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
