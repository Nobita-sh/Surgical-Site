import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { api } from '../../services/api';

export const Header = () => {
  const { totalItems, grandTotal, setIsDrawerOpen } = useCart();
  const { searchQuery, setSearchQuery } = useProducts();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { compareCount, openCompareModal } = useCompare();
  const [headerSettings, setHeaderSettings] = useState({
    storeName: 'Surgicals.pk',
    logoText: 'surgicals.pk',
    logoIcon: '✚',
    topBarPhone: '0303-7333378',
    announcementText: 'Free Shipping on Orders Above Rs. 5,000 across Pakistan!'
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.settings.get().catch(() => ({})),
      api.cms.getPromos().catch(() => ({}))
    ]).then(([settings, promos]) => {
      if (mounted) {
        setHeaderSettings(prev => ({
          ...prev,
          storeName: settings?.storeName || prev.storeName,
          logoText: settings?.logoText || prev.logoText,
          logoIcon: settings?.logoIcon || prev.logoIcon,
          topBarPhone: settings?.topBarPhone || settings?.contactPhone || prev.topBarPhone,
          announcementText: promos?.announcementText || settings?.announcementText || prev.announcementText
        }));
      }
    });
    return () => { mounted = false; };
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({
    homeCare: false,
    electroMedical: false,
    hospitalEquipments: false
  });
  const navigate = useNavigate();

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Black Announcement Bar */}
      <div className="top-bar">
        <div className="site-container top-bar-inner">
          <div className="top-bar-left">
            <a href={`tel:${headerSettings.topBarPhone.replace(/[^0-9]/g, '')}`} className="top-bar-phone">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {headerSettings.topBarPhone}
            </a>
          </div>
          <div className="top-bar-center">
            {headerSettings.announcementText ? (
              <span>{headerSettings.announcementText}</span>
            ) : (
              <>Free Shipping on Orders Above <span className="highlight-red">Rs. 5,000</span> across Pakistan!</>
            )}
          </div>
          <div className="top-bar-right" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="top-bar-link" style={{ fontWeight: 600 }}>
                  Account ({user.name.split(' ')[0]})
                </Link>
                <button
                  onClick={logout}
                  className="top-bar-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="top-bar-link" style={{ fontWeight: 600 }}>
                Sign In / Register
              </Link>
            )}
            <Link to="/track-order" className="top-bar-link">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="main-header">
        <div className="site-container header-inner">
          
          {/* Mobile Hamburger Button + Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
              title="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Brand Logo */}
            <Link to="/" className="brand-logo-wrap" title={`${headerSettings.storeName} - Medical Equipment Pakistan`}>
              <span className="brand-logo-icon">{headerSettings.logoIcon || '✚'}</span>
              <span className="brand-logo-text">
                {headerSettings.logoText && headerSettings.logoText.includes('.') ? (
                  <>
                    {headerSettings.logoText.split('.')[0]}
                    <span className="logo-domain">.{headerSettings.logoText.split('.').slice(1).join('.')}</span>
                  </>
                ) : (
                  headerSettings.logoText || 'surgicals.pk'
                )}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Menu — Exact surgicals.pk structure */}
          <nav className="header-nav">
            <Link to="/shop" className="nav-link-item">Shop</Link>

            {/* Home Care Dropdown */}
            <div className="nav-item-dropdown">
              <span className="nav-link-item">
                Home Care
                <span className="nav-arrow">▾</span>
              </span>
              <div className="dropdown-menu-card">
                <Link to="/category/physiotherapy" className="dropdown-item-link">Physiotherapy <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/height-weight-scales" className="dropdown-item-link">Height &amp; Weight Scales <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/rehabilitation-aids" className="dropdown-item-link">Rehabilitation &amp; Aids <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/respiratory" className="dropdown-item-link">Respiratory <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/pulse-oximeter" className="dropdown-item-link">Pulse Oximeter <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/belts-braces" className="dropdown-item-link">Belts &amp; Braces <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/personal-care" className="dropdown-item-link">Personal Care</Link>
                <Link to="/category/thermometer" className="dropdown-item-link">Thermometer</Link>
                <Link to="/category/mobile-aids" className="dropdown-item-link">Mobile aids</Link>
                <Link to="/category/sugar-machine" className="dropdown-item-link">Sugar Machine</Link>
              </div>
            </div>

            {/* Electro Medical Dropdown */}
            <div className="nav-item-dropdown">
              <span className="nav-link-item">
                Electro Medical
                <span className="nav-arrow">▾</span>
              </span>
              <div className="dropdown-menu-card">
                <Link to="/category/autoclave-sterilizer" className="dropdown-item-link">Autoclave &amp; Sterilizers <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/ecg-machine" className="dropdown-item-link">ECG Machines <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/ot-tables" className="dropdown-item-link">O.T Tables</Link>
                <Link to="/category/ventilators" className="dropdown-item-link">Ventilators</Link>
                <Link to="/category/monitors" className="dropdown-item-link">Monitors</Link>
                <Link to="/category/infusion-pump" className="dropdown-item-link">Infusion Pump</Link>
                <Link to="/category/syringe-pump" className="dropdown-item-link">Syringe Pump</Link>
                <Link to="/category/defibrillators" className="dropdown-item-link">Defibrillators</Link>
                <Link to="/category/blood-warmer" className="dropdown-item-link">Blood Warmer</Link>
              </div>
            </div>

            {/* Hospital Equipments Dropdown */}
            <div className="nav-item-dropdown">
              <span className="nav-link-item">
                Hospital Equipments
                <span className="nav-arrow">▾</span>
              </span>
              <div className="dropdown-menu-card">
                <Link to="/category/operation-theater" className="dropdown-item-link">Operation Theater <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/anesthesia-equipment" className="dropdown-item-link">Anesthesia Equipment <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/diagnostic-equipment" className="dropdown-item-link">Diagnostic Equipment <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/emergency-products" className="dropdown-item-link">Emergency Products <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/instruments" className="dropdown-item-link">Instruments <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/scrub-linens" className="dropdown-item-link">Scrub &amp; Linens <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/ent-equipment" className="dropdown-item-link">ENT Equipment <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/gynae-instruments" className="dropdown-item-link">Gynae Instruments <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/suction-machines" className="dropdown-item-link">Suction Machines <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/infant-care" className="dropdown-item-link">Infant Care <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/human-models-skeleton" className="dropdown-item-link">Human Models Skeleton <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/hospital-furniture" className="dropdown-item-link">Hospital Furniture <span className="dropdown-sub-arrow">▸</span></Link>
                <Link to="/category/lab-equipments" className="dropdown-item-link">Lab Equipments</Link>
              </div>
            </div>
          </nav>

          {/* Right Actions: Search + Cart */}
          <div className="header-right-actions">
            
            {/* Desktop Search Form */}
            <form onSubmit={handleSearchSubmit} className="header-search-form desktop-only">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
              <button type="submit" className="action-btn-search" title="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            {/* Mobile Search Icon Toggle */}
            <button
              className="action-btn-search mobile-only-search-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              title="Search"
              aria-label="Toggle Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="action-btn-cart"
              title="Saved Wishlist"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="cart-bag-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#800020' : 'none'} stroke="#800020" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistCount > 0 && (
                  <span className="cart-red-badge" style={{ backgroundColor: '#800020' }}>
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Compare Floating Trigger */}
            {compareCount > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                className="action-btn-cart"
                title="Compare Selected Devices"
                style={{
                  backgroundColor: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#800020',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 3v18M3 7l4 8h-8zM17 7l4 8h-8zM3 7h18" />
                </svg>
                <span className="desktop-only">Compare ({compareCount})</span>
              </button>
            )}

            {/* Cart Bag */}
            <button
              className="action-btn-cart"
              onClick={() => setIsDrawerOpen(true)}
              title="View Shopping Cart"
            >
              <div className="cart-bag-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-red-badge">{totalItems}</span>
              </div>
            </button>

            <span className="header-cart-total-badge desktop-only">Rs {grandTotal.toLocaleString()}</span>
          </div>

        </div>

        {/* Mobile Dropdown Search Input Bar */}
        {isMobileSearchOpen && (
          <div className="mobile-search-bar-wrap">
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search surgical & medical equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-submit">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ====================================================================
          MOBILE NAVIGATION DRAWER
          ==================================================================== */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}>
        <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
          
          {/* Drawer Header */}
          <div className="mobile-drawer-header">
            <Link to="/" onClick={closeMobileMenu} className="brand-logo-wrap">
              <span className="brand-logo-icon">{headerSettings.logoIcon || '✚'}</span>
              <span className="brand-logo-text">
                {headerSettings.logoText && headerSettings.logoText.includes('.') ? (
                  <>
                    {headerSettings.logoText.split('.')[0]}
                    <span className="logo-domain">.{headerSettings.logoText.split('.').slice(1).join('.')}</span>
                  </>
                ) : (
                  headerSettings.logoText || 'surgicals.pk'
                )}
              </span>
            </Link>
            <button className="mobile-drawer-close-btn" onClick={closeMobileMenu} aria-label="Close Menu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Drawer Search */}
          <div className="mobile-drawer-search">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-drawer-input"
              />
              <button type="submit" className="btn-solid-maroon" style={{ padding: '8px 12px', fontSize: 12 }}>
                Go
              </button>
            </form>
          </div>

          {/* Drawer Navigation Links & Accordions */}
          <div className="mobile-drawer-body">
            <Link to="/" onClick={closeMobileMenu} className="mobile-drawer-nav-item">
              Home
            </Link>

            <Link to="/shop" onClick={closeMobileMenu} className="mobile-drawer-nav-item">
              Shop All Products
            </Link>

            {/* Accordion 1: Home Care */}
            <div className="mobile-accordion">
              <button
                className="mobile-accordion-toggle"
                onClick={() => toggleAccordion('homeCare')}
              >
                <span>Home Care</span>
                <span className={`accordion-chevron ${openAccordions.homeCare ? 'open' : ''}`}>▾</span>
              </button>
              {openAccordions.homeCare && (
                <div className="mobile-accordion-content">
                  <Link to="/category/physiotherapy" onClick={closeMobileMenu}>Physiotherapy</Link>
                  <Link to="/category/height-weight-scales" onClick={closeMobileMenu}>Height &amp; Weight Scales</Link>
                  <Link to="/category/rehabilitation-aids" onClick={closeMobileMenu}>Rehabilitation &amp; Aids</Link>
                  <Link to="/category/respiratory" onClick={closeMobileMenu}>Respiratory</Link>
                  <Link to="/category/pulse-oximeter" onClick={closeMobileMenu}>Pulse Oximeter</Link>
                  <Link to="/category/belts-braces" onClick={closeMobileMenu}>Belts &amp; Braces</Link>
                  <Link to="/category/personal-care" onClick={closeMobileMenu}>Personal Care</Link>
                  <Link to="/category/thermometer" onClick={closeMobileMenu}>Thermometer</Link>
                  <Link to="/category/mobile-aids" onClick={closeMobileMenu}>Mobile aids</Link>
                  <Link to="/category/sugar-machine" onClick={closeMobileMenu}>Sugar Machine</Link>
                </div>
              )}
            </div>

            {/* Accordion 2: Electro Medical */}
            <div className="mobile-accordion">
              <button
                className="mobile-accordion-toggle"
                onClick={() => toggleAccordion('electroMedical')}
              >
                <span>Electro Medical</span>
                <span className={`accordion-chevron ${openAccordions.electroMedical ? 'open' : ''}`}>▾</span>
              </button>
              {openAccordions.electroMedical && (
                <div className="mobile-accordion-content">
                  <Link to="/category/autoclave-sterilizer" onClick={closeMobileMenu}>Autoclave &amp; Sterilizers</Link>
                  <Link to="/category/ecg-machine" onClick={closeMobileMenu}>ECG Machines</Link>
                  <Link to="/category/ot-tables" onClick={closeMobileMenu}>O.T Tables</Link>
                  <Link to="/category/ventilators" onClick={closeMobileMenu}>Ventilators</Link>
                  <Link to="/category/monitors" onClick={closeMobileMenu}>Monitors</Link>
                  <Link to="/category/infusion-pump" onClick={closeMobileMenu}>Infusion Pump</Link>
                  <Link to="/category/syringe-pump" onClick={closeMobileMenu}>Syringe Pump</Link>
                  <Link to="/category/defibrillators" onClick={closeMobileMenu}>Defibrillators</Link>
                  <Link to="/category/blood-warmer" onClick={closeMobileMenu}>Blood Warmer</Link>
                </div>
              )}
            </div>

            {/* Accordion 3: Hospital Equipments */}
            <div className="mobile-accordion">
              <button
                className="mobile-accordion-toggle"
                onClick={() => toggleAccordion('hospitalEquipments')}
              >
                <span>Hospital Equipments</span>
                <span className={`accordion-chevron ${openAccordions.hospitalEquipments ? 'open' : ''}`}>▾</span>
              </button>
              {openAccordions.hospitalEquipments && (
                <div className="mobile-accordion-content">
                  <Link to="/category/operation-theater" onClick={closeMobileMenu}>Operation Theater</Link>
                  <Link to="/category/anesthesia-equipment" onClick={closeMobileMenu}>Anesthesia Equipment</Link>
                  <Link to="/category/diagnostic-equipment" onClick={closeMobileMenu}>Diagnostic Equipment</Link>
                  <Link to="/category/emergency-products" onClick={closeMobileMenu}>Emergency Products</Link>
                  <Link to="/category/instruments" onClick={closeMobileMenu}>Instruments</Link>
                  <Link to="/category/scrub-linens" onClick={closeMobileMenu}>Scrub &amp; Linens</Link>
                  <Link to="/category/ent-equipment" onClick={closeMobileMenu}>ENT Equipment</Link>
                  <Link to="/category/gynae-instruments" onClick={closeMobileMenu}>Gynae Instruments</Link>
                  <Link to="/category/suction-machines" onClick={closeMobileMenu}>Suction Machines</Link>
                  <Link to="/category/infant-care" onClick={closeMobileMenu}>Infant Care</Link>
                  <Link to="/category/human-models-skeleton" onClick={closeMobileMenu}>Human Models Skeleton</Link>
                  <Link to="/category/hospital-furniture" onClick={closeMobileMenu}>Hospital Furniture</Link>
                  <Link to="/category/lab-equipments" onClick={closeMobileMenu}>Lab Equipments</Link>
                </div>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '14px 0' }} />

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMobileMenu} className="mobile-drawer-nav-item" style={{ fontWeight: 700, color: '#A7144C' }}>
                  My Account ({user.name})
                </Link>
                <button
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="mobile-drawer-nav-item"
                  style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobileMenu} className="mobile-drawer-nav-item" style={{ fontWeight: 700, color: '#A7144C' }}>
                Sign In / Register
              </Link>
            )}

            <Link to="/track-order" onClick={closeMobileMenu} className="mobile-drawer-nav-item">
              Track Your Order
            </Link>
          </div>

          {/* Drawer Footer Call Action */}
          <div className="mobile-drawer-footer">
            <a href="tel:03037333378" className="mobile-call-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ display: 'inline-block' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Helpline: 0303-7333378
            </a>
          </div>

        </div>
      </div>
    </>
  );
};
