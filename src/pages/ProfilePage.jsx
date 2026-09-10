import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SiteStorySection } from '../components/common/SiteStorySection';
import { api } from '../services/api';

export const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [userOrders, setUserOrders] = useState([]);
  
  // Profile edit state
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hospitalClinicName: user?.hospitalClinicName || '',
    city: user?.city || 'Lahore'
  });

  // 2FA / MFA Management state
  const [mfaStatus, setMfaStatus] = useState({
    twoFactorEnabled: false,
    recoveryCodesCount: 0,
    loading: true
  });
  const [isSettingUpMfa, setIsSettingUpMfa] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [activationCode, setActivationCode] = useState('');
  const [activatedRecoveryCodes, setActivatedRecoveryCodes] = useState(null);
  const [mfaActionLoading, setMfaActionLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState({ type: '', text: '' });
  const [copyFeedback, setCopyFeedback] = useState('');

  // 2FA Disable state
  const [isDisablingMfa, setIsDisablingMfa] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');

  const loadMfaStatus = async () => {
    try {
      setMfaStatus(prev => ({ ...prev, loading: true }));
      const status = await api.auth.getMfaStatus();
      setMfaStatus({
        twoFactorEnabled: !!status.twoFactorEnabled,
        recoveryCodesCount: status.recoveryCodesCount || 0,
        loading: false
      });
    } catch {
      setMfaStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load orders from backend API
    const loadOrders = async () => {
      try {
        const liveOrders = await api.orders.getAll({ email: user?.email });
        if (Array.isArray(liveOrders)) {
          const matching = liveOrders.filter(
            o => o.customerEmail?.toLowerCase() === user?.email?.toLowerCase() ||
                 (user?.phone && o.customerPhone?.includes(user.phone)) ||
                 (user?.name && o.customerName?.toLowerCase() === user.name.toLowerCase())
          );
          if (matching.length > 0) {
            setUserOrders(matching);
            return;
          }
        }
      } catch {
        // Fallback to local storage
      }

      const orders = JSON.parse(localStorage.getItem('spk_user_orders') || '[]');
      const matching = orders.filter(
        o => o.customerEmail?.toLowerCase() === user?.email?.toLowerCase() ||
             (user?.phone && o.customerPhone?.includes(user.phone)) ||
             (user?.name && o.customerName?.toLowerCase() === user.name.toLowerCase())
      );
      setUserOrders(matching);
    };

    loadOrders();
    loadMfaStatus();
    
    if (user) {
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        hospitalClinicName: user.hospitalClinicName || '',
        city: user.city || 'Lahore'
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(editData);
  };

  // Start 2FA Setup
  const handleStartMfaSetup = async () => {
    setMfaActionLoading(true);
    setMfaMessage({ type: '', text: '' });
    try {
      const data = await api.auth.setupMfa();
      setSetupData(data);
      setIsSettingUpMfa(true);
      setActivationCode('');
      setActivatedRecoveryCodes(null);
    } catch (err) {
      setMfaMessage({ type: 'error', text: err.message || 'Failed to initiate 2FA setup.' });
    } finally {
      setMfaActionLoading(false);
    }
  };

  // Confirm 2FA Activation with 6-digit code
  const handleConfirmMfaActivation = async (e) => {
    e.preventDefault();
    if (!activationCode.trim() || !setupData?.secret) return;
    setMfaActionLoading(true);
    setMfaMessage({ type: '', text: '' });
    try {
      const res = await api.auth.enableMfa(setupData.secret, activationCode.trim());
      setActivatedRecoveryCodes(res.recoveryCodes || []);
      setMfaMessage({ type: 'success', text: 'Two-factor authentication successfully enabled!' });
      setIsSettingUpMfa(false);
      await loadMfaStatus();
    } catch (err) {
      setMfaMessage({ type: 'error', text: err.message || 'Invalid code. Please check your authenticator app.' });
    } finally {
      setMfaActionLoading(false);
    }
  };

  // Disable 2FA
  const handleDisableMfa = async (e) => {
    e.preventDefault();
    if (!disablePassword && !disableCode) return;
    setMfaActionLoading(true);
    setMfaMessage({ type: '', text: '' });
    try {
      await api.auth.disableMfa(disablePassword, disableCode);
      setMfaMessage({ type: 'success', text: 'Two-factor authentication has been disabled.' });
      setIsDisablingMfa(false);
      setDisablePassword('');
      setDisableCode('');
      await loadMfaStatus();
    } catch (err) {
      setMfaMessage({ type: 'error', text: err.message || 'Failed to disable 2FA. Check your password or code.' });
    } finally {
      setMfaActionLoading(false);
    }
  };

  const copyToClipboard = (text, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const downloadRecoveryCodes = () => {
    if (!activatedRecoveryCodes) return;
    const content = `Surgicals.PK - Two-Factor Authentication Backup Recovery Codes\nAccount: ${user?.email}\nDate: ${new Date().toLocaleString()}\n\nEach code can only be used once if you lose access to your authenticator app:\n\n${activatedRecoveryCodes.join('\n')}\n\nKeep these codes strictly private and secure.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surgicals-pk-recovery-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div>
      <div className="site-container" style={{ padding: '36px 15px 60px' }}>
        
        {/* Account Banner Header */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px 28px', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#111827', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{user.name}</h1>
                <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                  {user.role || 'Verified Customer'}
                </span>
              </div>
              <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                {user.email} • {user.city}, Pakistan
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn-framed"
            style={{ padding: '8px 18px', borderRadius: 6, fontSize: 12 }}
          >
            Sign Out
          </button>
        </div>

        {/* Account Dashboard Tabs */}
        <div className="shop-layout-grid">
          
          {/* Left Navigation Sidebar */}
          <aside style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                background: activeTab === 'orders' ? '#F9FAFB' : 'none',
                border: 'none',
                borderLeft: activeTab === 'orders' ? '4px solid #A7144C' : '4px solid transparent',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                color: activeTab === 'orders' ? '#111827' : '#4B5563',
                cursor: 'pointer',
                fontSize: 13.5,
                borderBottom: '1px solid #F0F0F0'
              }}
            >
              Order History ({userOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                background: activeTab === 'profile' ? '#F9FAFB' : 'none',
                border: 'none',
                borderLeft: activeTab === 'profile' ? '4px solid #A7144C' : '4px solid transparent',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                color: activeTab === 'profile' ? '#111827' : '#4B5563',
                cursor: 'pointer',
                fontSize: 13.5,
                borderBottom: '1px solid #F0F0F0'
              }}
            >
              Personal &amp; Clinic Details
            </button>

            <button
              onClick={() => setActiveTab('security')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                background: activeTab === 'security' ? '#F9FAFB' : 'none',
                border: 'none',
                borderLeft: activeTab === 'security' ? '4px solid #A7144C' : '4px solid transparent',
                fontWeight: activeTab === 'security' ? 700 : 500,
                color: activeTab === 'security' ? '#111827' : '#4B5563',
                cursor: 'pointer',
                fontSize: 13.5,
                borderBottom: '1px solid #F0F0F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Security &amp; 2FA</span>
              {mfaStatus.twoFactorEnabled ? (
                <span style={{ fontSize: 10, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>ACTIVE</span>
              ) : (
                <span style={{ fontSize: 10, backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>OFF</span>
              )}
            </button>

            <Link
              to="/track-order"
              style={{
                display: 'block',
                padding: '14px 18px',
                color: '#4B5563',
                textDecoration: 'none',
                fontSize: 13.5,
                borderBottom: '1px solid #F0F0F0'
              }}
            >
              Live Courier Tracking
            </Link>

            <Link
              to="/shop"
              style={{
                display: 'block',
                padding: '14px 18px',
                color: '#4B5563',
                textDecoration: 'none',
                fontSize: 13.5
              }}
            >
              Browse Equipment Catalog
            </Link>
          </aside>

          {/* Right Main Content */}
          <main style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid #E5E7EB' }}>
            
            {/* TAB 1: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Your Recent Orders</h3>
                
                {userOrders.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.6" style={{ display: 'inline-block', marginBottom: 8 }}>
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                    <h4 style={{ margin: '8px 0 4px', fontSize: 16 }}>No Orders Placed Yet</h4>
                    <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
                      When you order medical devices, equipment, or body braces, they will appear here with live delivery status.
                    </p>
                    <Link to="/shop" className="btn-solid-maroon" style={{ padding: '8px 18px', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>
                      Shop Equipment
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {userOrders.map((order, idx) => (
                      <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid #F0F0F0', paddingBottom: 10, marginBottom: 12 }}>
                          <div>
                            <strong style={{ fontSize: 14 }}>Order #{order.id}</strong>
                            <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 12 }}>{order.city}</span>
                          </div>
                          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {order.status || 'Dispatched via Daewoo Fastex'}
                          </span>
                        </div>

                        <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>
                          <div><strong>Delivery Address:</strong> {order.deliveryAddress || order.address}</div>
                          <div><strong>Payment:</strong> {(order.paymentMethod || 'COD').toUpperCase()}</div>
                          <div><strong>Total:</strong> Rs {order.total?.toLocaleString()}</div>
                        </div>

                        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                          <Link to="/track-order" className="btn-framed" style={{ padding: '6px 14px', fontSize: 11, borderRadius: 4 }}>
                            Track Parcel
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Personal &amp; Clinic Information</h3>
                
                <form onSubmit={handleProfileSave}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name / Doctor Title</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Contact Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Hospital / Clinic / Center Name</label>
                      <input
                        type="text"
                        value={editData.hospitalClinicName}
                        onChange={(e) => setEditData({ ...editData, hospitalClinicName: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>City</label>
                      <select
                        value={editData.city}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn-solid-maroon"
                      style={{ padding: '11px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}
                    >
                      SAVE PROFILE CHANGES
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: SECURITY & TWO-FACTOR AUTHENTICATION (MFA/TOTP) */}
            {activeTab === 'security' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Two-Factor Authentication (2FA)</h3>
                    <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                      Secure your clinical portal with standard TOTP authenticator apps (Google Authenticator, Microsoft Authenticator, Authy).
                    </p>
                  </div>
                </div>

                {/* Feedback Alerts */}
                {mfaMessage.text && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    marginBottom: 20,
                    backgroundColor: mfaMessage.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                    color: mfaMessage.type === 'error' ? '#B91C1C' : '#15803D',
                    border: `1px solid ${mfaMessage.type === 'error' ? '#F87171' : '#86EFAC'}`
                  }}>
                    {mfaMessage.text}
                  </div>
                )}

                {/* Copied Toast */}
                {copyFeedback && (
                  <div style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    backgroundColor: '#111827',
                    color: '#FFF',
                    padding: '10px 18px',
                    borderRadius: 6,
                    fontSize: 13,
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    ✓ {copyFeedback}
                  </div>
                )}

                {/* STATUS CARD */}
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: 22,
                  backgroundColor: mfaStatus.twoFactorEnabled ? '#F0FDF4' : '#F9FAFB',
                  marginBottom: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: mfaStatus.twoFactorEnabled ? '#DCFCE7' : '#FEF3C7',
                        color: mfaStatus.twoFactorEnabled ? '#15803D' : '#B45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          {mfaStatus.twoFactorEnabled && <path d="m9 12 2 2 4-4"/>}
                        </svg>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                            {mfaStatus.twoFactorEnabled ? '2FA Protection is Enabled' : '2FA Protection is Inactive'}
                          </h4>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 12,
                            backgroundColor: mfaStatus.twoFactorEnabled ? '#DCFCE7' : '#FEF3C7',
                            color: mfaStatus.twoFactorEnabled ? '#15803D' : '#B45309'
                          }}>
                            {mfaStatus.twoFactorEnabled ? 'PROTECTED' : 'RECOMMENDED'}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4B5563' }}>
                          {mfaStatus.twoFactorEnabled
                            ? `Your account requires a 6-digit authenticator code on each sign-in (${mfaStatus.recoveryCodesCount} backup codes available).`
                            : 'Add a secondary layer of verification to protect orders, clinical data, and purchases against unauthorized access.'}
                        </p>
                      </div>
                    </div>

                    {!mfaStatus.twoFactorEnabled && !isSettingUpMfa && (
                      <button
                        type="button"
                        onClick={handleStartMfaSetup}
                        disabled={mfaActionLoading}
                        className="btn-solid-maroon"
                        style={{ padding: '10px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
                      >
                        {mfaActionLoading ? 'Preparing...' : 'Set Up Two-Factor (2FA)'}
                      </button>
                    )}

                    {mfaStatus.twoFactorEnabled && !isDisablingMfa && (
                      <button
                        type="button"
                        onClick={() => setIsDisablingMfa(true)}
                        className="btn-framed"
                        style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, color: '#B91C1C', borderColor: '#FCA5A5' }}
                      >
                        Disable 2FA
                      </button>
                    )}
                  </div>
                </div>

                {/* SETUP WIZARD (STEP-BY-STEP) */}
                {isSettingUpMfa && setupData && (
                  <div style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: 10,
                    padding: 24,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    marginBottom: 24
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: 14, marginBottom: 20 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                        Step-by-Step Two-Factor Setup
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsSettingUpMfa(false)}
                        style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 260px) 1fr', gap: 28, flexWrap: 'wrap' }}>
                      
                      {/* Left: QR Code display */}
                      <div style={{ textAlign: 'center', backgroundColor: '#FAFAFA', padding: 18, borderRadius: 8, border: '1px solid #E5E7EB' }}>
                        <div style={{
                          backgroundColor: '#FFF',
                          padding: 10,
                          borderRadius: 6,
                          display: 'inline-block',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                        }}>
                          <img
                            src={setupData.qrCodeDataUrl}
                            alt="Scan this 2FA QR Code with your Authenticator App"
                            style={{ width: 190, height: 190, display: 'block' }}
                          />
                        </div>
                        <div style={{ marginTop: 12, fontSize: 12, color: '#4B5563', fontWeight: 600 }}>
                          Scan using Authenticator App
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                          Google Authenticator • Microsoft • Authy
                        </div>
                      </div>

                      {/* Right: Manual Key & Verification Form */}
                      <div>
                        {/* Step 1 Instructions */}
                        <div style={{ marginBottom: 18 }}>
                          <strong style={{ fontSize: 13, color: '#111827', display: 'block', marginBottom: 4 }}>
                            1. Scan the QR code or enter manual key:
                          </strong>
                          <p style={{ fontSize: 12.5, color: '#4B5563', margin: '0 0 8px' }}>
                            Open your authenticator app, choose <strong>"Scan a QR code"</strong>, or manually enter this secret setup key:
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 360 }}>
                            <code style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: '#F3F4F6',
                              borderRadius: 6,
                              fontSize: 13,
                              fontWeight: 700,
                              letterSpacing: '1.5px',
                              border: '1px solid #E5E7EB',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {setupData.secret}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(setupData.secret, 'Secret key copied!')}
                              className="btn-framed"
                              style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, whiteSpace: 'nowrap' }}
                            >
                              Copy Key
                            </button>
                          </div>
                        </div>

                        {/* Step 2 Verification */}
                        <div>
                          <strong style={{ fontSize: 13, color: '#111827', display: 'block', marginBottom: 4 }}>
                            2. Enter the 6-digit code shown in your app to activate:
                          </strong>
                          <form onSubmit={handleConfirmMfaActivation} style={{ marginTop: 8 }}>
                            <div style={{ display: 'flex', gap: 10, maxWidth: 360 }}>
                              <input
                                type="text"
                                required
                                maxLength="6"
                                placeholder="000 000"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '10px 14px',
                                  fontSize: 16,
                                  fontWeight: 700,
                                  letterSpacing: '3px',
                                  textAlign: 'center',
                                  borderRadius: 6,
                                  border: '1px solid #D1D5DB'
                                }}
                              />
                              <button
                                type="submit"
                                disabled={mfaActionLoading || activationCode.trim().length !== 6}
                                className="btn-solid-maroon"
                                style={{ padding: '10px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}
                              >
                                {mfaActionLoading ? 'Verifying...' : 'Activate 2FA'}
                              </button>
                            </div>
                          </form>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {/* RECOVERY CODES MODAL / DISPLAY CARD */}
                {activatedRecoveryCodes && activatedRecoveryCodes.length > 0 && (
                  <div style={{
                    border: '1px solid #F59E0B',
                    borderRadius: 10,
                    padding: 24,
                    backgroundColor: '#FFFBEB',
                    marginBottom: 24
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>🔐</span>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#92400E' }}>
                        Save Your Single-Use Recovery Codes!
                      </h4>
                    </div>
                    <p style={{ color: '#78350F', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
                      If you ever lose access to your phone or authenticator app, each of these 8 backup recovery codes can be used <strong>once</strong> to sign into your account. Store them in a secure password manager or offline file.
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: 10,
                      backgroundColor: '#FFFFFF',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #FDE68A',
                      marginBottom: 16
                    }}>
                      {activatedRecoveryCodes.map((code, idx) => (
                        <code key={idx} style={{
                          padding: '6px 8px',
                          backgroundColor: '#F9FAFB',
                          borderRadius: 4,
                          fontSize: 13,
                          fontWeight: 700,
                          textAlign: 'center',
                          border: '1px solid #E5E7EB'
                        }}>
                          {code}
                        </code>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activatedRecoveryCodes.join('\n'), 'All 8 recovery codes copied!')}
                        className="btn-solid-maroon"
                        style={{ padding: '8px 16px', fontSize: 12, borderRadius: 6 }}
                      >
                        Copy All Codes
                      </button>
                      <button
                        type="button"
                        onClick={downloadRecoveryCodes}
                        className="btn-framed"
                        style={{ padding: '8px 16px', fontSize: 12, borderRadius: 6 }}
                      >
                        Download Codes (.txt)
                      </button>
                    </div>
                  </div>
                )}

                {/* DISABLE 2FA CONFIRMATION MODAL / PANEL */}
                {isDisablingMfa && (
                  <div style={{
                    border: '1px solid #FCA5A5',
                    borderRadius: 10,
                    padding: 22,
                    backgroundColor: '#FEF2F2',
                    marginBottom: 24
                  }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#991B1B' }}>
                      Confirm Disabling Two-Factor Authentication
                    </h4>
                    <p style={{ margin: '0 0 16px', fontSize: 13, color: '#7F1D1D' }}>
                      To confirm deactivation, please enter your account password OR a valid 6-digit code from your authenticator app:
                    </p>

                    <form onSubmit={handleDisableMfa}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                            Account Password:
                          </label>
                          <input
                            type="password"
                            placeholder="Current account password"
                            value={disablePassword}
                            onChange={(e) => setDisablePassword(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                          />
                        </div>

                        <div style={{ textAlign: 'center', fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                          — OR —
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                            6-Digit Authenticator Code:
                          </label>
                          <input
                            type="text"
                            maxLength="6"
                            placeholder="000 000"
                            value={disableCode}
                            onChange={(e) => setDisableCode(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, letterSpacing: '2px', textAlign: 'center' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                          <button
                            type="submit"
                            disabled={mfaActionLoading || (!disablePassword && !disableCode)}
                            className="btn-solid-maroon"
                            style={{ backgroundColor: '#DC2626', padding: '9px 18px', borderRadius: 6, fontSize: 13 }}
                          >
                            {mfaActionLoading ? 'Processing...' : 'Confirm & Disable 2FA'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsDisablingMfa(false); setDisablePassword(''); setDisableCode(''); }}
                            className="btn-framed"
                            style={{ padding: '9px 16px', borderRadius: 6, fontSize: 13 }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Additional Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 16 }}>
                    <strong style={{ fontSize: 13, color: '#111827', display: 'block', marginBottom: 4 }}>
                      Industry-Standard RFC 6238
                    </strong>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                      Compatible with Google Authenticator, Microsoft Authenticator, Apple Passwords, Authy, and 1Password without proprietary vendor lock-in.
                    </p>
                  </div>

                  <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 16 }}>
                    <strong style={{ fontSize: 13, color: '#111827', display: 'block', marginBottom: 4 }}>
                      Offline Authentication
                    </strong>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                      TOTP verification codes are calculated locally on your phone using cryptographically synchronized time steps and require zero SMS or cellular reception.
                    </p>
                  </div>

                  <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 16 }}>
                    <strong style={{ fontSize: 13, color: '#111827', display: 'block', marginBottom: 4 }}>
                      Emergency Recovery Codes
                    </strong>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                      Each account is provisioned with 8 single-use cryptographically random recovery codes to ensure clinical procurement is never locked out.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
