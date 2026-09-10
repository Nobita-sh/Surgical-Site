import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

export const CategoriesSection = ({
  categories,
  products,
  onAddCategory,
  onDeleteCategory
}) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });

  const filteredCategories = search
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Category name is required', 'error');
      return;
    }

    const created = onAddCategory(formData);
    addToast(`Category "${created.name}" created successfully!`);
    setFormData({ name: '', slug: '', image: '', description: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }
    onDeleteCategory(id);
    addToast(`Category "${name}" removed from catalog.`);
  };

  // Count products in each category
  const getProductCount = (categoryId) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Controls */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Medical Catalog Categories ({categories.length})
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Organize medical equipment, diagnostic instruments, and orthopedic lines across the store.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #D1D5DB',
              fontSize: 13,
              minWidth: 220,
              outline: 'none'
            }}
          />

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-solid-maroon"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
          >
            {showAddForm ? 'Close Form' : '+ New Category'}
          </button>
        </div>
      </div>

      {/* Add Category Form Accordion */}
      {showAddForm && (
        <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #800020', maxWidth: 640 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#800020' }}>
            Create New Medical Specialty Category
          </h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Surgical Sutures &amp; Mesh"
                value={formData.name}
                onChange={e => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  });
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. surgical-sutures-mesh"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  placeholder="/assets/categories/sample.jpg"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                Category Description
              </label>
              <textarea
                rows="2"
                placeholder="Scope of clinical products and medical uses..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                className="btn-solid-maroon"
                style={{ padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
              >
                SAVE CATEGORY
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-framed"
                style={{ padding: '10px 16px', borderRadius: 6, fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table View */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 650 }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>URL Slug</th>
                <th style={{ padding: '12px 16px' }}>Catalog Products</th>
                <th style={{ padding: '12px 16px' }}>Live Storefront</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(cat => {
                const count = getProductCount(cat.id);
                return (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          style={{
                            width: 38,
                            height: 38,
                            objectFit: 'contain',
                            borderRadius: 6,
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FAFAFA'
                          }}
                        />
                        <div>
                          <strong style={{ color: '#0F172A', display: 'block', fontSize: 13.5 }}>{cat.name}</strong>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>ID: {cat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 14, color: '#64748B', fontFamily: 'monospace', fontSize: 12 }}>
                      /category/{cat.slug}
                    </td>
                    <td style={{ padding: 14 }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        fontWeight: 700,
                        backgroundColor: count > 0 ? '#E0E7FF' : '#F1F5F9',
                        color: count > 0 ? '#3730A3' : '#64748B'
                      }}>
                        {count} item{count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td style={{ padding: 14 }}>
                      <Link
                        to={`/category/${cat.slug}`}
                        target="_blank"
                        style={{ color: '#800020', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}
                      >
                        Preview Page &rarr;
                      </Link>
                    </td>
                    <td style={{ padding: 14, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#BE123C',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 12
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
