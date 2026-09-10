import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const DEFAULT_TEMPLATES = {
  privacy: `1. Information We Collect
We collect personal identification data, hospital and clinic registration numbers, institutional shipping addresses, and direct procurement contact details to ensure accurate verification and dispatch of medical equipment across Pakistan.

2. Confidentiality & Clinical Discretion
All clinical client records, order histories, and doctor account specifications are strictly confidential under Pakistani Commercial & Healthcare Data Guidelines. We never sell, rent, or lease healthcare procurement lists to third parties.

3. Secure Online Transactions
Payment transactions executed via Direct IBAN Bank Transfer, JazzCash, or EasyPaisa utilize 256-bit encrypted banking rails. Credit or debit card numbers are never stored on our servers.

4. Clinical Device Inquiries
Any patient or technical requirements provided for device customization (e.g. wheelchair sizing, diagnostic probe frequencies, lens magnification) are handled with medical discretion.

5. Data Subject Rights & Contact
Healthcare providers and customers may request inspection, correction, or deletion of their procurement profile by emailing our Compliance Officer.`,

  terms: `1. Scope of Medical Supply
Surgicals.pk supplies certified surgical instruments, hospital furniture, diagnostic machinery, and clinical disposables. By placing an order, the customer confirms they are purchasing for lawful clinical, hospital, medical training, or personal healthcare purposes.

2. Pricing & Institutional Orders
All prices are displayed in Pakistani Rupees (PKR). Institutional hospital quotations and bulk purchase tenders are valid for 15 calendar days from the date of issuance. We reserve the right to correct pricing errors.

3. Payment Terms & Bank Transfer
We accept Cash on Delivery (COD) for eligible standard equipment and Direct IBAN Bank Transfer. For specialized diagnostic machinery exceeding Rs. 50,000, an advance verification deposit is required prior to courier dispatch.

4. Courier Transit & National Fulfillment
Orders are dispatched via TCS Express, Daewoo Fastex, or Leopards Courier. Risk of transit damage is fully insured by Surgicals.pk until physical handover and customer signature.

5. Biomedical Equipment Warranty
All electronic and diagnostic medical devices include official manufacturer warranty coverage ranging from 1 to 3 years as stated on the warranty card.`,

  returns: `1. 7-Day Clinical Inspection Window
We provide a 7-day inspection and verification guarantee starting from the delivery date recorded by the courier partner.

2. Eligibility for Returns & Replacements
To be eligible for an exchange or refund:
- The medical instrument or device must remain in its original protective packaging.
- Factory calibration seals and manufacturer warranty tags must be intact.
- Disposable sterile supplies (blades, sutures, catheter tubes) must remain sealed in original blister packaging.

3. Return Procedure
To initiate an authorized return:
- Contact our dedicated WhatsApp Claims Helpline with your Order ID and photos or video of the issue.
- Our quality assurance team will authorize a complimentary return pickup via TCS Express.

4. Swift Refund Settlement
Approved refunds are processed within 48 to 72 business hours directly to your designated IBAN bank account, EasyPaisa, or JazzCash wallet.`
};

