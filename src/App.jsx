import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { api } from './services/api';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ProductQuickViewModal } from './components/common/ProductQuickViewModal';
import { ProductCompareModal } from './components/common/ProductCompareModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { ScrollToTop } from './components/common/ScrollToTop';

export const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    api.settings.get().then(data => {
      if (data) {
        if (data.metaTitle && (!document.title || document.title.includes('Surgicals.PK'))) {
          document.title = data.metaTitle;
        }
        if (data.metaDescription) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', data.metaDescription);
        }
        if (data.metaKeywords) {
          let metaKey = document.querySelector('meta[name="keywords"]');
          if (!metaKey) {
            metaKey = document.createElement('meta');
            metaKey.setAttribute('name', 'keywords');
            document.head.appendChild(metaKey);
          }
          metaKey.setAttribute('content', data.metaKeywords);
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Auto Reset Viewport Scroll on Navigation */}
      <ScrollToTop />

      {/* Universal Navigation Header (Excluded on Admin Portal) */}
      {!isAdminRoute && <Header />}

      {/* Main Routed Page Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/company-details" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/get-in-touch" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/returns" element={<ReturnPolicyPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Universal Dark Footer with Cursor Spotlight Shine (Excluded on Admin Portal) */}
      {!isAdminRoute && <Footer />}

      {/* Persistent Global Drawers & Modals (Storefront Only) */}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <ProductQuickViewModal />}
      {!isAdminRoute && <ProductCompareModal />}
    </div>
  );
};
