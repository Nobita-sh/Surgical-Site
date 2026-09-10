import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const UsersSection = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      addToast('Failed to load users: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove user "${name}" from the system? This action cannot be undone.`)) return;
    try {
      await api.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      addToast(`User "${name}" removed from the system.`);
    } catch (err) {
      addToast('Failed to delete user: ' + err.message, 'error');
    }
  };

  const filteredUsers = search
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.city || '').toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const roleBadge = (role) => {
    const styles = {
      admin: { bg: '#FDF2F8', color: '#800020' },
      doctor: { bg: '#E0E7FF', color: '#3730A3' },
      customer: { bg: '#DEF7EC', color: '#03543F' }
    };
    const s = styles[role] || styles.customer;
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>
        {role}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Registered Users &amp; Clinical Accounts ({users.length})
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Manage registered hospital procurement officers, doctors, and consumer patient profiles.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, minWidth: 220, outline: 'none' }}
          />
          <button
            type="button"
            onClick={fetchUsers}
            className="btn-framed"
            style={{ padding: '8px 14px', borderRadius: 6, fontSize: 13 }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 14 }}>
            Loading users from database...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '12px 16px' }}>User Name</th>
                  <th style={{ padding: '12px 16px' }}>Email Address</th>
                  <th style={{ padding: '12px 16px' }}>Phone</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Hospital / Clinic</th>
                  <th style={{ padding: '12px 16px' }}>City</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: 14, fontWeight: 700, color: '#0F172A' }}>{u.name}</td>
                    <td style={{ padding: 14, color: '#64748B' }}>{u.email}</td>
                    <td style={{ padding: 14, color: '#64748B' }}>{u.phone || '—'}</td>
                    <td style={{ padding: 14 }}>{roleBadge(u.role)}</td>
                    <td style={{ padding: 14, color: '#64748B' }}>{u.hospitalClinicName || '—'}</td>
                    <td style={{ padding: 14, color: '#64748B' }}>{u.city || '—'}</td>
                    <td style={{ padding: 14, textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id, u.name)}
                          style={{ background: 'none', border: 'none', color: '#BE123C', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: 30, textAlign: 'center', color: '#94A3B8' }}>
                      {search ? 'No users match your search.' : 'No registered users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