export const PolicyPagesManager = () => {
  const { addToast } = useToast();

  const [selectedPolicy, setSelectedPolicy] = useState('privacy');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [policyData, setPolicyData] = useState({
    privacy: {
      title: 'Privacy Policy',
      effectiveDate: 'January 1, 2025',
      supportEmail: 'privacy@surgicals.pk',
      dpoOfficer: 'Compliance & Clinical Records Officer',
      retentionYears: '7 Years (DRAP Clinical Standard)',
      content: ''
    },
    terms: {
      title: 'Terms & Conditions',
      effectiveDate: 'January 1, 2025',
      jurisdiction: 'Lahore, Punjab, Pakistan',
      advancePaymentThreshold: 'Rs. 50,000 (Machinery & Ultrasound Units)',
      warrantyPeriod: '1 to 3 Years Official Manufacturer Warranty',
      content: ''
    },
    returns: {
      title: 'Return, Refund & Warranty Policy',
      guaranteeDays: '7 Days Inspection Period',
      claimsHelpline: '+92 300 0000000',
      payoutMethods: 'Direct IBAN Bank Transfer, EasyPaisa, JazzCash',
      pickupCourier: 'TCS Express / Leopards Courier',
      content: ''
    }
  });

  useEffect(() => {
    loadPolicyData();
  }, []);

  const loadPolicyData = async () => {
    setIsLoading(true);
    try {
      const data = await api.cms.getPolicyPages();
      if (data && data.privacy) {
        setPolicyData(prev => ({
          privacy: { ...prev.privacy, ...data.privacy },
          terms: { ...prev.terms, ...data.terms },
          returns: { ...prev.returns, ...data.returns }
        }));
      }
    } catch (err) {
      addToast('Failed to load policy data: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await api.cms.updatePolicyPages(policyData);
      addToast(`Revisions to ${selectedPolicy.toUpperCase()} saved and published live!`);
    } catch (err) {
      addToast('Failed to publish policy updates: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDefaultTemplate = (policyKey) => {
    const template = DEFAULT_TEMPLATES[policyKey];
    if (!template) return;
    setPolicyData(prev => ({
      ...prev,
      [policyKey]: {
        ...prev[policyKey],
        content: template
      }
    }));
    addToast(`Loaded default template into ${policyKey.toUpperCase()} editor!`);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 10, border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0F172A' }}>Legal &amp; Policy Pages Management</h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            Update compliance terms, guarantee periods, and rewrite full policy documents across public policy routes.
          </p>
        </div>

        {/* Quick View Links */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/privacy" target="_blank" className="btn-framed" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, textDecoration: 'none' }}>
            View Live /privacy &rarr;
          </Link>
          <Link to="/terms" target="_blank" className="btn-framed" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, textDecoration: 'none' }}>
            View Live /terms &rarr;
          </Link>
          <Link to="/returns" target="_blank" className="btn-framed" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, textDecoration: 'none' }}>
            View Live /returns &rarr;
          </Link>
        </div>
      </div>

      {/* Policy Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
        {[
          { id: 'privacy', label: 'Privacy Policy (/privacy)' },
          { id: 'terms', label: 'Terms & Conditions (/terms)' },
          { id: 'returns', label: 'Return Policy (/returns)' }
        ].map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPolicy(p.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: `1px solid ${selectedPolicy === p.id ? '#800020' : '#E2E8F0'}`,
              backgroundColor: selectedPolicy === p.id ? '#FDF2F8' : '#FFFFFF',
              color: selectedPolicy === p.id ? '#800020' : '#475569',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Form for Selected Policy */}
      {selectedPolicy === 'privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 840 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Document Title</label>
            <input
              type="text"
              value={policyData.privacy.title}
              onChange={e => setPolicyData({ ...policyData, privacy: { ...policyData.privacy, title: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Effective Date</label>
              <input
                type="text"
                value={policyData.privacy.effectiveDate}
                onChange={e => setPolicyData({ ...policyData, privacy: { ...policyData.privacy, effectiveDate: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Compliance Officer Email</label>
              <input
                type="email"
                value={policyData.privacy.supportEmail}
                onChange={e => setPolicyData({ ...policyData, privacy: { ...policyData.privacy, supportEmail: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Clinical Records Retention Policy</label>
            <input
              type="text"
              value={policyData.privacy.retentionYears}
              onChange={e => setPolicyData({ ...policyData, privacy: { ...policyData.privacy, retentionYears: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>

          {/* Full Policy Body Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                Full Policy Body &amp; Custom Legal Clauses
              </label>
              <button
                type="button"
                onClick={() => handleLoadDefaultTemplate('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#800020',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Load Default Policy Text
              </button>
            </div>
            <textarea
              rows="12"
              placeholder="Paste or write your full custom policy text here. If left blank, the public page displays standard clinical policy sections."
              value={policyData.privacy.content || ''}
              onChange={e => setPolicyData({ ...policyData, privacy: { ...policyData.privacy, content: e.target.value } })}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 13,
                fontFamily: 'inherit',
                lineHeight: 1.6,
                backgroundColor: '#F8FAFC'
              }}
            />
            <span style={{ fontSize: 11.5, color: '#64748B', display: 'block', marginTop: 4 }}>
              Note: Entering custom text here will replace the default sections on <code>/privacy</code>.
            </span>
          </div>
        </div>
      )}

      {selectedPolicy === 'terms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 840 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Document Title</label>
            <input
              type="text"
              value={policyData.terms.title}
              onChange={e => setPolicyData({ ...policyData, terms: { ...policyData.terms, title: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Governing Legal Jurisdiction</label>
              <input
                type="text"
                value={policyData.terms.jurisdiction}
                onChange={e => setPolicyData({ ...policyData, terms: { ...policyData.terms, jurisdiction: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Biomedical Warranty Period</label>
              <input
                type="text"
                value={policyData.terms.warrantyPeriod}
                onChange={e => setPolicyData({ ...policyData, terms: { ...policyData.terms, warrantyPeriod: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Heavy Machinery Advance Deposit Rule</label>
            <input
              type="text"
              value={policyData.terms.advancePaymentThreshold}
              onChange={e => setPolicyData({ ...policyData, terms: { ...policyData.terms, advancePaymentThreshold: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>

          {/* Full Policy Body Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                Full Terms Body &amp; Custom Legal Clauses
              </label>
              <button
                type="button"
                onClick={() => handleLoadDefaultTemplate('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#800020',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Load Default Terms Text
              </button>
            </div>
            <textarea
              rows="12"
              placeholder="Paste or write your full custom terms and conditions text here. If left blank, the public page displays standard terms."
              value={policyData.terms.content || ''}
              onChange={e => setPolicyData({ ...policyData, terms: { ...policyData.terms, content: e.target.value } })}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 13,
                fontFamily: 'inherit',
                lineHeight: 1.6,
                backgroundColor: '#F8FAFC'
              }}
            />
            <span style={{ fontSize: 11.5, color: '#64748B', display: 'block', marginTop: 4 }}>
              Note: Entering custom text here will replace the default sections on <code>/terms</code>.
            </span>
          </div>
        </div>
      )}

      {selectedPolicy === 'returns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 840 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Document Title</label>
            <input
              type="text"
              value={policyData.returns.title}
              onChange={e => setPolicyData({ ...policyData, returns: { ...policyData.returns, title: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Inspection &amp; Guarantee Window</label>
              <input
                type="text"
                value={policyData.returns.guaranteeDays}
                onChange={e => setPolicyData({ ...policyData, returns: { ...policyData.returns, guaranteeDays: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>WhatsApp Claims Desk Number</label>
              <input
                type="text"
                value={policyData.returns.claimsHelpline}
                onChange={e => setPolicyData({ ...policyData, returns: { ...policyData.returns, claimsHelpline: e.target.value } })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Authorized Return Logistics</label>
            <input
              type="text"
              value={policyData.returns.pickupCourier}
              onChange={e => setPolicyData({ ...policyData, returns: { ...policyData.returns, pickupCourier: e.target.value } })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
            />
          </div>

          {/* Full Policy Body Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                Full Return Policy Body &amp; Custom Legal Clauses
              </label>
              <button
                type="button"
                onClick={() => handleLoadDefaultTemplate('returns')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#800020',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Load Default Return Policy Text
              </button>
            </div>
            <textarea
              rows="12"
              placeholder="Paste or write your full custom return and refund policy text here. If left blank, the public page displays standard return policy sections."
              value={policyData.returns.content || ''}
              onChange={e => setPolicyData({ ...policyData, returns: { ...policyData.returns, content: e.target.value } })}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 13,
                fontFamily: 'inherit',
                lineHeight: 1.6,
                backgroundColor: '#F8FAFC'
              }}
            />
            <span style={{ fontSize: 11.5, color: '#64748B', display: 'block', marginTop: 4 }}>
              Note: Entering custom text here will replace the default sections on <code>/returns</code>.
            </span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
        <button
          type="button"
          disabled={isSaving}
          onClick={handlePublish}
          className="btn-solid-maroon"
          style={{ padding: '9px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Publishing...' : 'Publish Policy Updates'}
        </button>
      </div>
    </div>
  );
};
