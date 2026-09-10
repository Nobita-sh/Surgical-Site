import React from 'react';

export const SiteStorySection = ({ content = {} }) => {
  const heading = content.heading || 'Leading Surgical & Medical Equipment Supplier in Pakistan';
  const paragraph1 = content.paragraph1 || 'Welcome to Surgicals.pk. We are the proud supplier of physiotherapy machines and related instruments to clinics, hospitals, and home users across Pakistan. Whether you are looking for equipment like body massagers and heating pads, or a professional looking to upgrade your facility with advanced exercise machines, we have got you covered with a comprehensive range of clinical and rehabilitation products.';
  const paragraph2 = content.paragraph2 || 'Now you can save on the best physiotherapy machines for clinical and home use. Scroll our verified catalog of modern physical therapy modalities engineered specifically to aid swift patient recovery. At Surgicals.pk, all equipment meets rigid safety and performance benchmarks.';
  const paragraph3 = content.paragraph3 || 'We are envisioned to remain Pakistan\'s most reliable medical equipment partner with DRAP compliance, genuine manufacturer warranties, fair direct pricing, and dedicated biomedical after-sales support.';

  return (
    <section className="site-story-section">
      <div className="site-container">
        
        {/* Slanted Hatch Decorative Divider */}
        <div className="site-story-divider" aria-hidden="true">
          {"/".repeat(80)}
        </div>

        {/* Section Heading */}
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', color: '#0F172A', textTransform: 'uppercase' }}>
          {heading}
        </h3>

        {/* Narrative SEO Story Content */}
        <div className="site-story-content" style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.8 }}>
          {paragraph1 && <p style={{ marginBottom: 14 }}>{paragraph1}</p>}
          {paragraph2 && <p style={{ marginBottom: 14 }}>{paragraph2}</p>}
          {paragraph3 && <p style={{ margin: 0 }}>{paragraph3}</p>}
        </div>

      </div>
    </section>
  );
};
