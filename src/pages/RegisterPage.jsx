import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer', // customer, doctor, wholesale
    hospitalClinicName: '',
    city: 'Lahore',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (!formData.agreeTerms) {
      addToast('Please agree to terms and conditions.', 'error');
      return;
    }

    setIsLoading(true);
    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div>
      <div className="site-container" style={{ padding: '40px 15px 60px', maxWidth: 580 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" className="brand-logo-wrap" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 12 }}>
            <span className="brand-logo-icon" style={{ fontSize: 22 }}>✚</span>
            <span className="brand-logo-text" style={{ fontSize: 24 }}>surgicals<span className="logo-domain" style={{ fontSize: 13 }}>.pk</span></span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
            Create New Account
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Join Pakistan's premier surgical equipment and medical supply network.
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Full Name */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                  Full Name / Title *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Ayesha Khan"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                />
              </div>

              {/* Email & Phone Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ayesha@clinic.pk"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0300-1234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Account Type / Role */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="customer">Patient / Home Care User</option>
                  <option value="doctor">Doctor / Surgeon / Medical Practitioner</option>
                  <option value="wholesale">Hospital / Clinic / Pharmacy Wholesale</option>
                </select>
              </div>

              {/* Hospital / Clinic Name if Doctor/Wholesale */}
              {formData.role !== 'customer' && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Hospital / Clinic / Business Name
                  </label>
                  <input
                    type="text"
                    name="hospitalClinicName"
                    placeholder="e.g. Shaukat Khanum / City Care Clinic"
                    value={formData.hospitalClinicName}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>
              )}

              {/* City Selection */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                  Primary City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                </select>
              </div>

              {/* Password & Confirm Password Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Create Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Agreement */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#4B5563', marginTop: 4 }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  style={{ marginTop: 3, cursor: 'pointer' }}
                />
                <label htmlFor="agreeTerms" style={{ cursor: 'pointer' }}>
                  I agree to the <Link to="/terms" style={{ color: '#A7144C' }}>Terms &amp; Conditions</Link> and <Link to="/privacy" style={{ color: '#A7144C' }}>Privacy Policy</Link> of Surgicals.pk.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-solid-maroon"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: 6
                }}
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}
              </button>

            </div>
          </form>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#4B5563' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A7144C', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>

        </div>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
