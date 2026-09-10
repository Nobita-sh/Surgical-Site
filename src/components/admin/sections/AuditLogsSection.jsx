import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const AuditLogsSection = () => {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.auditLogs.getAll();
      setLogs(data);
    } catch (err) {
      addToast('Failed to load audit logs: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = (status) => {
    const map = {
      SUCCESS: { bg: '#DEF7EC', color: '#03543F' },
      SYNCED: { bg: '#DEF7EC', color: '#03543F' },
      VERIFIED: { bg: '#DEF7EC', color: '#03543F' },
      FAILED: { bg: '#FEF2F2', color: '#991B1B' },
      WARNING: { bg: '#FFFBEB', color: '#92400E' }
    };
    return map[status] || map.SUCCESS;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Security &amp; System Audit Logs ({logs.length})
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Immutable audit trail of administrator authentications, catalog mutations, and order state transitions.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLogs}
          className="btn-framed"
          style={{ padding: '8px 14px', borderRadius: 6, fontSize: 13 }}
        >
          Refresh Logs
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: 14 }}>
            Loading audit trail from server...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
            No audit events recorded yet. Events will appear as you perform admin actions.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Event Action</th>
                  <th style={{ padding: '12px 16px' }}>Actor</th>
                  <th style={{ padding: '12px 16px' }}>Origin</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => {
                  const sc = statusColor(log.status);
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: 14, color: '#64748B', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: 14, fontWeight: 600, color: '#0F172A' }}>{log.action}</td>
                      <td style={{ padding: 14, color: '#64748B' }}>{log.actor}</td>
                      <td style={{ padding: 14, color: '#64748B', fontFamily: 'monospace', fontSize: 12 }}>{log.origin}</td>
                      <td style={{ padding: 14 }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.color, padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
                          {log.status}
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
    </div>
  );
};
