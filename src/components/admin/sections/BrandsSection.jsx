import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const BrandsSection = () => {
  const { addToast } = useToast();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '', country: 'Japan', status: 'Authorized Partner', logo: '' });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const data = await api.brands.getAll();
      setBrands(data);
    } catch (err) {
      addToast('Failed to load brands: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBrand.name) return;
    try {
      const created = await api.brands.create(newBrand);
      setBrands(prev => [...prev, created]);
      addToast(`Brand "${created.name}" added to partner catalog!`);
      setNewBrand({ name: '', country: 'Japan', status: 'Authorized Partner', logo: '' });
      setShowAddForm(false);
    } catch (err) {
      addToast('Failed to add brand: ' + err.message, 'error');
    }
  };

  const handleToggle = async (id, currentActive) => {
    try {
      const updated = await api.brands.update(id, { active: !currentActive });
      setBrands(prev => prev.map(b => b.id === id ? updated : b));
      addToast(`Brand "${updated.name}" visibility updated.`);
    } catch (err) {
      addToast('Failed to update brand: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove brand "${name}" from the store catalog?`)) return;
    try {
      await api.brands.delete(id);
      setBrands(prev => prev.filter(b => b.id !== id));
      addToast(`Brand "${name}" removed from partner catalog.`);
    } catch (err) {
      addToast('Failed to remove brand: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 22, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Brand &amp; Manufacturer Directory ({brands.length})
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Manage authorized medical brand partnerships, distributor status, and official vector logos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={loadBrands}
            className="btn-framed"
            style={{ padding: '8px 14px', borderRadius: 6, fontSize: 13 }}
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-solid-maroon"
            style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
          >
            {showAddForm ? 'Close Form' : '+ Add Brand'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #800020', maxWidth: 600 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#800020' }}>
            Add Medical Partner Brand
          </h4>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Roche Diagnostics"
                value={newBrand.name}
                onChange={e => setNewBrand({ ...newBrand, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                  Country of Origin
                </label>
                <input
                  type="text"
                  placeholder="Germany"
                  value={newBrand.country}
                  onChange={e => setNewBrand({ ...newBrand, country: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                  Partnership Status
                </label>
                <select
                  value={newBrand.status}
                  onChange={e => setNewBrand({ ...newBrand, status: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                >
                  <option value="Authorized Partner">Authorized Partner</option>
                  <option value="Official Distributor">Official Distributor</option>
                  <option value="Direct Importer">Direct Importer</option>
                  <option value="Clinical Partner">Clinical Partner</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>
                Logo SVG/Image Path
              </label>
              <input
                type="text"
                placeholder="/assets/brands/custom.svg"
                value={newBrand.logo}
                onChange={e => setNewBrand({ ...newBrand, logo: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                className="btn-solid-maroon"
                style={{ padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
              >
                SAVE BRAND
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

      {/* Brands Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading brands from server...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 650 }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '12px 16px' }}>Brand Logo</th>
                  <th style={{ padding: '12px 16px' }}>Brand Name</th>
                  <th style={{ padding: '12px 16px' }}>Origin</th>
                  <th style={{ padding: '12px 16px' }}>Partnership Level</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: 14 }}>
                      <div style={{ width: 80, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', border: '1px solid #E2E8F0', borderRadius: 4, padding: 4 }}>
                        <img src={b.logo} alt={b.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td style={{ padding: 14, fontWeight: 700, color: '#0F172A' }}>{b.name}</td>
                    <td style={{ padding: 14, color: '#64748B' }}>{b.country}</td>
                    <td style={{ padding: 14 }}>
                      <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: 14 }}>
                      <button
                        type="button"
                        onClick={() => handleToggle(b.id, b.active)}
                        className="btn-framed"
                        style={{
                          padding: '4px 10px',
                          fontSize: 11.5,
                          borderRadius: 4,
                          color: b.active ? '#03543F' : '#991B1B',
                          borderColor: b.active ? '#DEF7EC' : '#FECACA',
                          backgroundColor: b.active ? '#DEF7EC' : '#FEF2F2'
                        }}
                      >
                        {b.active ? 'Active on Slider' : 'Hidden'}
                      </button>
                    </td>
                    <td style={{ padding: 14, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.name)}
                        style={{ background: 'none', border: 'none', color: '#BE123C', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
