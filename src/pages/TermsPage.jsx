import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const TermsPage = () => {
  const [terms, setTerms] = useState({
    title: 'Terms & Conditions',
    effectiveDate: 'January 1, 2025',
    jurisdiction: 'Lahore, Punjab, Pakistan',
    advancePaymentThreshold: 'Rs. 50,000 (Machinery & Ultrasound Units)',
    warrantyPeriod: '1 to 3 Years Official Manufacturer Warranty'
  });

  useEffect(() => {
    api.cms.getPolicyPages()
      .then(res => {
        if (res?.terms) setTerms(res.terms);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="site-container" style={{ padding: '30px 16px 70px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#111', fontWeight: 600 }}>{terms.title || 'Terms & Conditions'}</span>
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
          {terms.title || 'Terms & Conditions'}
        </h1>
        <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>
          Last Updated: {terms.effectiveDate} &bull; Operational under Pakistan Commercial Laws ({terms.jurisdiction})
        </p>
        <p style={{ fontSize: 14, color: '#444', marginTop: 12, lineHeight: 1.6 }}>
          Welcome to <strong>Surgicals.pk</strong>. By accessing our platform, placing purchase orders, or requesting institutional medical quotations, you agree to comply with and be bound by the following terms and commercial conditions.
        </p>
      </div>

      {/* Custom Full Terms Content or Standard Default Sections */}
      {terms.content ? (
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
          {terms.content}
        </div>
      ) : (
        <>
          {/* Key Guarantees Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 35
          }}>
            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Certified Medical Equipment</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                All medical machinery, hospital furniture, and instruments comply with CE, ISO, and DRAP clinical standards.
              </p>
            </div>

            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Nationwide Transit Insurance</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                All fragile electro-medical shipments are insured and packaged in wooden crates or heavy-duty cartons.
              </p>
            </div>

            <div style={{ padding: 20, borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#FFF' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111' }}>Official Warranty</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                Electronic monitors and machines include 1 to 3 years official manufacturer warranty with parts and labor backup.
              </p>
            </div>
          </div>

          {/* Terms Body Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: '#333', fontSize: 14.5, lineHeight: 1.7 }}>
            
            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                1. User Eligibility &amp; Clinical Disclaimer
              </h3>
              <p>
                By placing an order on Surgicals.pk, you certify that you are at least 18 years old and possess the legal authority to enter into purchasing contracts. Medical equipment and diagnostic supplies purchased on this website are intended for use by trained healthcare professionals, licensed clinics, registered hospitals, or individuals following direct medical supervision.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                2. Quotations, Pricing &amp; Currency
              </h3>
              <p>
                All prices are listed in <strong>Pakistani Rupees (PKR)</strong>. While we endeavor to maintain accurate real-time inventory and pricing, discrepancies may occasionally occur due to international currency fluctuations on imported biomedical machinery. Surgicals.pk reserves the right to cancel or amend orders with full notification and refund in such instances. Official quotations issued to hospitals remain valid for 15 calendar days from the date of issue.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                3. Heavy Diagnostic Equipment Orders &amp; Advance Deposits
              </h3>
              <p>
                Standard instruments and consumables qualify for unconditional Cash on Delivery. However, for specialized capital equipment (e.g. 4D Ultrasound scanners, OT tables, surgical LED lights, dialysis consumables) exceeding <strong>{terms.advancePaymentThreshold || 'Rs. 50,000'}</strong>, a minimum 20% commitment deposit via direct bank transfer is required before shipment dispatch from our central distribution hub.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                4. Logistics, Transit Risk &amp; Inspection
              </h3>
              <p>
                We partner with premier national couriers (TCS Express, Leopards, Daewoo Cargo) to ensure safe, temperature-monitored transit where required. Customers are advised to examine the outer tamper-evident seals upon handover. If an outer package shows severe transit crushing or puncture, note the exception on the courier delivery sheet and contact our operations helpline immediately.
              </p>
            </section>

            <section style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                5. Biomedical Warranty ({terms.warrantyPeriod || '1 to 3 Years'}) &amp; Technical Support
              </h3>
              <p>
                Electro-medical equipment backed by official warranty covers manufacturing defects, sensor malfunctions, and motherboard failures. Warranty is rendered void if the device suffers physical drop damage, liquid ingress, or unauthorized repair attempts by uncertified personnel.
              </p>
            </section>

            <section style={{ backgroundColor: '#F8F9FA', borderRadius: 10, padding: 24, border: '1px solid #ECECEC' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>
                6. Governing Jurisdiction
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, color: '#555' }}>
                These terms are governed in accordance with the commercial laws of the <strong>Islamic Republic of Pakistan</strong>. Any commercial disputes shall be subject to the exclusive jurisdiction of the competent civil courts of {terms.jurisdiction || 'Lahore, Punjab'}.
              </p>
            </section>

          </div>
        </>
      )}

    </div>
  );
};
