import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGOS } from '../../data/seedData';
import { api } from '../../services/api';

export const PromoBanners = ({ content3Col = {}, contentSplit = {}, brandsTitle = 'OFFICIAL MEDICAL BRAND PARTNERS', show3Col = true, showSplit = true, showBrands = true }) => {
  const brandsTrackRef = useRef(null);
  const [brands, setBrands] = useState(BRAND_LOGOS);

  useEffect(() => {
    let mounted = true;
    api.brands.getAll()
      .then(data => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setBrands(data.filter(b => b.active !== false));
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const scrollBrandsLeft = () => {
    if (brandsTrackRef.current) {
      brandsTrackRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollBrandsRight = () => {
    if (brandsTrackRef.current) {
      brandsTrackRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // 3-Col Content with defaults
  const card1Title = content3Col.card1Title || 'Wheel Chair';
  const card1Link = content3Col.card1Link || '/category/commode-chair';
  const card1Image = content3Col.card1Image || '/assets/banners/wheelchair.png';

  const card2Title = content3Col.card2Title || 'Commode-Chairs';
  const card2Link = content3Col.card2Link || '/category/commode-chair';
  const card2Image = content3Col.card2Image || '/assets/banners/commode-chair.png';

  const card3Title = content3Col.card3Title || 'Walkers';
  const card3Link = content3Col.card3Link || '/category/commode-chair';
  const card3Image = content3Col.card3Image || '/assets/banners/walker.png';

  // Split Content with defaults
  const splitLeftTitle = contentSplit.splitLeftTitle || 'ITEMS ON SALE';
  const splitLeftDiscount = contentSplit.splitLeftDiscount || 'Explore Popular Offers';
  const splitLeftLink = contentSplit.splitLeftLink || '/shop?sale=true';

  const splitRightTitle = contentSplit.splitRightTitle || 'LATEST ITEMS';
  const splitRightDiscount = contentSplit.splitRightDiscount || 'Fresh Arrivals & New Tech';
  const splitRightLink = contentSplit.splitRightLink || '/shop?sort=newest';

  return (
    <section className="promo-banners-section">
      <div className="site-container">
        
        {/* Tier 1: 3-Column Feature Banners */}
        {show3Col && (
          <div className="promo-grid-3">
            
            {/* Banner 1: Wheel Chair */}
            <div className="feature-banner-card" style={{ backgroundColor: '#FDF2F8' }}>
              <div className="feature-bg-circle-left"></div>
              <div className="feature-bg-circle-right"></div>
              <Link to={card1Link} className="feature-tag-btn">
                {card1Title} &rsaquo;
              </Link>
              <div className="feature-img-wrap">
                <img
                  src={card1Image}
                  alt={card1Title}
                />
              </div>
            </div>

            {/* Banner 2: Commode Chairs */}
            <div className="feature-banner-card" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="feature-bg-circle-left"></div>
              <div className="feature-bg-circle-right"></div>
              <Link to={card2Link} className="feature-tag-btn">
                {card2Title} &rsaquo;
              </Link>
              <div className="feature-img-wrap">
                <img
                  src={card2Image}
                  alt={card2Title}
                />
              </div>
            </div>

            {/* Banner 3: Walkers */}
            <div className="feature-banner-card" style={{ backgroundColor: '#ECFEFF' }}>
              <div className="feature-bg-circle-left"></div>
              <div className="feature-bg-circle-right"></div>
              <Link to={card3Link} className="feature-tag-btn">
                {card3Title} &rsaquo;
              </Link>
              <div className="feature-img-wrap">
                <img
                  src={card3Image}
                  alt={card3Title}
                />
              </div>
            </div>

          </div>
        )}

        {/* Tier 2: 2-Column Split Banners */}
        {showSplit && (
          <div className="promo-grid-2" style={{ marginTop: show3Col ? 24 : 0 }}>
            
            {/* Left: ITEMS ON SALE */}
            <div className="split-banner-card" style={{ backgroundColor: '#FFF7ED' }}>
              <div style={{ flex: 1, padding: '24px 20px' }}>
                <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {splitLeftDiscount}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', color: '#000' }}>
                  {splitLeftTitle}
                </h3>
                <Link to={splitLeftLink} className="feature-tag-btn">
                  Shop Now &raquo;
                </Link>
              </div>
              <div className="split-img-wrap">
                <img
                  src="/assets/banners/items-on-sale.png"
                  alt={splitLeftTitle}
                />
              </div>
            </div>

            {/* Right: LATEST ITEMS */}
            <div className="split-banner-card" style={{ backgroundColor: '#EFF6FF' }}>
              <div style={{ flex: 1, padding: '24px 20px' }}>
                <div style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {splitRightDiscount}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', color: '#000' }}>
                  {splitRightTitle}
                </h3>
                <Link to={splitRightLink} className="feature-tag-btn">
                  Shop Now &raquo;
                </Link>
              </div>
              <div className="split-img-wrap">
                <img
                  src="/assets/banners/latest-items.png"
                  alt={splitRightTitle}
                />
              </div>
            </div>

          </div>
        )}

        {/* Tier 3: Brand Logos Slider */}
        {showBrands && (
          <div className="brands-showcase-wrap" style={{ marginTop: (show3Col || showSplit) ? 40 : 0 }}>
            <div className="section-header-flex">
              <h2 className="section-title-clean">{brandsTitle}</h2>
              
              <div className="categories-slider-nav desktop-only-nav">
                <button
                  type="button"
                  onClick={scrollBrandsLeft}
                  className="slider-nav-btn"
                  aria-label="Previous brands"
                  title="Previous"
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  onClick={scrollBrandsRight}
                  className="slider-nav-btn"
                  aria-label="Next brands"
                  title="Next"
                >
                  &#8250;
                </button>
              </div>
            </div>

            <div className="brands-slider-track" ref={brandsTrackRef}>
              {brands.map((b) => (
                <div key={b.id} className="brand-logo-pill">
                  <img src={b.logo} alt={b.name} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
