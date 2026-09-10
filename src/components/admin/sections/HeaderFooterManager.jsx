import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const HeaderFooterManager = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Store Identity & Header
    storeName: 'Surgicals.pk',
    logoText: 'surgicals.pk',
    logoIcon: '✚',
    topBarPhone: '0303-7333378',
    announcementText: 'Free Shipping on Orders Above Rs. 5,000 across Pakistan!',

    // Footer Headline & Stats
    footerPlatformTitle: "PAKISTAN'S LARGEST HEALTHCARE PLATFORM",
    footerStat1Number: '1M+',
    footerStat1Label: 'Satisfied Buyers',
    footerStat2Number: '2M+',
    footerStat2Label: 'Orders Delivered',
    footerStat3Number: '100%',
    footerStat3Label: 'Moneyback Guarantee',

    // Footer Values
    footerValue1Title: 'Reliable',
    footerValue1Desc: 'All products displayed are verified and of high quality with 100% satisfaction.',
    footerValue2Title: 'Secure',
    footerValue2Desc: 'SSL 128-bit encryption and Payment Card Industry Data Security Standard compliant.',
    footerValue3Title: 'Affordable',
    footerValue3Desc: 'Find affordable surgical items, save up to 60% on health products.',

    // Footer Socials & Legal
    footerPhone: '0303 7333378',
    socialFacebook: 'https://www.facebook.com/Surgicalspk-105652255520730',
    socialInstagram: 'https://www.instagram.com/surgicals_pk/',
    socialLinkedin: 'https://www.linkedin.com/in/surgicals-pk-384448250/',
    footerCopyright: '© 2007-2025 Surgicals.pk . Market By Hukumat Networks',

    // Category Tagline & SEO
    categoryTagline: 'High grade medical and surgical supplies certified for clinical use across Pakistan.',
    metaTitle: 'Surgicals.PK - Hospital & Medical Equipment Pakistan',
    metaDescription: 'Shop verified hospital-grade surgical items, medical furniture, diagnostic devices, and mobility aids with 100% genuine warranty & nationwide delivery.',
    metaKeywords: 'surgical equipment pakistan, medical instruments lahore, hospital furniture, physiotherapy machines'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const [settings, promos] = await Promise.all([
        api.settings.get().catch(() => ({})),
        api.cms.getPromos().catch(() => ({}))
      ]);

      setFormData(prev => ({
        ...prev,
        ...(settings || {}),
        announcementText: promos?.announcementText || settings?.announcementText || prev.announcementText
      }));
    } catch (err) {
      addToast('Failed to load header & footer settings: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Save settings
      await api.settings.update(formData);

      // 2. Also save announcement text in CMS promos
      if (formData.announcementText) {
        await api.cms.updatePromos({ announcementText: formData.announcementText });
      }

      addToast('Header, Footer, Store Brand & SEO settings saved live!');
    } catch (err) {
      addToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading Header &amp; Footer settings...</div>;
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Top Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            Header, Footer &amp; Store Identity Customizer
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Customize your store name, logo, header helpline, footer statistics, values, social links, and SEO tags.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/"
            target="_blank"
            className="btn-framed"
            style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span>View Live Store</span> &rarr;
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-solid-maroon"
            style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Publishing...' : 'Publish All Changes'}
          </button>
        </div>
      </div>

      {/* Card 1: Brand Identity & Header Settings */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#800020' }}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            1. Brand Identity &amp; Header Settings
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Store / Brand Name (e.g. Surgicals.pk)
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
            <span style={{ fontSize: 11, color: '#64748B' }}>Appears across browser titles, invoices, and WhatsApp messages</span>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Logo Text (e.g. surgicals.pk)
            </label>
            <input
              type="text"
              name="logoText"
              value={formData.logoText || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Logo Icon / Symbol (e.g. + or SP)
            </label>
            <input
              type="text"
              name="logoIcon"
              value={formData.logoIcon || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Header Top Bar Phone / Helpline
            </label>
            <input
              type="text"
              name="headerPhone"
              value={formData.headerPhone || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Header Top Bar Announcement Text
            </label>
            <input
              type="text"
              name="announcementText"
              value={formData.announcementText || ''}
              onChange={handleChange}
              placeholder="Free Shipping on Orders Above Rs. 5,000 across Pakistan!"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Footer Platform Title & Stats */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563EB' }}>
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            2. Footer Headline &amp; Statistics Counters
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Footer Platform Big Title
            </label>
            <input
              type="text"
              name="footerPlatformTitle"
              value={formData.footerPlatformTitle || ''}
              onChange={handleChange}
              placeholder="PAKISTAN'S LARGEST HEALTHCARE PLATFORM"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {/* Stat 1 */}
            <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: 12, color: '#800020', display: 'block', marginBottom: 6 }}>Stat 1 (e.g. Buyers)</strong>
              <input
                type="text"
                name="footerStat1Number"
                value={formData.footerStat1Number || ''}
                onChange={handleChange}
                placeholder="1M+"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 6 }}
              />
              <input
                type="text"
                name="footerStat1Label"
                value={formData.footerStat1Label || ''}
                onChange={handleChange}
                placeholder="Satisfied Buyers"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
              />
            </div>

            {/* Stat 2 */}
            <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: 12, color: '#800020', display: 'block', marginBottom: 6 }}>Stat 2 (e.g. Orders)</strong>
              <input
                type="text"
                name="footerStat2Number"
                value={formData.footerStat2Number || ''}
                onChange={handleChange}
                placeholder="2M+"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 6 }}
              />
              <input
                type="text"
                name="footerStat2Label"
                value={formData.footerStat2Label || ''}
                onChange={handleChange}
                placeholder="Orders Delivered"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
              />
            </div>

            {/* Stat 3 */}
            <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: 12, color: '#800020', display: 'block', marginBottom: 6 }}>Stat 3 (e.g. Guarantee)</strong>
              <input
                type="text"
                name="footerStat3Number"
                value={formData.footerStat3Number || ''}
                onChange={handleChange}
                placeholder="100%"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 6 }}
              />
              <input
                type="text"
                name="footerStat3Label"
                value={formData.footerStat3Label || ''}
                onChange={handleChange}
                placeholder="Moneyback Guarantee"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Footer Values & Propositions */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#800020' }}>
            <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
          </svg>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            3. Footer 3 Value Pillars
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {/* Pillar 1 */}
          <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Pillar 1 Title</label>
            <input
              type="text"
              name="footerValue1Title"
              value={formData.footerValue1Title || ''}
              onChange={handleChange}
              placeholder="Reliable"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Description</label>
            <textarea
              rows="3"
              name="footerValue1Desc"
              value={formData.footerValue1Desc || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
            />
          </div>

          {/* Pillar 2 */}
          <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Pillar 2 Title</label>
            <input
              type="text"
              name="footerValue2Title"
              value={formData.footerValue2Title || ''}
              onChange={handleChange}
              placeholder="Secure"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Description</label>
            <textarea
              rows="3"
              name="footerValue2Desc"
              value={formData.footerValue2Desc || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
            />
          </div>

          {/* Pillar 3 */}
          <div style={{ padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Pillar 3 Title</label>
            <input
              type="text"
              name="footerValue3Title"
              value={formData.footerValue3Title || ''}
              onChange={handleChange}
              placeholder="Affordable"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 3 }}>Description</label>
            <textarea
              rows="3"
              name="footerValue3Desc"
              value={formData.footerValue3Desc || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Social Links & Copyright */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#0284C7' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            4. Social Media Links, Phone &amp; Copyright Clause
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Facebook Page URL</label>
            <input
              type="url"
              name="socialFacebook"
              value={formData.socialFacebook || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Instagram Profile URL</label>
            <input
              type="url"
              name="socialInstagram"
              value={formData.socialInstagram || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>LinkedIn Company URL</label>
            <input
              type="url"
              name="socialLinkedin"
              value={formData.socialLinkedin || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Footer Contact Helpline</label>
            <input
              type="text"
              name="footerPhone"
              value={formData.footerPhone || ''}
              onChange={handleChange}
              placeholder="0303 7333378"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Footer Copyright Text
            </label>
            <input
              type="text"
              name="footerCopyright"
              value={formData.footerCopyright || ''}
              onChange={handleChange}
              placeholder="© 2007-2025 Surgicals.pk . Market By Hukumat Networks"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Card 5: Category Tagline & SEO Meta Tags */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#D97706' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            5. Category Pages Tagline &amp; SEO Meta Tags
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Category Page Banner Subtitle / Tagline
            </label>
            <input
              type="text"
              name="categoryTagline"
              value={formData.categoryTagline || ''}
              onChange={handleChange}
              placeholder="High grade medical and surgical supplies certified for clinical use across Pakistan."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Global Browser Title Tag (&lt;title&gt;)
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle || ''}
              onChange={handleChange}
              placeholder="Surgicals.PK - Hospital & Medical Equipment Pakistan"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Global Meta Description Tag (&lt;meta name="description"&gt;)
            </label>
            <textarea
              rows="2"
              name="metaDescription"
              value={formData.metaDescription || ''}
              onChange={handleChange}
              placeholder="Shop verified hospital-grade surgical items, medical furniture..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Meta Keywords Tag
            </label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords || ''}
              onChange={handleChange}
              placeholder="surgical equipment pakistan, medical instruments lahore, hospital furniture"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
        <button
          type="submit"
          disabled={isSaving}
          className="btn-solid-maroon"
          style={{ padding: '11px 28px', borderRadius: 6, fontSize: 14, fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Publishing...' : 'Publish Header, Footer &amp; SEO Changes'}
        </button>
      </div>

    </form>
  );
};
