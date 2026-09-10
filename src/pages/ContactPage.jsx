import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Equipment Inquiry',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      addToast('Please provide your name, contact phone, and message', 'error');
      return;
    }

    setIsSent(true);
    addToast('Thank you! Your clinical inquiry has been received. Our medical team will reach out promptly.');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hello Surgicals.pk! My name is ${formData.name || 'a customer'}. I would like to inquire regarding: ${formData.subject}.`);
    window.open(`https://wa.me/923037333378?text=${text}`, '_blank');
  };

  return (
    <div className="site-container" style={{ padding: '40px 15px 70px', maxWidth: 960 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
        <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link> /{' '}
        <strong style={{ color: '#0F172A' }}>Contact Us</strong>
      </div>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 20, marginBottom: 30 }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
          Get In Touch with Surgicals.pk
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Direct clinical support, hospital quotation requests, warranty claims, and order assistance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ padding: 20, backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#800020' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Phone &amp; WhatsApp Helpline
            </h3>
            <p style={{ fontSize: 13, color: '#475569', margin: '0 0 8px' }}>
              Available Monday to Saturday (9:00 AM – 8:00 PM PKT)
            </p>
            <a href="tel:03037333378" style={{ fontSize: 16, fontWeight: 800, color: '#800020', textDecoration: 'none' }}>
              0303-7333378
            </a>
          </div>

          <div style={{ padding: 20, backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563EB' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Support
            </h3>
            <p style={{ fontSize: 13, color: '#475569', margin: '0 0 8px' }}>
              For tenders, official quotations, and institutional orders:
            </p>
            <a href="mailto:support@surgicals.pk" style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
              support@surgicals.pk
            </a>
          </div>

          <div style={{ padding: 20, backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#059669' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Distribution &amp; Corporate Center
            </h3>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Surgicals.pk Healthcare Logistics Center<br />
              Commercial Zone, Jail Road / Nishtar Town<br />
              Lahore, Punjab, Pakistan
            </p>
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            style={{
              padding: '12px 18px',
              backgroundColor: '#25D366',
              color: '#FFF',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>Chat Directly on WhatsApp</span>
          </button>
        </div>

        {/* Contact Form */}
        <div style={{ backgroundColor: '#FFFFFF', padding: 26, borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#0F172A' }}>
            Send Us an Inquiry
          </h3>

          {isSent ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', backgroundColor: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
              <div style={{ marginBottom: 12, color: '#166534', display: 'flex', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: 16 }}>Message Dispatched!</h4>
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 16px' }}>
                Our medical equipment officer has received your request and will contact you shortly.
              </p>
              <button
                type="button"
                className="btn-framed"
                onClick={() => {
                  setIsSent(false);
                  setFormData({ name: '', phone: '', email: '', subject: 'General Equipment Inquiry', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Salman Khan / Procurement Officer"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="doctor@hospital.pk"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Subject / Category</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, backgroundColor: '#FFF' }}
                >
                  <option value="General Equipment Inquiry">General Equipment Inquiry</option>
                  <option value="Institutional Hospital Quotation">Institutional Hospital Quotation</option>
                  <option value="Bulk Purchase & Tenders">Bulk Purchase & Tenders</option>
                  <option value="Warranty Claim or Service">Warranty Claim or Service</option>
                  <option value="Delivery & Order Tracking">Delivery & Order Tracking</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Message / Required Instruments *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Please specify the medical equipment, quantity, and your delivery city..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <button
                type="submit"
                className="btn-solid-maroon"
                style={{ padding: '12px', borderRadius: 6, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', marginTop: 6 }}
              >
                Submit Clinical Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
