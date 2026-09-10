import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const BODY_BELTS_ITEMS = [
  { name: 'Knee Braces', slug: 'knee-support', count: 24, image: '/assets/belts/knee-brace.png' },
  { name: 'Back Belts', slug: 'cervical-collar', count: 22, image: '/assets/belts/back-belt.png' },
  { name: 'Foot & Ankle', slug: 'anti-embolism', count: 9, image: '/assets/belts/ankle-brace.png' },
  { name: 'Wrist Braces', slug: 'diagnostic-accessories', count: 14, image: '/assets/belts/wrist-brace.png' },
  { name: 'Shoulder Belts', slug: 'cervical-collar', count: 8, image: '/assets/belts/shoulder-brace.png' },
  { name: 'Elbow Braces', slug: 'knee-support', count: 7, image: '/assets/belts/elbow-brace.png' }
];

export const BodyBelts = ({ content = {} }) => {
  const trackRef = useRef(null);
  const title = content.title || 'UNISEX BODY BELT & BRACES';
  const viewAllLink = content.viewAllLink || '/category/knee-support';
  const viewAllText = content.viewAllText || 'View All';

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="body-belts-section">
      <div className="site-container">
        
        {/* Section Header with Slider Navigation */}
        <div className="section-header-flex">
          <h2 className="section-title-clean">{title}</h2>
          
          <div className="section-actions-wrap">
            <div className="categories-slider-nav desktop-only-nav">
              <button
                type="button"
                onClick={scrollLeft}
                className="slider-nav-btn"
                aria-label="Previous belts"
                title="Previous"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="slider-nav-btn"
                aria-label="Next belts"
                title="Next"
              >
                &#8250;
              </button>
            </div>

            <Link to={viewAllLink} className="btn-view-all-link">
              <span>{viewAllText}</span>
              <span>&raquo;</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Swipeable Belt Slider */}
        <div className="body-belts-slider-track" ref={trackRef}>
          {BODY_BELTS_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              to={`/category/${item.slug}`}
              className="belt-circle-card"
              title={`View ${item.name} (${item.count} Products)`}
            >
              <div className="belt-circle-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div className="belt-circle-title">{item.name}</div>
              <div className="belt-circle-count">{item.count} Products</div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
