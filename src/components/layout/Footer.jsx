import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { sanitizeUrl } from '../../utils/security';

export const Footer = () => {
  const spotlightRef = useRef(null);
  const [footerSettings, setFooterSettings] = useState({
    storeName: 'Surgicals.pk',
    footerPlatformTitle: "PAKISTAN'S LARGEST HEALTHCARE PLATFORM",
    footerStat1Number: '1M+',
    footerStat1Label: 'Satisfied Buyers',
    footerStat2Number: '2M+',
    footerStat2Label: 'Orders Delivered',
    footerStat3Number: '100%',
    footerStat3Label: 'Moneyback Guarantee',
    footerValue1Title: 'Reliable',
    footerValue1Desc: 'All products displayed are verified and of high quality with 100% satisfaction.',
    footerValue2Title: 'Secure',
    footerValue2Desc: 'SSL 128-bit encryption and Payment Card Industry Data Security Standard compliant.',
    footerValue3Title: 'Affordable',
    footerValue3Desc: 'Find affordable surgical items, save up to 60% on health products.',
    footerPhone: '0303 7333378',
    socialFacebook: 'https://www.facebook.com/Surgicalspk-105652255520730',
    socialInstagram: 'https://www.instagram.com/surgicals_pk/',
    socialLinkedin: 'https://www.linkedin.com/in/surgicals-pk-384448250/',
    footerCopyright: '© 2007-2025 Surgicals.pk . Market By Hukumat Networks'
  });

  useEffect(() => {
    let mounted = true;
    api.settings.get()
      .then(data => {
        if (mounted && data) {
          setFooterSettings(prev => ({
            ...prev,
            ...data,
            footerPlatformTitle: data.footerPlatformTitle || prev.footerPlatformTitle,
            footerCopyright: data.footerCopyright || prev.footerCopyright,
            footerPhone: data.footerPhone || data.contactPhone || prev.footerPhone
          }));
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleMouseMove = (e) => {
    if (spotlightRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.left = `${x}px`;
      spotlightRef.current.style.top = `${y}px`;
      spotlightRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  };

  return (
    <footer className="main-footer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Dynamic Cursor Spotlight Follower */}
      <div className="footer-cursor-spotlight" ref={spotlightRef} />

      <div className="site-container">
        
        {/* Tier 1: Platform Header & 3-Stat Counters */}
        <h2 className="footer-platform-title">{footerSettings.footerPlatformTitle}</h2>
        
        <div className="footer-stats-grid-3">
          <div className="footer-stat-item">
            <div className="stat-number">{footerSettings.footerStat1Number}</div>
            <div className="stat-label">{footerSettings.footerStat1Label}</div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-number">{footerSettings.footerStat2Number}</div>
            <div className="stat-label">{footerSettings.footerStat2Label}</div>
          </div>
          <div className="footer-stat-item">
            <div className="stat-number">{footerSettings.footerStat3Number}</div>
            <div className="stat-label">{footerSettings.footerStat3Label}</div>
          </div>
        </div>

        {/* Tier 1B: 3 Value Pillars */}
        <div className="footer-values-grid-3">
          <div className="footer-value-item">
            <h4>{footerSettings.footerValue1Title}</h4>
            <p>{footerSettings.footerValue1Desc}</p>
          </div>
          <div className="footer-value-item">
            <h4>{footerSettings.footerValue2Title}</h4>
            <p>{footerSettings.footerValue2Desc}</p>
          </div>
          <div className="footer-value-item">
            <h4>{footerSettings.footerValue3Title}</h4>
            <p>{footerSettings.footerValue3Desc}</p>
          </div>
        </div>

        {/* Top Horizontal Divider Line */}
        <hr className="footer-divider-line" />

        {/* Tier 2: 3-Column Logistics & Company Info */}
        <div className="footer-main-grid-3">
          
          {/* Col 1: Deliver to your doorstep */}
          <div className="footer-col-logistics">
            <div className="footer-col-doorstep-tag">DELIVER TO YOUR DOORSTEP</div>
            <div className="footer-col-doorstep-title">All over in Pakistan</div>
            <div className="footer-courier-badges">
              <span className="courier-badge-pill" title="Daewoo Fastex Courier">
                Daewoo Fastex
              </span>
              <span className="courier-badge-pill" title="Leopards Courier">
                Leopards Courier
              </span>
              <span className="courier-badge-pill" title="TCS Express">
                TCS Express
              </span>
            </div>
          </div>

          {/* Col 2: About Our Company */}
          <div className="footer-col-company">
            <div className="footer-col-heading">ABOUT OUR COMPANY</div>
            <ul className="footer-company-links">
              <li><Link to="/about">Company Details</Link></li>
              <li><Link to="/blog">Articles &amp; Information</Link></li>
              <li><Link to="/advertise">Adverties with us</Link></li>
              <li><Link to="/partnership">Business Partnership</Link></li>
              <li><Link to="/contact">Get In Touch</Link></li>
            </ul>
          </div>

          {/* Col 3: Helpline & Socials */}
          <div className="footer-col-contact">
            <a href={`tel:${footerSettings.footerPhone.replace(/[^0-9]/g, '')}`} className="footer-phone-big">
              {footerSettings.footerPhone}
            </a>
            <div className="footer-social-title">FOLLOW US ON SOCIAL MEDIA</div>
            <div className="footer-social-icons">
              {footerSettings.socialFacebook && (
                <a href={sanitizeUrl(footerSettings.socialFacebook)} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/></svg>
                </a>
              )}
              {footerSettings.socialLinkedin && (
                <a href={sanitizeUrl(footerSettings.socialLinkedin)} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="LinkedIn">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
              {footerSettings.socialInstagram && (
                <a href={sanitizeUrl(footerSettings.socialInstagram)} target="_blank" rel="noopener noreferrer" className="footer-social-icon-btn" title="Instagram">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Divider Line */}
        <hr className="footer-divider-line" />

        {/* Tier 3: Bottom Copyright & Policies */}
        <div className="footer-bottom-row">
          <div>
            {footerSettings.footerCopyright}
          </div>
          <div className="footer-policy-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/returns">Return Policy</Link>
            <Link to="/group-companies">Group Companies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
