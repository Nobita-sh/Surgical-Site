import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SiteStorySection } from '../components/common/SiteStorySection';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 2FA / MFA Challenge State
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMfaError('');
    try {
      const res = await login({ email, password });
      if (res && res.mfaRequired) {
        setIsMfaStep(true);
        setMfaToken(res.mfaToken);
        setTotpCode('');
        return;
      }
      if (res && res.success) {
        navigate(redirectPath);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!totpCode || !totpCode.trim()) return;
    setIsLoading(true);
    setMfaError('');
    try {
      const res = await verifyMfa(mfaToken, totpCode.trim());
      if (res && res.success) {
        navigate(redirectPath);
      } else {
        setMfaError(res?.error || 'Invalid authentication code or recovery code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMfa = () => {
    setIsMfaStep(false);
    setMfaToken('');
    setTotpCode('');
    setMfaError('');
  };

  return (
    <div>
      <div className="site-container" style={{ padding: '40px 15px 60px', maxWidth: 520 }}>
        
        {/* Auth Card Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" className="brand-logo-wrap" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 12 }}>
            <span className="brand-logo-icon" style={{ fontSize: 22 }}>✚</span>
            <span className="brand-logo-text" style={{ fontSize: 24 }}>surgicals<span className="logo-domain" style={{ fontSize: 13 }}>.pk</span></span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
            {isMfaStep ? 'Two-Factor Verification' : 'Account Sign In'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            {isMfaStep
              ? 'Enter the 6-digit code from your authenticator app or enter a backup recovery code.'
              : 'Access your orders, saved hospital equipment & fast checkout.'}
          </p>
        </div>

        {/* Form Card */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          
          {/* STEP 2: MFA CHALLENGE SCREEN */}
          {isMfaStep ? (
            <form onSubmit={handleMfaSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Shield Icon & Target User Badge */}
                <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    backgroundColor: '#FDF2F4',
                    color: '#A7144C',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>
                    Signing in as <span style={{ color: '#111827', fontWeight: 700 }}>{email}</span>
                  </div>
                </div>

                {/* Error message alert */}
                {mfaError && (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    color: '#B91C1C',
                    border: '1px solid #F87171',
                    borderRadius: 6,
                    padding: '10px 14px',
                    fontSize: 13
                  }}>
                    {mfaError}
                  </div>
                )}

                {/* TOTP / Recovery Code input */}
                <div>
                  <label htmlFor="totpCodeInput" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8, color: '#1F2937' }}>
                    Authentication Code *
                  </label>
                  <input
                    id="totpCodeInput"
                    type="text"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    placeholder="000 000 or XXXX-XXXX"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 6,
                      border: '1px solid #D1D5DB',
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: '3px',
                      textAlign: 'center',
                      outline: 'none',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                  <span style={{ fontSize: 11.5, color: '#6B7280', display: 'block', marginTop: 6, textAlign: 'center' }}>
                    Supported: Google Authenticator, Microsoft Authenticator, Authy, or 8-character recovery code.
                  </span>
                </div>

                {/* Submit Verification */}
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
                  {isLoading ? 'VERIFYING CODE...' : 'VERIFY & SIGN IN'}
                </button>

                {/* Back to password sign-in */}
                <div style={{ textAlign: 'center', borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
                  <button
                    type="button"
                    onClick={handleCancelMfa}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4B5563',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    ← Sign in with a different account
                  </button>
                </div>

              </div>
            </form>
          ) : (
            /* STEP 1: REGULAR EMAIL / PASSWORD FORM */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Email Address */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#1F2937' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 6,
                      border: '1px solid #D1D5DB',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>
                      Password *
                    </label>
                    <Link to="/forgot-password" style={{ fontSize: 12, color: '#A7144C', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 6,
                      border: '1px solid #D1D5DB',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Remember Me */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="rememberMe" style={{ cursor: 'pointer', color: '#4B5563' }}>
                    Keep me signed in on this device
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
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN TO ACCOUNT'}
                </button>

              </div>
            </form>
          )}

          {/* Switch to Register */}
          {!isMfaStep && (
            <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 18, borderTop: '1px solid #F0F0F0', fontSize: 13, color: '#4B5563' }}>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ color: '#A7144C', fontWeight: 700, textDecoration: 'none' }}>
                Create Account
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Narrative Story Section */}
      <SiteStorySection />
    </div>
  );
};
