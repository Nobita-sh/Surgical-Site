import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const AVAILABLE_PERMISSIONS = [
  { id: 'orders', label: 'Order Fulfillment', desc: 'Process orders, assign couriers, generate tracking' },
  { id: 'products', label: 'Products & Inventory', desc: 'Manage catalog, adjust stock levels, categories & brands' },
  { id: 'support', label: 'Customer Support', desc: 'Search orders/customers, view details, append internal support notes' },
  { id: 'delivery', label: 'Delivery Dispatch', desc: 'Assigned courier view, update delivery status to Delivered' }
];

export const StaffManagementSection = () => {
  const { addToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all'); // 'all', 'orders', 'products', 'support', 'delivery'

  // Create Staff Form Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    permissions: ['orders']
  });
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // Edit Permissions Modal
  const [editingStaff, setEditingStaff] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [isUpdatingPerms, setIsUpdatingPerms] = useState(false);

  // Reset Password Modal
  const [resettingStaff, setResettingStaff] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessCredentials, setResetSuccessCredentials] = useState(null);

  const generateRandomPassword = (isReset = false) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'SPK-';
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (isReset) {
      setNewPassword(pwd);
      setShowResetPassword(true);
    } else {
      setFormData(prev => ({ ...prev, password: pwd }));
      setShowPassword(true);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await api.staff.getAll();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(err.message || 'Failed to load staff accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleTogglePermission = (permId, isEdit = false) => {
    if (isEdit) {
      setEditPermissions(prev =>
        prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
      );
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permId)
          ? prev.permissions.filter(p => p !== permId)
          : [...prev.permissions, permId]
      }));
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Please fill in name, email, and password.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.staff.create(formData);
      addToast(`Staff account for ${formData.name} created successfully!`, 'success');
      setCreatedCredentials({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        permissions: formData.permissions
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        permissions: ['orders']
      });
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to create staff account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!editingStaff) return;
    try {
      setIsUpdatingPerms(true);
      await api.staff.updatePermissions(editingStaff.id, editPermissions);
      addToast(`Permissions updated for ${editingStaff.name}.`, 'success');
      setEditingStaff(null);
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to update permissions.', 'error');
    } finally {
      setIsUpdatingPerms(false);
    }
  };

  const handleToggleStatus = async (staff) => {
    const nextStatus = staff.status === 'active' ? 'inactive' : 'active';
    const actionWord = nextStatus === 'active' ? 'reactivate' : 'deactivate';
    if (!window.confirm(`Are you sure you want to ${actionWord} ${staff.name}'s account?`)) {
      return;
    }

    try {
      await api.staff.toggleStatus(staff.id, nextStatus);
      addToast(`Account for ${staff.name} ${nextStatus === 'active' ? 'reactivated' : 'deactivated'}.`, 'success');
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to update account status.', 'error');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resettingStaff || !newPassword) return;

    try {
      setIsResetting(true);
      await api.staff.resetPassword(resettingStaff.id, newPassword);
      addToast(`Password updated for ${resettingStaff.name}.`, 'success');
      setResetSuccessCredentials({
        name: resettingStaff.name,
        email: resettingStaff.email,
        password: newPassword
      });
      setResettingStaff(null);
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to reset password.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter(s => s.status === 'active').length;
    const inactive = total - active;
    const riders = staffList.filter(s => Array.isArray(s.permissions) && s.permissions.includes('delivery')).length;
    const support = staffList.filter(s => Array.isArray(s.permissions) && s.permissions.includes('support')).length;
    return { total, active, inactive, riders, support };
  }, [staffList]);

  // Filter
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q))
      );

      if (!matchesSearch) return false;

      if (deptFilter !== 'all') {
        const perms = Array.isArray(s.permissions) ? s.permissions : [];
        if (!perms.includes(deptFilter) && s.role !== 'admin') {
          return false;
        }
      }

      return true;
    });
  }, [staffList, searchQuery, deptFilter]);

  return (
    <div className="admin-content-section" style={{ animation: 'fadeIn 0.2s ease-in' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: '#0F172A' }}>
              Staff Account Governance &amp; Security
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DEF7EC', color: '#03543F', padding: '3px 8px', borderRadius: 6, border: '1px solid #A7F3D0' }}>
              Operations Control
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Provision staff credentials, assign department modules, reset passwords, and govern system access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn-solid-maroon"
          style={{
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Staff
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Personnel</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {metrics.active} <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>of {metrics.total} accounts</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Riders</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            {metrics.riders} <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>on field dispatch</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Support Desk Agents</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563EB', marginTop: 4 }}>
            {metrics.support} <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>active desk</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Deactivated Accounts</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
            {metrics.inactive} <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>revoked</span>
          </div>
        </div>
      </div>

      {/* Department Filter Tabs & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Staff (${staffList.length})` },
            { id: 'orders', label: 'Order Fulfillment' },
            { id: 'products', label: 'Inventory & Stock' },
            { id: 'support', label: 'Customer Support' },
            { id: 'delivery', label: 'Logistics & Riders' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDeptFilter(tab.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: deptFilter === tab.id ? 700 : 500,
                borderRadius: 6,
                border: deptFilter === tab.id ? '1px solid #800020' : '1px solid #E2E8F0',
                backgroundColor: deptFilter === tab.id ? '#800020' : '#FFF',
                color: deptFilter === tab.id ? '#FFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 300 }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
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

      {/* Staff Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 13.5 }}>
            Loading staff directory...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 13.5 }}>
            No staff accounts found matching your filter criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Staff Personnel</th>
                  <th style={{ padding: '12px 16px' }}>Credentials / Contact</th>
                  <th style={{ padding: '12px 16px' }}>Role &amp; Status</th>
                  <th style={{ padding: '12px 16px' }}>Operational Clearance</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{staff.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>Account ID: {staff.id}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#1E293B' }}>{staff.email}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{staff.phone || 'No phone recorded'}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: staff.role === 'admin' ? '#EDE9FE' : '#E0F2FE',
                          color: staff.role === 'admin' ? '#6D28D9' : '#0369A1',
                          padding: '3px 8px',
                          borderRadius: 4
                        }}>
                          {staff.role}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: staff.status === 'active' ? '#DEF7EC' : '#FDE8E8',
                          color: staff.status === 'active' ? '#03543F' : '#9B1C1C',
                          padding: '3px 8px',
                          borderRadius: 4
                        }}>
                          {staff.status === 'active' ? 'Active' : 'Deactivated'}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {staff.role === 'admin' ? (
                        <span style={{ color: '#059669', fontWeight: 700, fontSize: 12 }}>
                          Full System Access (Root Admin)
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {staff.permissions && staff.permissions.length > 0 ? (
                            staff.permissions.map(p => {
                              const meta = AVAILABLE_PERMISSIONS.find(m => m.id === p);
                              return (
                                <span key={p} style={{
                                  backgroundColor: '#F1F5F9',
                                  color: '#334155',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: 4,
                                  padding: '2px 7px',
                                  fontSize: 11,
                                  fontWeight: 600
                                }}>
                                  {meta ? meta.label : p}
                                </span>
                              );
                            })
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: 12, fontStyle: 'italic' }}>
                              No modules assigned
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {staff.role !== 'admin' && (
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStaff(staff);
                              setEditPermissions(staff.permissions || []);
                            }}
                            className="btn-framed"
                            style={{ padding: '5px 10px', fontSize: 11.5, borderRadius: 5 }}
                          >
                            Permissions
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setResettingStaff(staff);
                              setNewPassword('');
                            }}
                            className="btn-framed"
                            style={{ padding: '5px 10px', fontSize: 11.5, borderRadius: 5, color: '#1E40AF', borderColor: '#BFDBFE' }}
                          >
                            Reset Password
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(staff)}
                            style={{
                              backgroundColor: staff.status === 'active' ? '#FEE2E2' : '#E0F2FE',
                              border: 'none',
                              color: staff.status === 'active' ? '#991B1B' : '#0369A1',
                              borderRadius: 5,
                              padding: '5px 10px',
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {staff.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
              Create Staff Personnel Account
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Assign role-based access to warehouse, fulfillment, and customer care portals.
            </p>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Tariq"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Staff Login Email *</label>
                <input
                  type="email"
                  required
                  placeholder="usman.tariq@surgicals.pk"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600 }}>Temporary Password *</label>
                  <button
                    type="button"
                    onClick={() => generateRandomPassword(false)}
                    style={{ background: 'none', border: 'none', color: '#059669', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Select Authorized Modules:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {AVAILABLE_PERMISSIONS.map(p => (
                    <label
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12.5,
                        backgroundColor: formData.permissions.includes(p.id) ? '#EFF6FF' : '#F8FAFC',
                        border: formData.permissions.includes(p.id) ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                        padding: '8px 10px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(p.id)}
                        onChange={() => handleTogglePermission(p.id, false)}
                      />
                      <span style={{ fontWeight: formData.permissions.includes(p.id) ? 700 : 500 }}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-framed"
                  style={{ padding: '8px 16px', fontSize: 13, borderRadius: 6 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-solid-maroon"
                  style={{ padding: '8px 18px', fontSize: 13, borderRadius: 6, fontWeight: 700 }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingStaff && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
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
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
              Edit Permissions: {editingStaff.name}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Update access privileges for {editingStaff.email}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {AVAILABLE_PERMISSIONS.map(p => (
                <label
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: editPermissions.includes(p.id) ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    backgroundColor: editPermissions.includes(p.id) ? '#EFF6FF' : '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={editPermissions.includes(p.id)}
                    onChange={() => handleTogglePermission(p.id, true)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{p.label}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="btn-framed"
                style={{ padding: '8px 16px', fontSize: 13, borderRadius: 6 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingPerms}
                onClick={handleSavePermissions}
                className="btn-solid-maroon"
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 6, fontWeight: 700 }}
              >
                {isUpdatingPerms ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingStaff && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 24,
            maxWidth: 440,
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
              Reset Password: {resettingStaff.name}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Set a temporary password for {resettingStaff.email}.
            </p>

            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600 }}>New Password *</label>
                  <button
                    type="button"
                    onClick={() => generateRandomPassword(true)}
                    style={{ background: 'none', border: 'none', color: '#059669', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setResettingStaff(null)}
                  className="btn-framed"
                  style={{ padding: '8px 16px', fontSize: 13, borderRadius: 6 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting || !newPassword}
                  className="btn-solid-maroon"
                  style={{ padding: '8px 18px', fontSize: 13, borderRadius: 6, fontWeight: 700 }}
                >
                  {isResetting ? 'Resetting...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Created or Reset Credentials Success Alert */}
      {(createdCredentials || resetSuccessCredentials) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
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
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#059669' }}>
              {createdCredentials ? 'Staff Account Created!' : 'Password Reset Successfully!'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Credentials ready for WhatsApp transmission:
            </p>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
              <div><strong>Name:</strong> {(createdCredentials || resetSuccessCredentials).name}</div>
              <div><strong>Portal Login:</strong> https://surgicals.pk/admin</div>
              <div><strong>Email:</strong> {(createdCredentials || resetSuccessCredentials).email}</div>
              <div><strong>Password:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#800020' }}>{(createdCredentials || resetSuccessCredentials).password}</span></div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  const data = createdCredentials || resetSuccessCredentials;
                  const msg = `Assalam-o-Alaikum ${data.name}!\n\nYour Surgicals.pk Portal credentials are ready:\n` +
                    `*Portal:* https://surgicals.pk/admin\n` +
                    `*Email:* ${data.email}\n` +
                    `*Password:* ${data.password}\n\nPlease keep your credentials secure.`;
                  navigator.clipboard.writeText(msg);
                  addToast('Copied to clipboard for WhatsApp!', 'success');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#25D366',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Copy for WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedCredentials(null);
                  setResetSuccessCredentials(null);
                }}
                className="btn-framed"
                style={{ padding: '9px 16px', fontSize: 13, borderRadius: 6 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
