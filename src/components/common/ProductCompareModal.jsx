import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';

export const ProductCompareModal = () => {
  const { compareList, isCompareModalOpen, closeCompareModal, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen || compareList.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 99998,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}
      onClick={closeCompareModal}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: 24
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
              Equipment Specification Comparison ({compareList.length}/4)
            </h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
              Side-by-side technical, clinical, and pricing comparison.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={clearCompare}
              className="btn-framed"
              style={{ padding: '5px 12px', fontSize: 11.5 }}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={closeCompareModal}
              style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#64748B' }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: compareList.length === 1 ? '100%' : 520 }}>
            <tbody>
              {/* Product Header / Image Row */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', width: 120, minWidth: 100, backgroundColor: '#F8FAFC', position: 'sticky', left: 0, zIndex: 1, boxShadow: '2px 0 4px rgba(0,0,0,0.03)' }}>
                  Equipment
                </td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: 14, verticalAlign: 'top', textAlign: 'center', minWidth: 180 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(p.id)}
                        title="Remove"
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: '#991B1B',
                          color: '#FFF',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 11,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 100, height: 100, objectFit: 'contain', backgroundColor: '#FAFAFA', borderRadius: 8, border: '1px solid #E2E8F0', padding: 8 }}
                      />
                    </div>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: 8, fontSize: 13.5, lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Selling Price
                </td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: 12, textAlign: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#800020' }}>
                      Rs. {Number(p.price).toLocaleString()}
                    </span>
                    {p.originalPrice && (
                      <div style={{ fontSize: 11, color: '#94A3B8', textDecoration: 'line-through' }}>
                        Rs. {Number(p.originalPrice).toLocaleString()}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Category &amp; SKU
                </td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: 12, textAlign: 'center', color: '#475569' }}>
                    <div><strong>{p.categoryName || p.categoryId}</strong></div>
                    <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{p.sku || 'N/A'}</div>
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Availability
                </td>
                {compareList.map(p => {
                  const isOut = Number(p.stock) <= 0;
                  return (
                    <td key={p.id} style={{ padding: 12, textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isOut ? '#FDE8E8' : '#DEF7EC',
                        color: isOut ? '#9B1C1C' : '#03543F'
                      }}>
                        {isOut ? 'Out of Stock' : 'In Stock (Ready to Ship)'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Clinical Description */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Features &amp; Use
                </td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: 12, fontSize: 12, color: '#475569', lineHeight: 1.5, textAlign: 'left' }}>
                    {p.shortDescription || p.description ? (
                      (p.shortDescription || p.description).slice(0, 140) + '...'
                    ) : (
                      'Certified clinical medical device with 7-day testing warranty.'
                    )}
                  </td>
                ))}
              </tr>

              {/* Compliance & Warranty */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Assurance
                </td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: 12, textAlign: 'center', fontSize: 11.5, color: '#03543F' }}>
                    100% Genuine Clinical<br />
                    7-Day Warranty<br />
                    Free TCS over Rs. 5k
                  </td>
                ))}
              </tr>

              {/* Add to Cart Actions */}
              <tr>
                <td style={{ padding: 12, fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}>
                  Action
                </td>
                {compareList.map(p => {
                  const isOut = Number(p.stock) <= 0;
                  return (
                    <td key={p.id} style={{ padding: 14, textAlign: 'center' }}>
                      <button
                        type="button"
                        disabled={isOut}
                        onClick={() => {
                          addToCart(p, 1);
                          closeCompareModal();
                        }}
                        className="btn-solid-maroon"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: isOut ? 'not-allowed' : 'pointer',
                          opacity: isOut ? 0.5 : 1
                        }}
                      >
                        {isOut ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
