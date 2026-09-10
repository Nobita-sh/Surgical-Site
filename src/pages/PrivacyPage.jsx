import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const PrivacyPage = () => {
  const [privacy, setPrivacy] = useState({
    title: 'Privacy Policy',
    effectiveDate: 'January 1, 2025',
    supportEmail: 'privacy@surgicals.pk',
    dpoOfficer: 'Compliance & Clinical Records Officer',
    retentionYears: '7 Years (DRAP Clinical Standard)'
  });

  useEffect(() => {
    api.cms.getPolicyPages()
      .then(res => {
        if (res?.privacy) setPrivacy(res.privacy);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="site-container" style={{ padding: '30px 16px 70px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#111', fontWeight: 600 }}>{privacy.title || 'Privacy Policy'}</span>
      </nav>

      {/* Hero Header */}
      <div style={{
        backgroundColor: '#F8F9FA',
        border: '1px solid #ECECEC',
        borderRadius: 12,
        padding: '32px 24px',
        marginBottom: 35
      }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#111', margin: '0 0 10px' }}>
          {privacy.title || 'Privacy Policy'}
        </h1>
        <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>
          Effective Date: {privacy.effectiveDate} &bull; Officer: {privacy.dpoOfficer}
        </p>
        <p style={{ fontSize: 14, color: '#444', marginTop: 12, lineHeight: 1.6 }}>
          At <strong>Surgicals.pk</strong>, we respect your privacy and are committed to protecting the personal, hospital, and clinical information you share with us. This policy outlines our standards regarding data collection, order processing, and healthcare confidentiality across Pakistan.
        </p>
      </div>

      {/* Custom Full Policy Content or Standard Default Sections */}
      {privacy.content ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '36px 30px',
          marginBottom: 35,
          fontSize: 15,
          color: '#334155',
          lineHeight: 1.85,
          whiteSpace: 'pre-wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {privacy.content}
        </div>
      ) : (
        <>
          {/* Key Principles Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 35
          }}>
            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Strict Confidentiality</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                We never sell, rent, or trade customer health records, hospital POs, or personal details to third-party marketers.
              </p>
            </div>

            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Encrypted Payments</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                All card transactions and online bank transfers utilize 256-bit SSL encryption. Cash on Delivery is strictly protected.
              </p>
            </div>

            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Secure Courier Dispatch</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                Consignment details are shared solely with authorized national courier partners (TCS, Leopard, Daewoo Cargo) for delivery.
              </p>
            </div>
          </div>

          {/* Policy Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: '#333', fontSize: 14.5, lineHeight: 1.7 }}>
            
            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                1. Information We Collect
              </h3>
              <p>
                When you purchase medical equipment, request an official quotation, or register an account on Surgicals.pk, we may collect:
              </p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li><strong>Contact Details:</strong> Full name, clinical title, hospital/clinic name, mobile number, and email address.</li>
                <li><strong>Delivery & Logistics Data:</strong> Delivery address, city, landmark, and postal code for courier dispatch across Pakistan.</li>
                <li><strong>Financial & Payment Records:</strong> Payment method selected (COD, Bank Transfer, Online Gateway), invoice numbers, and transaction IDs (we do not store CVV or full card numbers).</li>
                <li><strong>Technical Analytics:</strong> Device type, browser cookies, and IP address used to safeguard against fraudulent transactions.</li>
              </ul>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                2. How We Use Your Information
              </h3>
              <p>
                Your information is processed strictly for lawful medical commerce and fulfillment:
              </p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>Fulfilling, packaging, and dispatching medical and surgical supplies to your clinic, hospital, or residence.</li>
                <li>Sending automatic WhatsApp/SMS tracking updates and invoice confirmations.</li>
                <li>Registering manufacturer warranties for precision electronic devices (e.g. ICU monitors, ultrasound machines, autoclaves).</li>
                <li>Responding to customer service inquiries, technical calibration assistance, and biomedical guidance.</li>
              </ul>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                3. Clinical Records Retention ({privacy.retentionYears || '7 Years'})
              </h3>
              <p>
                Pursuant to healthcare supply chain regulations in Pakistan, transaction records, tax invoices (FBR sales tax records), and serial numbers of diagnostic equipment are securely archived for <strong>{privacy.retentionYears || '7 Years'}</strong> before decommission.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                4. Cookies &amp; Tracking Safeguards
              </h3>
              <p>
                We use strictly necessary functional session cookies to remember your shopping cart items and active login sessions. We do not engage in intrusive cross-site ad tracking or third-party behavioral telemetry.
              </p>
            </section>

            <section style={{ backgroundColor: '#F8F9FA', borderRadius: 10, padding: 24, border: '1px solid #ECECEC' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>
                5. Contact Our Privacy & Compliance Officer ({privacy.dpoOfficer || 'Compliance Officer'})
              </h3>
              <p style={{ margin: '0 0 12px', fontSize: 13.5, color: '#555' }}>
                If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact our support desk:
              </p>
              <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.8 }}>
                <div><strong>Email:</strong> {privacy.supportEmail || 'privacy@surgicals.pk'}</div>
                <div><strong>Helpline:</strong> +92 300 0000000 / (042) 37230000</div>
                <div><strong>Office:</strong> Surgical Market, Nishtar Road / Railway Road, Lahore, Pakistan</div>
              </div>
            </section>

          </div>
        </>
      )}

    </div>
  );
};
