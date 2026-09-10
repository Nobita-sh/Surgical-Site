import React from 'react';
import { Link } from 'react-router-dom';

export const AdminAuthGate = ({
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  isAuthenticating,
  authError,
  onSubmit
}) => {
  return (
    <div className="site-container" style={{ padding: '50px 16px 80px', maxWidth: 480, margin: '0 auto' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <Link to="/" className="brand-logo-wrap" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 12, textDecoration: 'none' }}>
          <span className="brand-logo-icon" style={{ fontSize: 22 }}>✚</span>
          <span className="brand-logo-text" style={{ fontSize: 24 }}>surgicals<span className="logo-domain" style={{ fontSize: 13 }}>.pk</span></span>
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 6px', color: '#111827' }}>
          Operations Portal Sign In
        </h1>
        <p style={{ color: '#6B7280', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Restricted area. Please authenticate with administrator or staff credentials to access operations.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 8,
          padding: '12px 14px',
          color: '#991B1B',
          fontSize: 13,
          marginBottom: 20,
          lineHeight: 1.4
        }}>
          {authError}
        </div>
      )}

      {/* Login Form Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '30px 24px',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F2937', marginBottom: 6 }}>
              Admin Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 6,
                border: '1px solid #D1D5DB',
                fontSize: 14,
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#111827'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F2937', marginBottom: 6 }}>
              Security Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 6,
                border: '1px solid #D1D5DB',
                fontSize: 14,
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#111827'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="btn-solid-maroon"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 6,
              fontWeight: 700,
              cursor: isAuthenticating ? 'not-allowed' : 'pointer',
              marginTop: 4
            }}
          >
            {isAuthenticating ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO ADMIN PORTAL'}
          </button>
        </form>

        {/* Return link */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#6B7280', fontSize: 12.5, textDecoration: 'none' }}>
            &larr; Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
