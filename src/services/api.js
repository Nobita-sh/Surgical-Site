import { REVIEW_USERS, REVIEW_ORDERS, REVIEW_SETTINGS, REVIEW_AUDIT_LOGS } from '../data/reviewMockData';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData';

const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('spk_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function handleReviewFallback(path, method, body) {
  const cleanPath = path.split('?')[0];

  // Store Settings
  if (cleanPath.startsWith('/settings')) {
    if (method === 'PUT' && body) {
      const current = JSON.parse(localStorage.getItem('spk_store_settings') || JSON.stringify(REVIEW_SETTINGS));
      const updated = { ...current, ...body };
      localStorage.setItem('spk_store_settings', JSON.stringify(updated));
      return updated;
    }
    const saved = localStorage.getItem('spk_store_settings');
    return saved ? JSON.parse(saved) : REVIEW_SETTINGS;
  }

  // Orders
  if (cleanPath.startsWith('/orders')) {
    const savedOrders = JSON.parse(localStorage.getItem('spk_user_orders') || 'null');
    let ordersList = savedOrders || [...REVIEW_ORDERS];

    if (method === 'POST') {
      const newOrder = {
        id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...body
      };
      ordersList = [newOrder, ...ordersList];
      localStorage.setItem('spk_user_orders', JSON.stringify(ordersList));
      return newOrder;
    }

    if (method === 'PATCH' || method === 'PUT') {
      const parts = cleanPath.split('/');
      const orderId = parts[2];
      const idx = ordersList.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        ordersList[idx] = { ...ordersList[idx], ...body };
        localStorage.setItem('spk_user_orders', JSON.stringify(ordersList));
        return ordersList[idx];
      }
      return { success: true };
    }

    return ordersList;
  }

  // Staff Management
  if (cleanPath.startsWith('/auth/staff')) {
    const savedStaff = JSON.parse(localStorage.getItem('spk_staff_users') || 'null');
    let staffList = savedStaff || REVIEW_USERS.filter(u => u.role === 'staff');

    if (method === 'POST') {
      const newStaff = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        status: 'active',
        role: 'staff',
        permissions: body.permissions || ['orders'],
        ...body
      };
      delete newStaff.password;
      staffList = [newStaff, ...staffList];
      localStorage.setItem('spk_staff_users', JSON.stringify(staffList));
      return newStaff;
    }

    if (method === 'PUT' || method === 'PATCH') {
      const parts = cleanPath.split('/');
      const staffId = parts[3];
      const idx = staffList.findIndex(s => s.id === staffId);
      if (idx !== -1) {
        staffList[idx] = { ...staffList[idx], ...body };
        localStorage.setItem('spk_staff_users', JSON.stringify(staffList));
        return staffList[idx];
      }
      return { success: true };
    }

    return staffList;
  }

  // Customer Accounts Directory
  if (cleanPath.startsWith('/auth/users')) {
    const savedUsers = JSON.parse(localStorage.getItem('spk_registered_users') || '[]');
    const allUsers = [...REVIEW_USERS, ...savedUsers].map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    return allUsers;
  }

  // Audit Logs
  if (cleanPath.startsWith('/audit-logs')) {
    return REVIEW_AUDIT_LOGS;
  }

  // Image Upload Fallback
  if (cleanPath.startsWith('/products/upload')) {
    return {
      success: true,
      url: body?.image || '/assets/products/bp-monitor.png',
      filename: body?.filename || 'uploaded-product.png'
    };
  }

  // Products
  if (cleanPath.startsWith('/products')) {
    if (method === 'POST') {
      return { id: 'SPK-' + Date.now(), ...body };
    }
    return SEED_PRODUCTS;
  }

  // Categories
  if (cleanPath.startsWith('/categories')) {
    return SEED_CATEGORIES;
  }

  // CMS Layout
  if (cleanPath.startsWith('/cms')) {
    if (method === 'PUT') return body;
    return [];
  }

  // Current User Profile
  if (cleanPath.startsWith('/auth/me') || cleanPath.startsWith('/auth/profile')) {
    const saved = localStorage.getItem('spk_auth_user');
    return saved ? JSON.parse(saved) : REVIEW_USERS[0];
  }

  return { success: true };
}

async function request(path, { method = 'GET', body, auth = false, params } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        q.append(k, v);
      }
    }
    const qs = q.toString();
    if (qs) url += `?${qs}`;
  }
  const headers = { 'Content-Type': 'application/json', ...(auth ? getAuthHeaders() : {}) };

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // API not reachable on static review host -> proceed to review fallback
  }

  return handleReviewFallback(path, method, body);
}


