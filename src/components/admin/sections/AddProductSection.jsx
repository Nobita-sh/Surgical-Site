import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../../services/api';

const VARIANT_PRESETS = [
  {
    name: 'Apparel Sizes (S, M, L, XL, XXL)',
    label: 'Size',
    options: ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)', 'XXL']
  },
  {
    name: 'Basic Sizes (S, M, L, XL)',
    label: 'Size',
    options: ['S', 'M', 'L', 'XL']
  },
  {
    name: 'Mounting / Stand Types',
    label: 'Mounting Type',
    options: ['Desk Stand', 'Floor Stand', 'Wall Mount']
  },
  {
    name: 'Liquid Volumes',
    label: 'Volume',
    options: ['100 ml', '250 ml', '500 ml', '1 Liter', '5 Liters']
  },
  {
    name: 'Packaging Bundles',
    label: 'Package',
    options: ['Pack of 10', 'Pack of 50', 'Box of 100']
  },
  {
    name: 'Operation / Power Mode',
    label: 'Model Type',
    options: ['Manual Operation', 'Electric / Battery Powered']
  }
];

const LABEL_SUGGESTIONS = ['Size', 'Option', 'Mounting Type', 'Volume', 'Model Type', 'Color', 'Package'];

export const AddProductSection = ({
  categories = [],
  productToEdit = null,
  onAddProduct,
  onUpdateProduct,
  onCancel
}) => {
  const isEditing = Boolean(productToEdit && productToEdit.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'diagnostic-accessories',
    categoryName: 'Diagnostic Accessories',
    price: '',
    originalPrice: '',
    stock: 10,
    sku: '',
    image: '',
    shortDescription: '',
    description: '',
    onSale: false,
    featured: false,
    bestSeller: false
  });

  // Variant / Options State
  const [hasVariants, setHasVariants] = useState(false);
  const [variantLabel, setVariantLabel] = useState('Size');
  const [variants, setVariants] = useState([]);
  const [newVariantInput, setNewVariantInput] = useState('');

  const handleAddVariant = (customValue) => {
    const val = (customValue !== undefined ? customValue : newVariantInput).trim();
    if (!val) return;
    if (variants.includes(val)) {
      setNewVariantInput('');
      return;
    }
    setVariants(prev => [...prev, val]);
    setNewVariantInput('');
  };

  const handleRemoveVariant = (indexToRemove) => {
    setVariants(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplyPreset = (preset) => {
    setVariantLabel(preset.label);
    setVariants(preset.options);
  };

  const handleKeyDownVariant = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariant();
    }
  };

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [useUrlMode, setUseUrlMode] = useState(false);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image exceeds 20MB limit. Please select a smaller file.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;
    setFileInfo({ name: file.name, size: sizeStr });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      setFormData(prev => ({ ...prev, image: base64Data }));

      try {
        const res = await api.products.uploadImage(base64Data, file.name);
        if (res && res.url) {
          setFormData(prev => ({ ...prev, image: res.url }));
        }
      } catch (err) {
        console.warn('Backend upload notice (using local image):', err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setFileInfo(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        categoryId: productToEdit.categoryId || 'diagnostic-accessories',
        categoryName: productToEdit.categoryName || 'Diagnostic Accessories',
        price: productToEdit.price !== undefined ? String(productToEdit.price) : '',
        originalPrice: productToEdit.originalPrice ? String(productToEdit.originalPrice) : '',
        stock: productToEdit.stock !== undefined ? Number(productToEdit.stock) : 10,
        sku: productToEdit.sku || '',
        image: productToEdit.image || '',
        shortDescription: productToEdit.shortDescription || '',
        description: productToEdit.description || '',
        onSale: Boolean(productToEdit.onSale),
        featured: Boolean(productToEdit.featured),
        bestSeller: Boolean(productToEdit.bestSeller)
      });
      const editVariants = Array.isArray(productToEdit.variants) ? productToEdit.variants : [];
      setHasVariants(editVariants.length > 0);
      setVariantLabel(productToEdit.variantLabel || 'Size');
      setVariants(editVariants);
      setNewVariantInput('');
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || 'diagnostic-accessories',
        categoryName: categories[0]?.name || 'Diagnostic Accessories',
        price: '',
        originalPrice: '',
        stock: 10,
        sku: '',
        image: '',
        shortDescription: '',
        description: '',
        onSale: false,
        featured: false,
        bestSeller: false
      });
      setHasVariants(false);
      setVariantLabel('Size');
      setVariants([]);
      setNewVariantInput('');
    }
  }, [productToEdit, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      return;
    }

    setIsSubmitting(true);
    try {
      const cat = categories.find(c => c.id === formData.categoryId);
      const payload = {
        ...formData,
        categoryName: cat ? cat.name : formData.categoryName || 'General Equipment',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock) || 0,
        onSale: Boolean(formData.onSale),
        featured: Boolean(formData.featured),
        bestSeller: Boolean(formData.bestSeller),
        variantLabel: hasVariants && variants.length > 0 ? (variantLabel.trim() || 'Option') : '',
        variants: hasVariants ? variants : []
      };

      if (isEditing && onUpdateProduct) {
        await onUpdateProduct(productToEdit.id, payload);
      } else if (onAddProduct) {
        await onAddProduct(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, backgroundColor: '#FFFFFF', padding: 26, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            {isEditing ? `Edit Product: ${productToEdit.name}` : 'Create New Medical Catalog Listing'}
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            {isEditing ? 'Update pricing, stock levels, and clinical specifications.' : 'Add genuine hospital equipment, diagnostic tools, or rehabilitation devices.'}
          </p>
        </div>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-framed"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            &larr; Back to Inventory
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Product Title */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Product Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Electric Suction Apparatus Double Jar"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13.5 }}
          />
        </div>

        {/* Category & SKU */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Specialty Category</label>
            <select
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, backgroundColor: '#FFF' }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>SKU Code</label>
            <input
              type="text"
              placeholder="e.g. SUC-APP-01"
              value={formData.sku}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Selling Price (PKR) *</label>
            <input
              type="number"
              required
              placeholder="55000"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13.5, fontWeight: 600 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Original Price (If Strikethrough)</label>
            <input
              type="number"
              placeholder="60000"
              value={formData.originalPrice}
              onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13.5 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Stock Available</label>
            <input
              type="number"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13.5 }}
            />
          </div>
        </div>

        {/* Product Options & Variations Builder */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          {/* Header & Toggle Checkbox */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={e => {
                    const checked = e.target.checked;
                    setHasVariants(checked);
                    if (checked && variants.length === 0) {
                      setVariantLabel('Size');
                      setVariants(['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)']);
                    }
                  }}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#800020' }}
                />
                Enable Product Options / Variations (e.g. Sizes, Mountings, Volumes)
              </label>
              <p style={{ margin: '3px 0 0 25px', fontSize: 12, color: '#64748B' }}>
                Toggle on if buyers can choose different options (such as Small/Medium/Large or Desk/Floor Stand). If unticked, no option selector will appear on the product page.
              </p>
            </div>

            {hasVariants && variants.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, backgroundColor: '#E0E7FF', color: '#3730A3' }}>
                {variants.length} {variants.length === 1 ? 'Option' : 'Options'} Configured
              </span>
            )}
          </div>

          {/* Collapsible Content when hasVariants is true */}
          {hasVariants && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10, borderTop: '1px dashed #CBD5E1' }}>
              {/* Row 1: Option Attribute Label */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Option Type / Attribute Name
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="e.g. Size, Option, Mounting Type, Volume"
                    value={variantLabel}
                    onChange={e => setVariantLabel(e.target.value)}
                    style={{ flex: '1 1 200px', maxWidth: 300, padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, backgroundColor: '#FFF' }}
                  />
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Quick Names:</span>
                    {LABEL_SUGGESTIONS.map(sug => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setVariantLabel(sug)}
                        style={{
                          padding: '3px 9px',
                          fontSize: 11,
                          fontWeight: variantLabel === sug ? 700 : 500,
                          borderRadius: 4,
                          border: variantLabel === sug ? '1px solid #800020' : '1px solid #CBD5E1',
                          backgroundColor: variantLabel === sug ? '#FFF1F2' : '#FFFFFF',
                          color: variantLabel === sug ? '#800020' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Add Custom Option Value */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Add Option Values / Choices
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 520 }}>
                  <input
                    type="text"
                    placeholder="Type an option (e.g. 'XXL' or 'Floor Stand') and press Enter"
                    value={newVariantInput}
                    onChange={e => setNewVariantInput(e.target.value)}
                    onKeyDown={handleKeyDownVariant}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, backgroundColor: '#FFF' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVariant()}
                    className="btn-framed"
                    style={{ padding: '8px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              {/* Row 3: Quick 1-Click Preset Bundles */}
              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 5 }}>
                  Or apply a 1-click Preset Bundle:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {VARIANT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      style={{
                        padding: '4px 10px',
                        fontSize: 11,
                        borderRadius: 4,
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#1E293B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                      title={`Sets ${preset.label}: ${preset.options.join(', ')}`}
                    >
                      <span style={{ fontWeight: 700, color: '#800020' }}>+</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Currently Configured Option Chips */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    Configured {variantLabel || 'Option'} Choices ({variants.length})
                  </span>
                  {variants.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setVariants([])}
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {variants.length === 0 ? (
                  <div style={{ padding: '10px 14px', backgroundColor: '#FEF2F2', border: '1px dashed #FECACA', borderRadius: 6, fontSize: 12, color: '#991B1B' }}>
                    ⚠️ No option choices added yet. Please type an option above and click <strong>Add Option</strong> or choose a preset.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {variants.map((v, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#FFF1F2',
                          color: '#800020',
                          border: '1px solid #FECDD3',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#800020',
                            fontSize: 14,
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1,
                            fontWeight: 700
                          }}
                          title="Remove option"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 5: Live Storefront Preview */}
              {variants.length > 0 && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '12px 16px',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  marginTop: 2
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                    Customer Storefront Preview
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
                      {variantLabel || 'Option'}:
                    </span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {variants.map((v, idx) => (
                        <span
                          key={v}
                          style={{
                            padding: '5px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 6,
                            border: idx === 0 ? '1.5px solid #800020' : '1px solid #CBD5E1',
                            backgroundColor: idx === 0 ? '#FFF1F2' : '#FFFFFF',
                            color: idx === 0 ? '#800020' : '#475569'
                          }}
                        >
                          {v} {idx === 0 && <span style={{ fontSize: 10, opacity: 0.8 }}>(default)</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Storefront Feature Toggles */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '14px 18px', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.onSale}
              onChange={e => setFormData({ ...formData, onSale: e.target.checked })}
            />
            Mark as "On Sale"
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.bestSeller}
              onChange={e => setFormData({ ...formData, bestSeller: e.target.checked })}
            />
            Highlight as "Best Seller"
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
            />
            Feature on Homepage
          </label>
        </div>

        {/* Product Photo Upload Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
              Product Photo / Image *
            </label>
            <button
              type="button"
              onClick={() => setUseUrlMode(!useUrlMode)}
              style={{
                background: 'none',
                border: 'none',
                color: '#A7144C',
                fontSize: 12,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              {useUrlMode ? '← Switch to File Upload' : 'Or enter image URL instead'}
            </button>
          </div>

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {useUrlMode ? (
            <div>
              <input
                type="text"
                placeholder="/assets/products/dp10-ultrasound.png or https://..."
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
              {formData.image && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={formData.image} alt="Preview" style={{ width: 48, height: 48, objectFit: 'contain', border: '1px solid #E2E8F0', borderRadius: 6, backgroundColor: '#FAFAFA' }} />
                  <span style={{ fontSize: 12, color: '#64748B' }}>URL Preview</span>
                </div>
              )}
            </div>
          ) : formData.image ? (
            /* Uploaded Image Card */
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={formData.image}
                    alt="Product"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12
                      }}
                    >
                      Photo Ready
                    </span>
                    {isUploading && (
                      <span style={{ fontSize: 11, color: '#0284C7', fontWeight: 600 }}>
                        (Saving to server...)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', wordBreak: 'break-all' }}>
                    {fileInfo?.name || (formData.image.startsWith('data:') ? 'Uploaded Photo' : formData.image.split('/').pop())}
                  </div>
                  {fileInfo?.size && (
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                      File Size: {fileInfo.size}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-framed"
                  style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid #FECACA',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#A7144C' : '#CBD5E1'}`,
                backgroundColor: isDragging ? '#FFF1F2' : '#F8FAFC',
                borderRadius: 8,
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: isDragging ? '#FFE4E6' : '#EEF2F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDragging ? '#A7144C' : '#64748B'
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1E293B' }}>
                    {isDragging ? 'Drop photo here to upload' : 'Click to upload product image or drag & drop'}
                  </span>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
                    PNG, JPG, WEBP, or SVG up to 20MB (Square image recommended)
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-framed"
                  style={{
                    padding: '6px 14px',
                    fontSize: 12,
                    borderRadius: 6,
                    pointerEvents: 'none',
                    marginTop: 4
                  }}
                >
                  Browse Device Files
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div style={{ color: '#DC2626', fontSize: 12, marginTop: 6, fontWeight: 600 }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Short Summary */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Short Description (Product Card Snippet)</label>
          <input
            type="text"
            placeholder="e.g. Clinical ultrasonic physiotherapy unit for deep muscle recovery."
            value={formData.shortDescription}
            onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
          />
        </div>

        {/* Long Description */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>Detailed Clinical Description</label>
          <textarea
            rows="4"
            placeholder="Full technical specifications, dimensions, warranty, accessories included..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, lineHeight: 1.5 }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-solid-maroon"
            style={{ padding: '12px 28px', borderRadius: 6, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: 13.5 }}
          >
            {isSubmitting ? 'SAVING CHANGES...' : isEditing ? 'UPDATE PRODUCT DETAILS' : 'PUBLISH PRODUCT TO STORE'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-framed"
              style={{ padding: '12px 22px', borderRadius: 6, fontSize: 13 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
