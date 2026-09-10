import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { REVIEW_HOMEPAGE_SECTIONS } from '../../../data/reviewMockData';

export const HomepageSectionsManager = () => {
  const { addToast } = useToast();
  const [homepageSections, setHomepageSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState('hero');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const data = await api.cms.getHomepageSections();
      if (Array.isArray(data) && data.length > 0) {
        // Guarantee hero is positioned at index 0 at the top
        const list = [...data];
        const heroIdx = list.findIndex(s => s.id === 'hero');
        if (heroIdx > 0) {
          const [heroSec] = list.splice(heroIdx, 1);
          list.unshift(heroSec);
        }
        setHomepageSections(list);
      } else {
        setHomepageSections(REVIEW_HOMEPAGE_SECTIONS);
      }
    } catch (err) {
      setHomepageSections(REVIEW_HOMEPAGE_SECTIONS);
      addToast('Loaded default layout: ' + err.message, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLayout = () => {
    setHomepageSections(REVIEW_HOMEPAGE_SECTIONS);
    addToast('Sections restored to default sequence with Hero at top. Click "Publish Layout Changes" to save live.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.cms.updateHomepageSections(homepageSections);
      addToast('Homepage sections and custom content published live!');
    } catch (err) {
      addToast('Failed to save layout: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const moveSection = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= homepageSections.length) return;
    const updated = [...homepageSections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHomepageSections(updated);
  };

  const toggleSectionActive = (idx) => {
    const updated = [...homepageSections];
    updated[idx].active = !updated[idx].active;
    setHomepageSections(updated);
  };

  const updateSectionContent = (secId, field, value) => {
    setHomepageSections(prev =>
      prev.map(sec => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          content: {
            ...(sec.content || {}),
            [field]: value
          }
        };
      })
    );
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #E2E8F0' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
            Storefront Homepage Section Customizer
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Reorder sections, toggle visibility, and customize headlines, banners, buttons, and story text.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleResetLayout}
            className="btn-framed"
            style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
            title="Reset sections order with Hero at the very top"
          >
            <span>↺ Restore Hero to Top</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="btn-framed"
            style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span>View Live Store</span> &rarr;
          </Link>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="btn-solid-maroon"
            style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Publishing...' : 'Publish Layout Changes'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading sections configuration...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {homepageSections.map((sec, idx) => {
            const isExpanded = expandedSectionId === sec.id;
            const content = sec.content || {};

            return (
              <div
                key={sec.id}
                style={{
                  borderRadius: 8,
                  border: `1px solid ${isExpanded ? '#800020' : '#E2E8F0'}`,
                  backgroundColor: sec.active ? '#FFFFFF' : '#F8FAFC',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Section Header Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none',
                    backgroundColor: isExpanded ? '#FFF1F2' : sec.active ? '#FFFFFF' : '#F1F5F9',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Position Badge */}
                    <span style={{
                      backgroundColor: sec.active ? '#800020' : '#94A3B8',
                      color: '#FFF',
                      fontSize: 11,
                      fontWeight: 800,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {idx + 1}
                    </span>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: sec.active ? '#0F172A' : '#64748B' }}>
                        {sec.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        {sec.desc}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Move to Top */}
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...homepageSections];
                          const [moved] = updated.splice(idx, 1);
                          updated.unshift(moved);
                          setHomepageSections(updated);
                        }}
                        className="btn-framed"
                        title="Move straight to top of page"
                        style={{ padding: '4px 8px', fontSize: 11, fontWeight: 700, color: '#800020' }}
                      >
                        Top ⇈
                      </button>
                    )}

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, -1)}
                      className="btn-framed"
                      title="Move section up"
                      style={{ padding: '4px 8px', fontSize: 12, opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      ▲
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === homepageSections.length - 1}
                      onClick={() => moveSection(idx, 1)}
                      className="btn-framed"
                      title="Move section down"
                      style={{ padding: '4px 8px', fontSize: 12, opacity: idx === homepageSections.length - 1 ? 0.3 : 1 }}
                    >
                      ▼
                    </button>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleSectionActive(idx)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 16,
                        border: 'none',
                        fontSize: 11.5,
                        fontWeight: 700,
                        backgroundColor: sec.active ? '#DEF7EC' : '#F3F4F6',
                        color: sec.active ? '#03543F' : '#6B7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: sec.active ? '#10B981' : '#9CA3AF' }}></span>
                      <span>{sec.active ? 'Visible' : 'Hidden'}</span>
                    </button>

                    {/* Edit Content Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${isExpanded ? '#800020' : '#CBD5E1'}`,
                        backgroundColor: isExpanded ? '#800020' : '#FFFFFF',
                        color: isExpanded ? '#FFFFFF' : '#1E293B',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <span>Customize Content</span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </div>

                {/* Section Content Customization Panel */}
                {isExpanded && (
                  <div style={{ padding: '20px 22px', backgroundColor: '#FAFAFA' }}>
                    
                    {/* HERO CUSTOMIZER */}
                    {sec.id === 'hero' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Top Tagline</label>
                          <input
                            type="text"
                            value={content.tagline || ''}
                            onChange={e => updateSectionContent('hero', 'tagline', e.target.value)}
                            placeholder="Online Surgical Equipment store in Pakistan"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Main Hero Headline (Use Enter for new lines)</label>
                          <textarea
                            rows="2"
                            value={content.title || ''}
                            onChange={e => updateSectionContent('hero', 'title', e.target.value)}
                            placeholder="Boost Your Health with Surgicals.pk"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Subtext Description</label>
                          <textarea
                            rows="3"
                            value={content.subtext || ''}
                            onChange={e => updateSectionContent('hero', 'subtext', e.target.value)}
                            placeholder="Shop hospital-grade surgical items, medical furniture..."
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Primary Button Label</label>
                          <input
                            type="text"
                            value={content.primaryBtnText || ''}
                            onChange={e => updateSectionContent('hero', 'primaryBtnText', e.target.value)}
                            placeholder="SHOP NOW"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Primary Button Link</label>
                          <input
                            type="text"
                            value={content.primaryBtnLink || ''}
                            onChange={e => updateSectionContent('hero', 'primaryBtnLink', e.target.value)}
                            placeholder="/shop"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>WhatsApp Button Label</label>
                          <input
                            type="text"
                            value={content.whatsappBtnText || ''}
                            onChange={e => updateSectionContent('hero', 'whatsappBtnText', e.target.value)}
                            placeholder="ORDER ON WHATSAPP"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>WhatsApp Phone (e.g. 923037333378)</label>
                          <input
                            type="text"
                            value={content.whatsappNumber || ''}
                            onChange={e => updateSectionContent('hero', 'whatsappNumber', e.target.value)}
                            placeholder="923037333378"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* CATEGORIES HUB CUSTOMIZER */}
                    {sec.id === 'categories' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Section Title</label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={e => updateSectionContent('categories', 'title', e.target.value)}
                            placeholder="MOST SELLING CATEGORIES"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Subtitle (Optional)</label>
                          <input
                            type="text"
                            value={content.subtitle || ''}
                            onChange={e => updateSectionContent('categories', 'subtitle', e.target.value)}
                            placeholder="Browse certified hospital and clinical equipment"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* BODY BELTS CUSTOMIZER */}
                    {sec.id === 'belts' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Section Title</label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={e => updateSectionContent('belts', 'title', e.target.value)}
                            placeholder="UNISEX BODY BELT & BRACES"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>View All Button Link</label>
                          <input
                            type="text"
                            value={content.viewAllLink || ''}
                            onChange={e => updateSectionContent('belts', 'viewAllLink', e.target.value)}
                            placeholder="/category/knee-support"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>View All Button Text</label>
                          <input
                            type="text"
                            value={content.viewAllText || ''}
                            onChange={e => updateSectionContent('belts', 'viewAllText', e.target.value)}
                            placeholder="View All"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 3-COLUMN FEATURE BANNERS */}
                    {sec.id === 'promo-3col' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                        {/* Card 1 */}
                        <div style={{ padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#800020' }}>Feature Card 1</h5>
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Title</label>
                          <input
                            type="text"
                            value={content.card1Title || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card1Title', e.target.value)}
                            placeholder="Wheel Chair"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Link Target</label>
                          <input
                            type="text"
                            value={content.card1Link || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card1Link', e.target.value)}
                            placeholder="/category/commode-chair"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Image URL</label>
                          <input
                            type="text"
                            value={content.card1Image || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card1Image', e.target.value)}
                            placeholder="/assets/banners/wheelchair.png"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
                          />
                        </div>

                        {/* Card 2 */}
                        <div style={{ padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#800020' }}>Feature Card 2</h5>
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Title</label>
                          <input
                            type="text"
                            value={content.card2Title || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card2Title', e.target.value)}
                            placeholder="Commode-Chairs"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Link Target</label>
                          <input
                            type="text"
                            value={content.card2Link || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card2Link', e.target.value)}
                            placeholder="/category/commode-chair"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Image URL</label>
                          <input
                            type="text"
                            value={content.card2Image || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card2Image', e.target.value)}
                            placeholder="/assets/banners/commode-chair.png"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
                          />
                        </div>

                        {/* Card 3 */}
                        <div style={{ padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#800020' }}>Feature Card 3</h5>
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Title</label>
                          <input
                            type="text"
                            value={content.card3Title || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card3Title', e.target.value)}
                            placeholder="Walkers"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Link Target</label>
                          <input
                            type="text"
                            value={content.card3Link || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card3Link', e.target.value)}
                            placeholder="/category/commode-chair"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Image URL</label>
                          <input
                            type="text"
                            value={content.card3Image || ''}
                            onChange={e => updateSectionContent('promo-3col', 'card3Image', e.target.value)}
                            placeholder="/assets/banners/walker.png"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 2-COLUMN SPLIT BANNERS */}
                    {sec.id === 'promo-split' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                        {/* Left Banner */}
                        <div style={{ padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#800020' }}>Left Promotional Split Card</h5>
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Tag / Offer</label>
                          <input
                            type="text"
                            value={content.splitLeftDiscount || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitLeftDiscount', e.target.value)}
                            placeholder="Explore Popular Offers"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Main Headline</label>
                          <input
                            type="text"
                            value={content.splitLeftTitle || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitLeftTitle', e.target.value)}
                            placeholder="ITEMS ON SALE"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Link Target</label>
                          <input
                            type="text"
                            value={content.splitLeftLink || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitLeftLink', e.target.value)}
                            placeholder="/shop?sale=true"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
                          />
                        </div>

                        {/* Right Banner */}
                        <div style={{ padding: 14, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#800020' }}>Right Promotional Split Card</h5>
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Tag / Offer</label>
                          <input
                            type="text"
                            value={content.splitRightDiscount || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitRightDiscount', e.target.value)}
                            placeholder="Fresh Arrivals & New Tech"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Main Headline</label>
                          <input
                            type="text"
                            value={content.splitRightTitle || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitRightTitle', e.target.value)}
                            placeholder="LATEST ITEMS"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, marginBottom: 8 }}
                          />
                          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>Link Target</label>
                          <input
                            type="text"
                            value={content.splitRightLink || ''}
                            onChange={e => updateSectionContent('promo-split', 'splitRightLink', e.target.value)}
                            placeholder="/shop?sort=newest"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* OFFICIAL BRANDS */}
                    {sec.id === 'brands' && (
                      <div style={{ maxWidth: 480 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Section Headline</label>
                        <input
                          type="text"
                          value={content.title || ''}
                          onChange={e => updateSectionContent('brands', 'title', e.target.value)}
                          placeholder="OFFICIAL MEDICAL BRAND PARTNERS"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                        />
                      </div>
                    )}

                    {/* BEST SELLING PRODUCTS */}
                    {sec.id === 'best-sellers' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Section Title</label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={e => updateSectionContent('best-sellers', 'title', e.target.value)}
                            placeholder="BEST SELLING PRODUCTS"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Subtitle (Optional)</label>
                          <input
                            type="text"
                            value={content.subtitle || ''}
                            onChange={e => updateSectionContent('best-sellers', 'subtitle', e.target.value)}
                            placeholder="Top demanded clinical tools"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Max Products to Display</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={content.itemLimit || 10}
                            onChange={e => updateSectionContent('best-sellers', 'itemLimit', Number(e.target.value))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* BRAND STORY & SEO */}
                    {sec.id === 'story' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Story Heading</label>
                          <input
                            type="text"
                            value={content.heading || ''}
                            onChange={e => updateSectionContent('story', 'heading', e.target.value)}
                            placeholder="Leading Surgical & Medical Equipment Supplier in Pakistan"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Paragraph 1</label>
                          <textarea
                            rows="2"
                            value={content.paragraph1 || ''}
                            onChange={e => updateSectionContent('story', 'paragraph1', e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Paragraph 2</label>
                          <textarea
                            rows="2"
                            value={content.paragraph2 || ''}
                            onChange={e => updateSectionContent('story', 'paragraph2', e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Paragraph 3</label>
                          <textarea
                            rows="2"
                            value={content.paragraph3 || ''}
                            onChange={e => updateSectionContent('story', 'paragraph3', e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Save Action */}
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="btn-solid-maroon"
          style={{ padding: '10px 24px', borderRadius: 6, fontSize: 13.5, fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Publishing...' : 'Publish All Section Changes'}
        </button>
      </div>

    </div>
  );
};
