import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const POPULAR_CATEGORIES = [
  { id: 'bp-monitors', name: 'BP Monitors', slug: 'blood-pressure-monitors', image: '/assets/categories/bp-monitor.png' },
  { id: 'commode-chair', name: 'Commode Chair', slug: 'commode-chair', image: '/assets/categories/commode-chair.png' },
  { id: 'wheelchairs', name: 'Wheelchairs', slug: 'commode-chair', image: '/assets/categories/wheelchair.png' },
  { id: 'icu-monitors', name: 'ICU Monitors', slug: 'electro-medical', image: '/assets/categories/icu-monitor.png' },
  { id: 'autoclave', name: 'Autoclaves', slug: 'autoclave-sterilizer', image: '/assets/categories/autoclave.png' },
  { id: 'ultrasound', name: 'Ultrasound', slug: 'diagnostic-accessories', image: '/assets/categories/ultrasound.png' },
  { id: 'doctor-kits', name: 'Doctor Kits', slug: 'doctor-kits', image: '/assets/categories/doctor-kit.png' },
  { id: 'surgical-instruments', name: 'Surgical Sets', slug: 'doctor-kits', image: '/assets/categories/surgical-instruments.png' },
  { id: 'physiotherapy', name: 'Physiotherapy', slug: 'hot-cold-therapy', image: '/assets/categories/physiotherapy.png' },
  { id: 'walkers', name: 'Walkers', slug: 'commode-chair', image: '/assets/categories/walker.png' }
];

export const CategoryHub = ({ content = {} }) => {
  const trackRef = useRef(null);
  const title = content.title || 'MOST SELLING CATEGORIES';

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
    <section className="categories-section" id="category-hub-section">
      <div className="site-container">
        
        {/* Section Header with Slider Navigation */}
        <div className="section-header-flex">
          <div>
            <h2 className="section-title-clean">{title}</h2>
            {content.subtitle && (
              <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{content.subtitle}</p>
            )}
          </div>
          
          <div className="section-actions-wrap">
            <div className="categories-slider-nav desktop-only-nav">
              <button
                type="button"
                onClick={scrollLeft}
                className="slider-nav-btn"
                aria-label="Previous categories"
                title="Previous"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="slider-nav-btn"
                aria-label="Next categories"
                title="Next"
              >
                &#8250;
              </button>
            </div>

            <Link to="/shop" className="btn-view-all-link">
              <span>View All</span>
              <span>&raquo;</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Swipeable Category Slider */}
        <div className="categories-slider-track" ref={trackRef}>
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="category-slider-card"
              title={`Browse ${cat.name}`}
            >
              <div className="category-circle-img-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                />
              </div>
              <div className="category-circle-title">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