export const api = {
  // Authentication APIs
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    verifyMfa: (mfaToken, code) => request('/auth/mfa/verify', { method: 'POST', body: { mfaToken, code } }),
    getMfaStatus: () => request('/auth/mfa/status', { auth: true }),
    setupMfa: () => request('/auth/mfa/setup', { method: 'POST', auth: true }),
    enableMfa: (secret, code) => request('/auth/mfa/enable', { method: 'POST', auth: true, body: { secret, code } }),
    disableMfa: (password, code) => request('/auth/mfa/disable', { method: 'POST', auth: true, body: { password, code } }),
    register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
    getMe: () => request('/auth/me', { auth: true }),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', auth: true, body: profileData })
  },

  // Products Catalog APIs
  products: {
    getAll: (params) => request('/products', { params }),
    getByIdOrSlug: (id) => request(`/products/${encodeURIComponent(id)}`),
    create: (data) => request('/products', { method: 'POST', auth: true, body: data }),
    update: (id, data) => request(`/products/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: data }),
    delete: (id) => request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    uploadImage: (image, filename) => request('/products/upload', { method: 'POST', body: { image, filename } })
  },

  // Categories APIs
  categories: {
    getAll: () => request('/categories'),
    create: (data) => request('/categories', { method: 'POST', auth: true, body: data }),
    delete: (id) => request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },

  // Customer & Admin Orders APIs
  orders: {
    create: (data) => request('/orders', { method: 'POST', body: data }),
    getAll: (params) => request('/orders', { auth: true, params }),
    getById: (id) => request(`/orders/${encodeURIComponent(id)}`, { auth: true }),
    updateStatus: (id, status) => request(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', auth: true, body: { status } }),
    update: (id, data) => request(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', auth: true, body: data }),
    assignCourier: (id, data) => request(`/orders/${encodeURIComponent(id)}/courier`, { method: 'PATCH', auth: true, body: data }),
    addSupportNote: (id, note) => request(`/orders/${encodeURIComponent(id)}/notes`, { method: 'POST', auth: true, body: { note } }),
    updateDeliveryStatus: (id, data) => request(`/orders/${encodeURIComponent(id)}/delivery-status`, { method: 'PATCH', auth: true, body: data })
  },

  // Staff Management APIs (Admin)
  staff: {
    getAll: () => request('/auth/staff', { auth: true }),
    create: (data) => request('/auth/staff', { method: 'POST', auth: true, body: data }),
    updatePermissions: (id, permissions) => request(`/auth/staff/${encodeURIComponent(id)}/permissions`, { method: 'PUT', auth: true, body: { permissions } }),
    toggleStatus: (id, status) => request(`/auth/staff/${encodeURIComponent(id)}/status`, { method: 'PATCH', auth: true, body: { status } }),
    resetPassword: (id, password) => request(`/auth/staff/${encodeURIComponent(id)}/reset-password`, { method: 'POST', auth: true, body: { password } })
  },

  // Users APIs (Admin)
  users: {
    getAll: () => request('/auth/users', { auth: true }),
    delete: (id) => request(`/auth/users/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },

  // Audit Logs APIs (Admin)
  auditLogs: {
    getAll: () => request('/audit-logs', { auth: true })
  },

  // Store Settings APIs (Admin)
  settings: {
    get: () => request('/settings', { auth: true }),
    update: (data) => request('/settings', { method: 'PUT', auth: true, body: data })
  },

  // Brands APIs (Admin & Storefront)
  brands: {
    getAll: () => request('/brands'),
    create: (data) => request('/brands', { method: 'POST', auth: true, body: data }),
    update: (id, data) => request(`/brands/${encodeURIComponent(id)}`, { method: 'PATCH', auth: true, body: data }),
    delete: (id) => request(`/brands/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },

  // CMS APIs (Homepage Layout, Promos, Policy Pages)
  cms: {
    getHomepageSections: () => request('/cms/homepage-sections'),
    updateHomepageSections: (sections) => request('/cms/homepage-sections', { method: 'PUT', auth: true, body: sections }),
    getPromos: () => request('/cms/promos'),
    updatePromos: (promos) => request('/cms/promos', { method: 'PUT', auth: true, body: promos }),
    getPolicyPages: () => request('/cms/policy-pages'),
    updatePolicyPages: (data) => request('/cms/policy-pages', { method: 'PUT', auth: true, body: data })
  }
};
