import React, { useState } from 'react';

export const InventorySection = ({
  products = [],
  categories = [],
  refreshProducts,
  onDeleteProduct,
  onEditProduct,
  onQuickStockUpdate
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, in_stock, low_stock, out_of_stock
  const [sortBy, setSortBy] = useState('default'); // default, price_asc, price_desc, stock_asc

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;

    const stock = Number(p.stock) || 0;
    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = stock > 5;
    else if (stockFilter === 'low_stock') matchesStock = stock > 0 && stock <= 5;
    else if (stockFilter === 'out_of_stock') matchesStock = stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'stock_asc') return (Number(a.stock) || 0) - (Number(b.stock) || 0);
    return 0;
  });

  const handleStockDelta = (p, delta) => {
    const current = Number(p.stock) || 0;
    const next = Math.max(0, current + delta);
    if (onQuickStockUpdate) {
      onQuickStockUpdate(p.id, next);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, backgroundColor: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
            Catalog Inventory ({sortedProducts.length} items)
          </span>
          <button
            type="button"
            onClick={refreshProducts}
            className="btn-framed"
            style={{ padding: '4px 10px', fontSize: 11.5, borderRadius: 4 }}
          >
            Refresh
          </button>
        </div>

        {/* Filters Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, outline: 'none', backgroundColor: '#FFF' }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, outline: 'none', backgroundColor: '#FFF' }}
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1–5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, outline: 'none', backgroundColor: '#FFF' }}
          >
            <option value="default">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_asc">Stock: Low to High</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 6,
              border: '1px solid #D1D5DB',
              fontSize: 12,
              minWidth: 200,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* 2. Product Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
          <thead>
            <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
              <th style={{ padding: '12px 16px' }}>Product</th>
              <th style={{ padding: '12px 16px' }}>SKU</th>
              <th style={{ padding: '12px 16px' }}>Price</th>
              <th style={{ padding: '12px 16px' }}>Stock Level</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                  No medical equipment found matching your current filter criteria.
                </td>
              </tr>
            ) : (
              sortedProducts.map(p => {
                const stockNum = Number(p.stock) || 0;
                const isLow = stockNum > 0 && stockNum <= 5;
                const isOut = stockNum <= 0;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={p.image || '/assets/banners/wheelchair.png'}
                          alt={p.name}
                          style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6, border: '1px solid #E2E8F0', backgroundColor: '#FFF' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A', maxWidth: 300, lineHeight: 1.3 }}>
                            {p.name}
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                            {p.onSale && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3, backgroundColor: '#FDE8E8', color: '#9B1C1C' }}>
                                SALE
                              </span>
                            )}
                            {p.bestSeller && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3, backgroundColor: '#FEF08A', color: '#713F12' }}>
                                BESTSELLER
                              </span>
                            )}
                            {p.featured && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3, backgroundColor: '#E1EFFE', color: '#1E429F' }}>
                                FEATURED
                              </span>
                            )}
                            {Array.isArray(p.variants) && p.variants.length > 0 && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3, backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
                                {p.variants.length} {p.variantLabel || 'Variants'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: 14, color: '#64748B', fontFamily: 'monospace', fontSize: 12 }}>
                      {p.sku || '—'}
                    </td>

                    <td style={{ padding: 14 }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>
                        Rs {Number(p.price).toLocaleString()}
                      </div>
                      {p.originalPrice && (
                        <div style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>
                          Rs {Number(p.originalPrice).toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Inline Stock Adjustment */}
                    <td style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleStockDelta(p, -1)}
                          disabled={stockNum <= 0}
                          title="Decrease stock by 1"
                          style={{
                            width: 24,
                            height: 24,
                            border: '1px solid #CBD5E1',
                            borderRadius: 4,
                            backgroundColor: '#FFF',
                            cursor: stockNum <= 0 ? 'not-allowed' : 'pointer',
                            fontSize: 14,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569'
                          }}
                        >
                          -
                        </button>

                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 700,
                          minWidth: 70,
                          textAlign: 'center',
                          backgroundColor: isOut ? '#FDE8E8' : isLow ? '#FEF08A' : '#DEF7EC',
                          color: isOut ? '#9B1C1C' : isLow ? '#713F12' : '#03543F'
                        }}>
                          {isOut ? 'Out of Stock' : `${stockNum} units`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleStockDelta(p, 1)}
                          title="Increase stock by 1"
                          style={{
                            width: 24,
                            height: 24,
                            border: '1px solid #CBD5E1',
                            borderRadius: 4,
                            backgroundColor: '#FFF',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: 14, color: '#64748B', fontSize: 12.5 }}>
                      {p.categoryName || p.categoryId}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ padding: 14, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => onEditProduct && onEditProduct(p)}
                          style={{
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: 5,
                            padding: '4px 10px',
                            color: '#0F172A',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 12
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id, p.name)}
                          style={{
                            background: 'none',
                            border: '1px solid #FECDD3',
                            borderRadius: 5,
                            padding: '4px 8px',
                            color: '#BE123C',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 12,
                            backgroundColor: '#FFF1F2'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
