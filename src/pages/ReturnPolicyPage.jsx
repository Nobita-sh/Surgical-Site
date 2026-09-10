import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const ReturnPolicyPage = () => {
  const [returns, setReturns] = useState({
    title: 'Return, Refund & Warranty Policy',
    guaranteeDays: '7 Days Inspection Period',
    claimsHelpline: '+92 300 0000000',
    payoutMethods: 'Direct IBAN Bank Transfer, EasyPaisa, JazzCash',
    pickupCourier: 'TCS Express / Leopards Courier'
  });

  useEffect(() => {
    api.cms.getPolicyPages()
      .then(res => {
        if (res?.returns) setReturns(res.returns);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="site-container" style={{ padding: '30px 16px 70px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#111', fontWeight: 600 }}>{returns.title || 'Return Policy'}</span>
      </nav>

      {/* Hero Header */}
      <div style={{
        backgroundColor: '#F8F9FA',
        border: '1px solid #ECECEC',
        borderRadius: 12,
        padding: '32px 24px',
        marginBottom: 35
      }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#111', margin: '0 0 10px' }}>
          {returns.title || 'Return & Refund Policy'}
        </h1>
        <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>
          Customer Confidence &bull; Clinical Safety Guarantee ({returns.guaranteeDays}) &bull; Swift Claims Processing
        </p>
        <p style={{ fontSize: 14, color: '#444', marginTop: 12, lineHeight: 1.6 }}>
          We stand behind the authenticity and quality of every surgical instrument and medical device dispatched from our facilities. If an item arrives damaged, defective, or mis-specified, our <strong>{returns.guaranteeDays || '7-Day Inspection Period'}</strong> ensures you are protected.
        </p>
      </div>

      {/* Custom Full Returns Content or Standard Default Sections */}
      {returns.content ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '36px 30px',
          marginBottom: 35,
          fontSize: 15,
          color: '#334155',
          lineHeight: 1.85,
          whiteSpace: 'pre-wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {returns.content}
        </div>
      ) : (
        <>
          {/* 3-Step Simple Process Cards */}
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
            How The Return &amp; Replacement Process Works
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 35
          }}>
            <div style={{ padding: 22, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#800020', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                1
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Notify Our Helpline</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                WhatsApp our claims desk at <strong>{returns.claimsHelpline || '+92 300 0000000'}</strong> within <strong>{returns.guaranteeDays || '7 days'}</strong> of delivery with your Order ID and photo/video of the defect.
              </p>
            </div>

            <div style={{ padding: 22, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#800020', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                2
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Free Return Pickup</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                Our courier partner ({returns.pickupCourier || 'TCS Express / Leopards Courier'}) will collect the item from your clinic, hospital, or home address in original packaging.
              </p>
            </div>

            <div style={{ padding: 22, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#800020', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                3
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Replacement / Refund</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                Upon quick technician inspection, a fresh replacement unit is dispatched immediately, or 100% refund is credited via {returns.payoutMethods || 'Direct IBAN Bank Transfer, EasyPaisa, JazzCash'}.
              </p>
            </div>
          </div>

          {/* Detailed Policy Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: '#333', fontSize: 14.5, lineHeight: 1.7, marginBottom: 35 }}>
            
            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                1. 7-Day Clinical Inspection Window
              </h3>
              <p>
                We understand the critical precision required in healthcare. Every customer is entitled to a <strong>{returns.guaranteeDays || '7-Day Inspection Period'}</strong> from the date of recorded courier delivery. During this period, you may examine and test the equipment to ensure it matches the technical specifications and clinical performance agreed upon.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                2. Conditions for Return or Replacement
              </h3>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li><strong>Defective or Transit Damaged:</strong> If the unit has manufacturing flaws or arrived with broken components, we replace it with a fresh tested unit with zero additional shipping charges.</li>
                <li><strong>Wrong Item Shipped:</strong> If the model, probe, size, or variant received differs from your invoice order, we facilitate an immediate priority swap via TCS Express.</li>
                <li><strong>Hygiene &amp; Sterile Supplies:</strong> Sterile disposables (catheters, surgical blades, disposable drapes, sutures) cannot be returned once their sterile packaging is unsealed or breached due to infection control protocols.</li>
              </ul>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                3. Refund Settlement &amp; Timeline
              </h3>
              <p>
                Once returned equipment is checked by our biomedical service engineer, refunds are approved within <strong>24 to 48 hours</strong>. Payouts are remitted via:
              </p>
              <div style={{ backgroundColor: '#F9FAFB', padding: '12px 18px', borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 8, fontSize: 14 }}>
                <strong>Approved Refund Channels:</strong> {returns.payoutMethods || 'Direct IBAN Bank Transfer, EasyPaisa, JazzCash'}
              </div>
            </section>

          </div>
        </>
      )}

      {/* Eligible vs Non-Eligible Comparison Table */}
      <div style={{ marginBottom: 35 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
          Clinical Eligibility Guidelines
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20
        }}>
          {/* Eligible Items */}
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 20 }}>
            <h4 style={{ color: '#166534', margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
              Items Eligible for Return &amp; Exchange
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
              <li>Electronic devices with factory calibration errors or dead-on-arrival components.</li>
              <li>Equipment with physical damage sustained during courier transit.</li>
              <li>Orders where an incorrect model, size, or specification was sent by mistake.</li>
              <li>Unopened rehabilitation items with factory security seals intact.</li>
            </ul>
          </div>

          {/* Non-Eligible Hygiene Items */}
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 20 }}>
            <h4 style={{ color: '#991B1B', margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
              Non-Returnable Hygiene Items
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
              <li>Sterilized disposable surgical goods whose sterile blister pack has been torn or unsealed.</li>
              <li>Used body belts, cervical collars, and compression garments due to skin-contact hygiene laws.</li>
              <li>Commode buckets or toilet aids that have been assembled and put into patient contact.</li>
              <li>Custom fabricated orthopedic orthotics or hospital beds built to specific room dimensions.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Refund Method & Timeline */}
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24, marginBottom: 28, color: '#333', fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
          Refund Timelines &amp; Payout Options
        </h3>
        <p>
          Once the returned item is approved by our biomedical quality assurance team (typically within 24 to 48 hours of receipt):
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li><strong>Bank Transfers:</strong> Processed in 1 to 2 business days directly to your IBAN (HBL, Meezan, Alfalah, UBL, etc.).</li>
          <li><strong>EasyPaisa / JazzCash:</strong> Instant mobile account transfer within 4 hours of approval.</li>
          <li><strong>Online Card Purchases:</strong> Reversal processed within 5 to 7 banking days per standard Visa / Mastercard processor guidelines.</li>
        </ul>
      </div>

      {/* Contact Support Banner */}
      <div style={{ backgroundColor: '#F8F9FA', borderRadius: 12, padding: 24, border: '1px solid #ECECEC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#111' }}>
            Need Immediate Help with an Order?
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
            Our claims and technical support team is available Monday &ndash; Saturday (9:00 AM &ndash; 7:00 PM).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={`https://wa.me/${(returns.claimsHelpline || '923000000000').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-framed"
            style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', backgroundColor: '#25D366', color: '#FFF', borderColor: '#25D366' }}
          >
            WhatsApp Claims Desk ({returns.claimsHelpline || '+92 300 0000000'})
          </a>
          <Link
            to="/track-order"
            className="btn-framed"
            style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}
          >
            Track My Order
          </Link>
        </div>
      </div>

    </div>
  );
};
