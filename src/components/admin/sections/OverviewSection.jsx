import React from 'react';

export const OverviewSection = ({
  products = [],
  orders = [],
  categories = [],
  productsCount = 0,
  ordersCount = 0,
  categoriesCount = 0,
  onNavigateTab
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const pCount = safeProducts.length || productsCount;
  const oCount = safeOrders.length || ordersCount;
  const cCount = (Array.isArray(categories) ? categories.length : 0) || categoriesCount;

  // Financial and fulfillment calculations
  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrderValue = safeOrders.length > 0 ? Math.round(totalRevenue / safeOrders.length) : 0;
  
  const pendingOrders = safeOrders.filter(o => 
    !o.orderStatus || o.orderStatus.toLowerCase().includes('pending') || o.orderStatus.toLowerCase().includes('processing')
  );
  const deliveredOrders = safeOrders.filter(o => 
    o.orderStatus && o.orderStatus.toLowerCase().includes('delivered')
  );

  const codOrders = safeOrders.filter(o => (o.paymentMethod || 'cod').toLowerCase() === 'cod');
  const bankOrders = safeOrders.filter(o => (o.paymentMethod || '').toLowerCase().includes('bank'));

  // Stock inventory alerts
  const lowStockProducts = safeProducts.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);
  const outOfStockProducts = safeProducts.filter(p => Number(p.stock) <= 0);
  const urgentStockIssues = [...outOfStockProducts, ...lowStockProducts];

  // 5 Most recent orders
  const recentOrders = [...safeOrders].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }).slice(0, 5);

  const getStatusBadge = (status = 'Processing') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return { bg: '#DEF7EC', text: '#03543F' };
    if (s.includes('dispatched')) return { bg: '#E1EFFE', text: '#1E429F' };
    if (s.includes('cancelled')) return { bg: '#FDE8E8', text: '#9B1C1C' };
    return { bg: '#FEF08A', text: '#713F12' }; // Pending / Processing
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. Core Financial & Commerce KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Gross Sales Revenue</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>
            Avg Order: Rs. {avgOrderValue.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Total Orders</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#800020', marginTop: 6 }}>
            {oCount}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
            {pendingOrders.length} Pending &bull; {deliveredOrders.length} Delivered
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Active Medical Catalog</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            {pCount} Products
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
            Across {cCount} Medical Specialties
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Payment Channels</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
            COD: {codOrders.length} &bull; Bank: {bankOrders.length}
          </div>
          <div style={{ fontSize: 12, color: '#03543F', fontWeight: 600, marginTop: 4 }}>
            Direct National Fulfillment
          </div>
        </div>
      </div>

      {/* 2. Critical Stock Alert Banner (Low Stock & Out of Stock) */}
      {urgentStockIssues.length > 0 && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 10,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#D97706', flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong style={{ fontSize: 14, color: '#92400E' }}>
                Inventory Alert: {urgentStockIssues.length} Product{urgentStockIssues.length !== 1 ? 's' : ''} Require Restocking!
              </strong>
              <div style={{ fontSize: 12.5, color: '#B45309', marginTop: 2 }}>
                {outOfStockProducts.length} Out of Stock &bull; {lowStockProducts.length} Critically Low (≤ 5 units).
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="btn-solid-maroon"
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6 }}
          >
            Review Inventory &rarr;
          </button>
        </div>
      )}

      {/* 3. Recent Orders Activity Feed */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, backgroundColor: '#FAFAFA' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>Recent Customer Orders</h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Latest orders received across Pakistan</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="btn-framed"
            style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}
          >
            View All Orders ({oCount}) &rarr;
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
            No orders logged yet. Customer checkouts will automatically appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 16px' }}>Order ID</th>
                  <th style={{ padding: '10px 16px' }}>Customer</th>
                  <th style={{ padding: '10px 16px' }}>City</th>
                  <th style={{ padding: '10px 16px' }}>Total Amount</th>
                  <th style={{ padding: '10px 16px' }}>Payment</th>
                  <th style={{ padding: '10px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  const badge = getStatusBadge(o.orderStatus || o.status);
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                        #{o.id}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{o.customerName || o.fullName || 'Guest Customer'}</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>{o.customerPhone || o.phone || ''}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{o.city || 'Pakistan'}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#800020' }}>
                        Rs. {Number(o.total || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                          {o.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Operations Quick Navigation Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: '#0F172A' }}>Fast Store Operations</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="btn-solid-maroon"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13 }}
          >
            Inventory Catalog
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('add-product')}
            className="btn-framed"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13 }}
          >
            Add New Product
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="btn-framed"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13 }}
          >
            Manage Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('promo-banners')}
            className="btn-framed"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13 }}
          >
            Vouchers &amp; Deals
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('store-settings')}
            className="btn-framed"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13 }}
          >
            Shipping &amp; Settings
          </button>
        </div>
      </div>

    </div>
  );
};
