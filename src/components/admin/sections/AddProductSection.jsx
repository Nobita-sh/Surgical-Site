import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../../services/api';

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
        bestSeller: Boolean(formData.bestSeller)
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
