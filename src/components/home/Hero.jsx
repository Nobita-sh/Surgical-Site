import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = ({ content = {} }) => {
  const tagline = content.tagline || 'Online Surgical Equipment store in Pakistan';
  const title = content.title || 'Boost Your Health with Surgicals.pk';
  const subtext = content.subtext || 'Shop hospital-grade surgical items, medical furniture, diagnostic devices, and mobility aids with 100% genuine warranty & nationwide delivery.';
  const primaryBtnText = content.primaryBtnText || 'SHOP NOW';
  const primaryBtnLink = content.primaryBtnLink || '/shop';
  const whatsappBtnText = content.whatsappBtnText || 'ORDER ON WHATSAPP';
  const whatsappNumber = content.whatsappNumber || '923037333378';

  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-content-wrap">
          <div className="hero-tagline">
            {tagline}
          </div>
          
          <h1 className="hero-title-main" style={{ whiteSpace: 'pre-line' }}>
            {title}
          </h1>
          
          <p className="hero-subtext">
            {subtext}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to={primaryBtnLink} className="btn-hero-shop-now">
              {primaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
