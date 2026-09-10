import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="site-container" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: 640 }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: '#800020', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '14px 0 10px', color: '#0F172A' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
        The medical equipment page or link you requested does not exist or has been relocated in our catalog.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-solid-maroon" style={{ padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13.5 }}>
          Return to Homepage
        </Link>
        <Link to="/shop" className="btn-framed" style={{ padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontSize: 13.5 }}>
          Browse Catalog
        </Link>
      </div>
    </div>
  );
};
