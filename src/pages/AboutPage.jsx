import React from 'react';
import { Link } from 'react-router-dom';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const AboutPage = () => {
  return (
    <div className="site-container" style={{ padding: '40px 15px 70px', maxWidth: 960 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
        <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link> /{' '}
        <strong style={{ color: '#0F172A' }}>About Surgicals.pk</strong>
      </div>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 24, marginBottom: 32 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#800020', textTransform: 'uppercase', letterSpacing: 1 }}>
          Clinical Authority & Medical Excellence
        </span>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, margin: '8px 0 12px', color: '#0F172A' }}>
          About Surgicals.pk
        </h1>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, maxWidth: 780 }}>
          Pakistan’s premier multi-channel distributor of hospital furniture, diagnostic medical devices, 
          physiotherapy modalities, and surgical instrumentation since 2007.
        </p>
      </div>

      {/* Credibility Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div style={{ padding: 24, backgroundColor: '#FFF7ED', borderRadius: 10, border: '1px solid #FFEDD5' }}>
          <div style={{ marginBottom: 10, color: '#9A3412' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15"></path>
              <line x1="9" y1="9" x2="9" y2="9.01"></line>
              <line x1="9" y1="13" x2="9" y2="13.01"></line>
              <line x1="9" y1="17" x2="9" y2="17.01"></line>
            </svg>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#9A3412' }}>Clinical Grade Equipment</h3>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Every device undergoes biomedical calibration and complies with DRAP (Drug Regulatory Authority of Pakistan) guidelines.
          </p>
        </div>

        <div style={{ padding: 24, backgroundColor: '#EFF6FF', borderRadius: 10, border: '1px solid #DBEAFE' }}>
          <div style={{ marginBottom: 10, color: '#1E40AF' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#1E40AF' }}>Manufacturer Warranties</h3>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Direct authorized partnerships with Omron, Beurer Germany, Certeza, and Mindray ensuring 100% genuine products.
          </p>
        </div>

        <div style={{ padding: 24, backgroundColor: '#F0FDF4', borderRadius: 10, border: '1px solid #DCFCE7' }}>
          <div style={{ marginBottom: 10, color: '#166534' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#166534' }}>Nationwide Healthcare Dispatch</h3>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Same-day delivery across Lahore and secure insured shipping via TCS and Daewoo Fastex nationwide.
          </p>
        </div>
      </div>

      {/* Corporate Profile Narrative */}
      <div style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.8, marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
          Our Institutional Mission
        </h2>
        <p style={{ marginBottom: 16 }}>
          Founded with the vision of modernizing healthcare logistics in Pakistan, Surgicals.pk connects medical professionals, hospital procurement directors, and home patients with certified medical apparatus at transparent pricing.
        </p>
        <p style={{ marginBottom: 16 }}>
          We maintain distribution facilities in Lahore, Rawalpindi, and Karachi, catering to tertiary care hospitals, private clinical practices, rehabilitation clinics, and emergency responders nationwide.
        </p>
      </div>

      {/* Call to Action */}
      <div style={{ padding: 28, backgroundColor: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center', marginBottom: 50 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#0F172A' }}>Need an Institutional Hospital Quotation?</h3>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
          Contact our biomedical sales department for hospital tenders and bulk medical supplies.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-solid-maroon" style={{ padding: '10px 22px', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
            Contact Institutional Sales
          </Link>
          <Link to="/shop" className="btn-framed" style={{ padding: '10px 22px', borderRadius: 6, textDecoration: 'none', fontSize: 13 }}>
            Explore Medical Catalog
          </Link>
        </div>
      </div>

      <SiteStorySection />
    </div>
  );
};
