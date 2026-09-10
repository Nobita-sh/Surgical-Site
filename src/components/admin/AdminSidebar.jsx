import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  navSections = [],
  ordersCount = 0,
  productsCount = 0,
  categoriesCount = 0,
  user,
  onLogout,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  // Filter sections by search query
  const filteredNavSections = useMemo(() => {
    if (!searchFilter.trim()) return navSections;
    const query = searchFilter.toLowerCase().trim();
    return navSections
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(query) ||
          group.group.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0);
  }, [navSections, searchFilter]);

  const initials = (user?.name || 'Admin')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 1. Header: Brand Logo & Collapse Toggle */}
      <div className="admin-sidebar-header" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: isCollapsed ? 10 : 12 }}>
          <Link
            to="/"
            className="brand-logo-wrap"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            title="Go to storefront"
          >
            <span className="brand-logo-icon" style={{ fontSize: 18 }}>✚</span>
            {!isCollapsed && (
              <span className="brand-logo-text" style={{ fontSize: 18, fontWeight: 800 }}>
                surgicals<span className="logo-domain" style={{ fontSize: 11 }}>.pk</span>
              </span>
            )}
          </Link>

          {/* Sidebar Collapse Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={() => onToggleCollapse(!isCollapsed)}
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
              style={{
                background: 'none',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '5px 7px',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {isCollapsed ? (
                  /* Expand icon -> */
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                ) : (
                  /* Collapse icon <- */
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Profile Card (Full vs Compact) */}
        {!isCollapsed ? (
          <div className="admin-profile-full" style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '10px 12px'
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: user?.role === 'admin' ? '#800020' : '#047857',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span style={{ fontSize: 8 }}>●</span> {user?.role === 'admin' ? 'VERIFIED ADMIN' : 'OPERATIONS STAFF'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Staff Member'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
            {user?.role !== 'admin' && user?.permissions && user.permissions.length > 0 && (
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 6 }}>
                {user.permissions.map(p => (
                  <span key={p} style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    borderRadius: 3,
                    padding: '1px 5px'
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Compact Avatar for Collapsed Sidebar */
          <div
            title={`${user?.name || 'User'} (${user?.role})`}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: user?.role === 'admin' ? '#FDF2F8' : '#ECFDF5',
              color: user?.role === 'admin' ? '#800020' : '#047857',
              border: `1.5px solid ${user?.role === 'admin' ? '#FBCFE8' : '#A7F3D0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              margin: '0 auto'
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* 2. Quick Menu Filter (Visible when expanded) */}
      {!isCollapsed && (
        <div className="admin-sidebar-search-box" style={{ flexShrink: 0, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 20, top: 16, color: '#94A3B8' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="admin-sidebar-search-input"
            placeholder="Quick search sections..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              style={{
                position: 'absolute',
                right: 20,
                top: 14,
                border: 'none',
                background: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: 11,
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* 3. Navigation Groups (Scrollable Middle) */}
      <div className="admin-sidebar-nav" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 16 }}>
        {filteredNavSections.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
            No sections match "{searchFilter}"
          </div>
        ) : (
          filteredNavSections.map((sec, sIdx) => (
            <div key={sIdx}>
              <div className="admin-nav-group-title">
                {sec.group}
              </div>
              <ul className="admin-nav-list">
                {sec.items.map(item => {
                  const isActive = activeTab === item.id;
                  const count = item.id === 'orders' ? ordersCount : item.id === 'inventory' ? productsCount : item.id === 'categories' ? categoriesCount : 0;

                  return (
                    <li key={item.id} className="admin-nav-item-wrapper">
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {item.icon}
                        <span className="admin-nav-label">{item.label}</span>

                        {/* Count Badges */}
                        {item.id === 'orders' && ordersCount > 0 && (
                          <span
                            className="admin-badge-count"
                            style={{
                              marginLeft: 'auto',
                              backgroundColor: isActive ? '#800020' : '#E0E7FF',
                              color: isActive ? '#FFFFFF' : '#3730A3',
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 10
                            }}
                          >
                            {ordersCount}
                          </span>
                        )}
                        {item.id === 'inventory' && productsCount > 0 && (
                          <span
                            className="admin-badge-count"
                            style={{
                              marginLeft: 'auto',
                              backgroundColor: isActive ? '#800020' : '#F1F5F9',
                              color: isActive ? '#FFFFFF' : '#475569',
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '1px 6px',
                              borderRadius: 10
                            }}
                          >
                            {productsCount}
                          </span>
                        )}
                        {item.id === 'categories' && categoriesCount > 0 && (
                          <span
                            className="admin-badge-count"
                            style={{
                              marginLeft: 'auto',
                              backgroundColor: isActive ? '#800020' : '#FDF2F8',
                              color: isActive ? '#FFFFFF' : '#800020',
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 10
                            }}
                          >
                            {categoriesCount}
                          </span>
                        )}
                      </button>

                      {/* Tooltip for Collapsed Sidebar */}
                      {isCollapsed && (
                        <div className="admin-nav-tooltip">
                          {item.label} {count > 0 ? `(${count})` : ''}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* 4. Sidebar Footer Lock/Sign Out (Pinned at Bottom) */}
      <div className="admin-sidebar-footer" style={{ flexShrink: 0, padding: isCollapsed ? '12px 8px' : '14px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          type="button"
          onClick={onLogout}
          title="Sign out & lock operations portal"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: isCollapsed ? '9px 0' : '9px 12px',
            borderRadius: 6,
            border: '1px solid #FECACA',
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {!isCollapsed && <span>Lock &amp; Exit Portal</span>}
        </button>

        {!isCollapsed && (
          <Link
            to="/"
            style={{
              textAlign: 'center',
              fontSize: 11.5,
              color: '#64748B',
              textDecoration: 'none',
              padding: '3px'
            }}
          >
            View Public Storefront &rarr;
          </Link>
        )}
      </div>
    </aside>
  );
};

