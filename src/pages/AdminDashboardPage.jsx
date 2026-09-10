import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

import {
  AdminSidebar,
  AdminAuthGate,
  OverviewSection,
  InventorySection,
  CategoriesSection,
  BrandsSection,
  AddProductSection,
  OrdersSection,
  StaffManagementSection,
  SupportDeskSection,
  DeliveryDispatchSection,
  HomepageSectionsManager,
  PolicyPagesManager,
  HeaderFooterManager,
  PromoBannersSection,
  CheckoutsSection,
  PaymentsSection,
  UsersSection,
  AuditLogsSection,
  StoreSettingsSection
} from '../components/admin';

const NAV_SECTIONS = [
  {
    group: 'Operations',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        permission: 'any',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
        )
      },
      {
        id: 'orders',
        label: 'Order Fulfillment',
        permission: 'orders',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        )
      },
      {
        id: 'inventory',
        label: 'Inventory',
        permission: 'products',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        )
      },
      {
        id: 'categories',
        label: 'Categories',
        permission: 'products',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
        )
      },
      {
        id: 'brands',
        label: 'Brand Partners',
        permission: 'products',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        )
      },
      {
        id: 'add-product',
        label: 'Add Product',
        permission: 'products',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        )
      }
    ]
  },
  {
    group: 'Support & Dispatch',
    items: [
      {
        id: 'support',
        label: 'Support Desk',
        permission: 'support',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        )
      },
      {
        id: 'delivery',
        label: 'My Deliveries',
        permission: 'delivery',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        )
      }
    ]
  },
  {
    group: 'Storefront & Content',
    items: [
      {
        id: 'homepage-sections',
        label: 'Home Page Sections',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        )
      },
      {
        id: 'policy-pages',
        label: 'Policy Pages',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )
      },
      {
        id: 'promo-banners',
        label: 'Banners & Deals',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        )
      },
      {
        id: 'header-footer',
        label: 'Header & Footer',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="4" rx="1"></rect>
            <rect x="3" y="17" width="18" height="4" rx="1"></rect>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="3" y1="14" x2="21" y2="14"></line>
          </svg>
        )
      }
    ]
  },
  {
    group: 'Commerce & Sales',
    items: [
      {
        id: 'checkouts',
        label: 'Checkouts',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        )
      },
      {
        id: 'payments',
        label: 'Payments',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
        )
      }
    ]
  },
  {
    group: 'Team & Governance',
    items: [
      {
        id: 'staff',
        label: 'Staff Management',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        )
      },
      {
        id: 'users',
        label: 'Customer Accounts',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )
      },
      {
        id: 'audit-logs',
        label: 'Audit Trail',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        )
      },
      {
        id: 'store-settings',
        label: 'Store Settings',
        adminOnly: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        )
      }
    ]
  }
];

