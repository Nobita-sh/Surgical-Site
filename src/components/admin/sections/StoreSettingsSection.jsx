import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const StoreSettingsSection = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'Surgicals.pk',
    contactEmail: 'support@surgicals.pk',
    contactPhone: '0303-7333378',
    shippingFlatRate: 250,
    freeShippingThreshold: 5000,
    currency: 'PKR',
    taxRate: 0,
    fbrNtn: '8192041-3',
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Surgicals PK Healthcare Supplies',
    accountNumber: 'PK36MEZN0001020105829102',
    maintenanceMode: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await api.settings.get();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      addToast('Failed to load settings: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.settings.update(settings);
      addToast('Store settings saved to server successfully!');
    } catch (err) {
      addToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', padding: 40, borderRadius: 10, border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
        Loading store configuration from server...
      </div>
    );
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={settings[key] || ''}
        onChange={e => setSettings({ ...settings, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #E2E8F0', maxWidth: 760 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Store Configuration &amp; Logistics Tariffs</h3>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
          Operational settings persisted to the server. Changes immediately affect checkout calculations and customer policies.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {field('Store Brand Name', 'storeName')}
            {field('Official FBR NTN / STRN', 'fbrNtn')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {field('Contact Support Email', 'contactEmail', 'email')}
            {field('Official Helpline Phone', 'contactPhone', 'tel')}
          </div>

          {/* Shipping Rules */}
          <div style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0F172A' }}>National Shipping Logistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {field('Flat Shipping Courier Rate (PKR)', 'shippingFlatRate', 'number')}
              {field('Free Shipping Order Threshold (PKR)', 'freeShippingThreshold', 'number')}
            </div>
          </div>

          {/* Direct Bank Transfer Settings */}
          <div style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0F172A' }}>Direct Bank Transfer Account Details</h4>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 12px' }}>
              Displayed to customers on Checkout when selecting "Direct Bank Transfer" payment method.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {field('Bank Name', 'bankName', 'text', 'e.g. Meezan Bank Limited')}
              {field('Account Title', 'accountTitle', 'text', 'e.g. Surgicals PK Healthcare Supplies')}
              {field('Account Number / IBAN', 'accountNumber', 'text', 'PK36MEZN0001020105829102')}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {field('Currency Code', 'currency')}
            {field('Sales Tax Rate (%)', 'taxRate', 'number')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: '#800020' }}
            />
            <label htmlFor="maintenanceMode" style={{ fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              Enable Maintenance Mode (temporary storefront offline lock)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-solid-maroon"
            style={{ padding: '12px', borderRadius: 6, fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer', marginTop: 6, opacity: isSaving ? 0.6 : 1 }}
          >
            {isSaving ? 'SAVING CONFIGURATION...' : 'SAVE STORE CONFIGURATION'}
          </button>
        </form>
      </div>
    </div>
  );
};
