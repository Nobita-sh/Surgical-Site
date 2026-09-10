import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      addToast('Password reset link sent to your email.');
    }, 800);
  };

  return (
    <div>
      <div className="site-container" style={{ padding: '50px 15px 70px', maxWidth: 480 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" className="brand-logo-wrap" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 12 }}>
            <span className="brand-logo-icon" style={{ fontSize: 22 }}>✚</span>
            <span className="brand-logo-text" style={{ fontSize: 24 }}>surgicals<span className="logo-domain" style={{ fontSize: 13 }}>.pk</span></span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
            Reset Password
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ display: 'inline-block', marginBottom: 14 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Instructions Sent!</h3>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>
                We have sent an email with password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link to="/login" className="btn-solid-maroon" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontSize: 13 }}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }}
                  />
                </div>

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
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'SENDING INSTRUCTIONS...' : 'SEND RESET LINK'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 13 }}>
                  <Link to="/login" style={{ color: '#4B5563', textDecoration: 'none' }}>
                    ← Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
