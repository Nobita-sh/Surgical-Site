import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';
import { SiteStorySection } from '../components/common/SiteStorySection';
import { api } from '../services/api';

export const CategoryPage = () => {
  const { slug } = useParams();
  const { products, categories } = useProducts();
  const [sortBy, setSortBy] = useState('default');
  const [siteSettings, setSiteSettings] = useState({
    storeName: 'Surgicals.pk',
    categoryTagline: 'High grade medical and surgical supplies certified for clinical use across Pakistan.'
  });

  useEffect(() => {
    api.settings.get()
      .then(data => {
        if (data) {
          setSiteSettings(prev => ({
            ...prev,
            storeName: data.storeName || prev.storeName,
            categoryTagline: data.categoryTagline || prev.categoryTagline
          }));
        }
      })
      .catch(() => {});
  }, []);

  const currentCategory = categories.find(c => c.slug === slug || c.id === slug) || {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Medical Category',
    image: null
  };

  useEffect(() => {
    if (currentCategory?.name) {
      document.title = `${currentCategory.name} | ${siteSettings.storeName}`;
    }
  }, [currentCategory?.name, siteSettings.storeName]);

  const categoryProducts = useMemo(() => {
    return products.filter(p => 
      p.categoryId === slug || 
      p.categoryId?.includes(slug) || 
      p.categoryName?.toLowerCase().includes(slug?.replace(/-/g, ' ').toLowerCase())
    ).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, slug, sortBy]);

  return (
    <div className="site-container" style={{ padding: '30px 15px 60px' }}>
      
      {/* Category Hero / Breadcrumb */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #ECECEC', paddingBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link> /{' '}
          <Link to="/shop" style={{ color: '#666', textDecoration: 'none' }}>Categories</Link> /{' '}
          <strong style={{ color: '#000' }}>{currentCategory.name}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {currentCategory.image && (
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              style={{ width: 56, height: 56, objectFit: 'contain', backgroundColor: '#F8F6F6', borderRadius: '50%', padding: 6 }}
            />
          )}
          <div>
            <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
              {currentCategory.name}
            </h1>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>
              {currentCategory.description || currentCategory.tagline || siteSettings.categoryTagline}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Toolbar */}
      {categoryProducts.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
          backgroundColor: '#FFFFFF',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #ECECEC'
        }}>
          <span style={{ fontSize: 13, color: '#666' }}>
            Showing <strong>{categoryProducts.length}</strong> items
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#666' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #DDD',
                fontSize: 12,
                backgroundColor: '#FFFFFF',
                color: '#111111',
                fontWeight: 500,
                outline: 'none'
              }}
            >
              <option value="default">Default Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Category Product Catalog */}
      {categoryProducts.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F8F9FA', borderRadius: 12 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" style={{ display: 'inline-block', marginBottom: 8 }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <h3 style={{ marginTop: 8, fontSize: 18, color: '#000000' }}>Products Being Restocked</h3>
          <p style={{ color: '#666666', fontSize: 13, marginTop: 4 }}>
            New inventory for {currentCategory.name} is arriving shortly.
          </p>
          <Link to="/shop" className="btn-framed" style={{ display: 'inline-block', marginTop: 16, padding: '8px 16px', fontSize: 12 }}>
            Explore All Available Products
          </Link>
        </div>
      ) : (
        <div className="products-grid-5">
          {categoryProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Narrative Story Section */}
      <SiteStorySection />

    </div>
  );
};
