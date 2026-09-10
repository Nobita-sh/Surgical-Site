import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const ShopPage = () => {
  const { products, categories } = useProducts();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialSale = searchParams.get('sale') === 'true';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlySale, setOnlySale] = useState(initialSale);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(600000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredCatalog = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (onlySale && !p.onSale) return false;
      if (onlyInStock && p.stock <= 0) return false;
      if (p.price > maxPrice) return false;
      if (initialSearch && !p.name.toLowerCase().includes(initialSearch.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, selectedCategory, onlySale, onlyInStock, maxPrice, initialSearch, sortBy]);

  return (
    <div className="site-container" style={{ padding: '24px 15px 60px' }}>
      
      {/* Page Breadcrumb & Header */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #ECECEC', paddingBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
          <span>Home</span> / <strong style={{ color: '#000' }}>Shop Catalog</strong>
          {initialSearch && <span> / Results for "{initialSearch}"</span>}
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          Medical &amp; Surgical Catalog
        </h1>
      </div>

      {/* Main Grid: Sidebar Filters (Left) + Products Grid (Right) */}
      <div className="shop-layout-grid">
        
        {/* Left Sidebar Filters */}
        <aside className={`shop-sidebar-filters ${isMobileFiltersOpen ? 'mobile-show' : ''}`} style={{ backgroundColor: '#F9FAFB', padding: 20, borderRadius: 12, border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>
            Filter Products
          </h3>

          {/* Category Filter */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Categories
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #DDD', fontSize: 12 }}
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              <span>Max Price:</span>
              <span style={{ color: '#059669' }}>Rs {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="600000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Checkbox Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
              />
              <span>Items on Sale Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlySale(false);
              setOnlyInStock(false);
              setMaxPrice(600000);
              setSortBy('default');
            }}
            className="btn-framed"
            style={{ width: '100%', marginTop: 20, padding: 8, fontSize: 12, borderRadius: 6 }}
          >
            Reset All Filters
          </button>
        </aside>

        {/* Right Catalog Area */}
        <main style={{ minWidth: 0, width: '100%' }}>
          
          {/* Unified Filter & Sort Toolbar (Single Compact Bar) */}
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
            {/* Filter Toggle on Mobile / Items Count on Desktop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="mobile-only-filter-btn btn-framed btn-framed-sm"
                style={{
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span>Filter ({filteredCatalog.length})</span>
                <span style={{ fontSize: 9 }}>{isMobileFiltersOpen ? '▲' : '▼'}</span>
              </button>

              <span className="desktop-only-items-count" style={{ fontSize: 13, color: '#666' }}>
                Showing <strong>{filteredCatalog.length}</strong> items
              </span>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }} className="desktop-only">Sort by:</span>
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

          {/* Products Grid */}
          {filteredCatalog.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F8F9FA', borderRadius: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" style={{ display: 'inline-block', marginBottom: 8 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3 style={{ marginTop: 8, fontSize: 18, color: '#000000' }}>No Products Match Your Criteria</h3>
              <p style={{ color: '#666666', fontSize: 13, marginTop: 4 }}>
                Try resetting your filters or increasing the max price range.
              </p>
            </div>
          ) : (
            <div className="products-grid-5">
              {filteredCatalog.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
