import React, { useState, useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryHub } from '../components/home/CategoryHub';
import { BodyBelts } from '../components/home/BodyBelts';
import { PromoBanners } from '../components/home/PromoBanners';
import { SiteStorySection } from '../components/common/SiteStorySection';
import { ProductCard } from '../components/common/ProductCard';
import { useProducts } from '../context/ProductContext';
import { api } from '../services/api';

const DEFAULT_SECTIONS = [
  { id: 'hero', active: true },
  { id: 'categories', active: true },
  { id: 'belts', active: true },
  { id: 'promo-3col', active: true },
  { id: 'promo-split', active: true },
  { id: 'best-sellers', active: true },
  { id: 'story', active: true }
];

export const HomePage = () => {
  const { filteredProducts } = useProducts();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    let isMounted = true;
    api.cms.getHomepageSections()
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const list = data.filter(s => s.id !== 'brands');
          // Guarantee Hero is at the top of the homepage (index 0)
          const heroIdx = list.findIndex(s => s.id === 'hero');
          if (heroIdx > 0) {
            const [heroSec] = list.splice(heroIdx, 1);
            list.unshift(heroSec);
          }
          setSections(list);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const renderSection = (sec) => {
    if (sec.active === false || sec.id === 'brands') return null;
    const content = sec.content || {};

    switch (sec.id) {
      case 'hero':
        return <Hero key={sec.id} content={content} />;

      case 'categories':
        return <CategoryHub key={sec.id} content={content} />;

      case 'belts':
        return <BodyBelts key={sec.id} content={content} />;

      case 'promo-3col':
        return (
          <PromoBanners
            key={sec.id}
            content3Col={content}
            show3Col={true}
            showSplit={false}
            showBrands={false}
          />
        );

      case 'promo-split':
        return (
          <PromoBanners
            key={sec.id}
            contentSplit={content}
            show3Col={false}
            showSplit={true}
            showBrands={false}
          />
        );


      case 'best-sellers': {
        const displayLimit = Number(content.itemLimit) || 10;
        const productsToShow = filteredProducts.slice(0, displayLimit);
        return (
          <section key={sec.id} className="section-padding" id="best-selling-products-section" style={{ paddingTop: 8, paddingBottom: 50, backgroundColor: '#FFFFFF' }}>
            <div className="site-container">
              <div className="best-selling-header" style={{ marginBottom: 18 }}>
                <div>
                  <h2 className="best-selling-title">{content.title || 'BEST SELLING PRODUCTS'}</h2>
                  {content.subtitle && (
                    <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{content.subtitle}</p>
                  )}
                </div>
              </div>

              {productsToShow.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F8F9FA', borderRadius: 12 }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" style={{ display: 'inline-block', marginBottom: 8 }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3 style={{ marginTop: 8, fontSize: 18, color: '#000000' }}>No Products Found</h3>
                  <p style={{ color: '#666666', fontSize: 13, marginTop: 4 }}>
                    Try adjusting your search query or medical category filters.
                  </p>
                </div>
              ) : (
                <div className="products-grid-5">
                  {productsToShow.map((p, idx) => (
                    <ProductCard key={p.id ? `${p.id}-${idx}` : idx} product={p} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      }

      case 'story':
        return <SiteStorySection key={sec.id} content={content} />;

      default:
        return null;
    }
  };

  return (
    <>
      {sections.map((sec, idx) => {
        const rendered = renderSection(sec);
        if (!rendered) return null;
        return (
          <React.Fragment key={sec.id ? `sec-${sec.id}-${idx}` : `sec-idx-${idx}`}>
            {rendered}
          </React.Fragment>
        );
      })}
    </>
  );
};