export const AdminDashboardPage = () => {
  const { user, login, logout } = useAuth();
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    addCategory,
    deleteCategory
  } = useProducts();
  const { addToast } = useToast();

  // Auth Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab State
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Enhanced Viewport & Navigation State
  const mainViewportRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('spk_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
    try {
      localStorage.setItem('spk_admin_sidebar_collapsed', String(collapsed));
    } catch {}
  };

  // Live PKT Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleViewportScroll = (e) => {
    const top = e.target.scrollTop;
    setShowScrollTop(top > 220);
    setIsScrolled(top > 20);
  };

  const scrollToTop = () => {
    mainViewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStaffOrAdmin = Boolean(user && (user.role === 'admin' || user.role === 'staff'));
  const userRole = user?.role || 'customer';
  const userPermissions = useMemo(() => Array.isArray(user?.permissions) ? user.permissions : [], [user]);

  // Dynamically compute authorized navigation sections for this specific user
  const allowedNavSections = useMemo(() => {
    if (!isStaffOrAdmin) return [];

    return NAV_SECTIONS.map(group => {
      const allowedItems = group.items.filter(item => {
        if (userRole === 'admin') return true;
        if (item.adminOnly) return false;
        if (item.permission === 'any') return true;
        return userPermissions.includes(item.permission);
      });
      return { ...group, items: allowedItems };
    }).filter(group => group.items.length > 0);
  }, [isStaffOrAdmin, userRole, userPermissions]);

  const flatAllowedTabs = useMemo(() => {
    return allowedNavSections.flatMap(g => g.items.map(i => i.id));
  }, [allowedNavSections]);

  // Redirect to first available tab if current activeTab is not permitted
  useEffect(() => {
    if (flatAllowedTabs.length > 0 && !flatAllowedTabs.includes(activeTab)) {
      setActiveTab(flatAllowedTabs[0]);
    }
  }, [flatAllowedTabs, activeTab]);

  // Fetch orders when relevant tab is selected
  const fetchOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const data = await api.orders.getAll();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('spk_user_orders') || '[]');
      setOrders(local);
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshProducts ? refreshProducts() : Promise.resolve(),
        fetchOrders()
      ]);
      addToast('Catalog and order data refreshed.', 'info');
    } catch {
      addToast('Failed to refresh data.', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (isStaffOrAdmin && (activeTab === 'orders' || activeTab === 'overview' || activeTab === 'support' || activeTab === 'delivery')) {
      fetchOrders();
    }
  }, [isStaffOrAdmin, activeTab, fetchOrders]);

  // Handle Operations Sign In Gate
  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success && res.user) {
        if (res.user.role === 'admin' || res.user.role === 'staff') {
          addToast(`Operations clearance granted. Welcome, ${res.user.name}`);
        } else {
          logout();
          setAuthError(`Access Denied: Account "${res.user.email}" lacks operational clearance.`);
          addToast('Access Denied: Staff/Admin role required.', 'error');
        }
      } else {
        setAuthError(res.error || 'Invalid operational email or password.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Product Actions
  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      addToast(`Product "${productData.name}" published to store catalog!`);
      setEditingProduct(null);
      setActiveTab('inventory');
    } catch (err) {
      addToast(err.message || 'Failed to add product', 'error');
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setActiveTab('add-product');
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await updateProduct(id, productData);
      addToast(`Product "${productData.name}" updated successfully!`);
      setEditingProduct(null);
      setActiveTab('inventory');
    } catch (err) {
      addToast(err.message || 'Failed to update product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await deleteProduct(id);
        addToast('Product successfully removed from catalog.');
      } catch (err) {
        addToast(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleQuickStockUpdate = async (id, newStock) => {
    try {
      await updateProduct(id, { stock: newStock });
      addToast(`Stock updated to ${newStock} units.`, 'info');
    } catch (err) {
      addToast(err.message || 'Failed to update stock quantity', 'error');
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      addToast(`Order #${orderId} marked as "${newStatus}"!`);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleUpdateOrder = async (orderId, updateData) => {
    try {
      await api.orders.update(orderId, updateData);
      addToast(`Order #${orderId} updated successfully.`);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to update order', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('You have been signed out from the operations portal.');
  };

  // If not staff or admin, render Auth Gate centered in full viewport
  if (!isStaffOrAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', padding: '40px 16px' }}>
        <AdminAuthGate
          adminEmail={adminEmail}
          setAdminEmail={setAdminEmail}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          isAuthenticating={isAuthenticating}
          authError={authError}
          onSubmit={handleAdminAuth}
        />
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ height: '100vh', maxHeight: '100vh', display: 'flex', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      {/* 1. Shared Sidebar with Dynamic Permission Filtering & Collapsible Mode */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSections={allowedNavSections}
        ordersCount={orders.length}
        productsCount={products.length}
        categoriesCount={categories.length}
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* 2. Main Administration Content Viewport (Independent Scrollable Container) */}
      <main
        ref={mainViewportRef}
        onScroll={handleViewportScroll}
        className="admin-main-viewport"
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px 32px 60px',
          backgroundColor: '#F8FAFC'
        }}
      >
        {/* Top Header / Breadcrumbs (Sticky inside viewport with dynamic shadow) */}
        <div style={{
          position: 'sticky',
          top: -20,
          zIndex: 25,
          backgroundColor: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          paddingTop: 10,
          paddingBottom: 14,
          marginBottom: 20,
          borderBottom: '1px solid #E2E8F0',
          boxShadow: isScrolled ? '0 4px 14px rgba(0,0,0,0.04)' : 'none',
          transition: 'box-shadow 0.2s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          {/* Left: Breadcrumbs & Title with Mobile/Quick Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => handleToggleSidebar(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="btn-framed"
              style={{ padding: '6px 9px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div>
              <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span>Operations Suite</span>
                <span>/</span>
                <span style={{ color: '#800020', fontWeight: 600, textTransform: 'capitalize' }}>
                  {activeTab.replace('-', ' ')}
                </span>
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: '#0F172A', textTransform: 'capitalize', letterSpacing: '-0.3px' }}>
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Quick Add Product Button */}
            {(userRole === 'admin' || userPermissions.includes('products')) && activeTab !== 'add-product' && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab('add-product');
                }}
                className="btn-solid-maroon"
                style={{
                  padding: '7px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 6px rgba(128, 0, 32, 0.2)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Product
              </button>
            )}

            {/* Quick Refresh Button */}
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="btn-framed"
              title="Refresh all catalog and order data"
              style={{
                padding: '7px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                style={{
                  transform: isRefreshing ? 'rotate(360deg)' : 'none',
                  transition: isRefreshing ? 'transform 0.6s linear' : 'none'
                }}
              >
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* Live Clock */}
            {currentTime && (
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '5px 10px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {currentTime}
              </div>
            )}

            {/* System Status Badge */}
            <span style={{
              backgroundColor: '#DEF7EC',
              color: '#03543F',
              fontSize: 11.5,
              fontWeight: 700,
              padding: '5px 11px',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }}></span>
              Live Engine
            </span>
          </div>
        </div>

        {/* Operations Staff Clearance Banner */}
        {user?.role === 'staff' && (
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#1E40AF',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13
              }}>
                {(user.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E3A8A' }}>
                  {user.name || 'Operations Staff'} &bull; <span style={{ fontWeight: 500, color: '#2563EB' }}>Operations Clearance Active</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#3B82F6', marginTop: 1 }}>
                  Authorized Modules: {Array.isArray(user.permissions) && user.permissions.length > 0 ? user.permissions.join(', ') : 'Direct Operations Assigned'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: 4 }}>
                Shift Active
              </span>
            </div>
          </div>
        )}

        {/* 3. Action-Level Modular Sections (Wrapped in Smooth Transition) */}
        <div key={activeTab} className="admin-section-fade">
        {activeTab === 'overview' && (
          <OverviewSection
            products={products}
            orders={orders}
            categories={categories}
            productsCount={products.length}
            ordersCount={orders.length}
            categoriesCount={categories.length}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'inventory' && (
          <InventorySection
            products={products}
            categories={categories}
            refreshProducts={refreshProducts}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
            onQuickStockUpdate={handleQuickStockUpdate}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesSection
            categories={categories}
            products={products}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        )}

        {activeTab === 'brands' && (
          <BrandsSection />
        )}

        {activeTab === 'add-product' && (
          <AddProductSection
            categories={categories}
            productToEdit={editingProduct}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onCancel={() => {
              setEditingProduct(null);
              setActiveTab('inventory');
            }}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersSection
            orders={orders}
            isLoading={isOrdersLoading}
            onRefresh={fetchOrders}
            onStatusChange={handleOrderStatusChange}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {/* Dedicated Customer Support Section */}
        {activeTab === 'support' && (
          <SupportDeskSection />
        )}

        {/* Dedicated Courier Delivery Section */}
        {activeTab === 'delivery' && (
          <DeliveryDispatchSection />
        )}

        {/* Admin-Only Staff Management Section */}
        {activeTab === 'staff' && (
          <StaffManagementSection />
        )}

        {activeTab === 'homepage-sections' && (
          <HomepageSectionsManager />
        )}

        {activeTab === 'policy-pages' && (
          <PolicyPagesManager />
        )}

        {activeTab === 'promo-banners' && (
          <PromoBannersSection />
        )}

        {activeTab === 'header-footer' && (
          <HeaderFooterManager />
        )}

        {activeTab === 'checkouts' && (
          <CheckoutsSection orders={orders} />
        )}

        {activeTab === 'payments' && (
          <PaymentsSection orders={orders} />
        )}

        {activeTab === 'users' && (
          <UsersSection />
        )}

        {activeTab === 'audit-logs' && (
          <AuditLogsSection />
        )}

        {activeTab === 'store-settings' && (
          <StoreSettingsSection />
        )}
        </div>

        {/* 4. Floating Scroll to Top Action Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="admin-scroll-top-btn"
            title="Scroll back to top"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 15l-6-6-6 6" />
            </svg>
            <span>Top</span>
          </button>
        )}
      </main>
    </div>
  );
};
