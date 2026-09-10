import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('spk_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('spk_auth_token') || null;
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('spk_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('spk_auth_user');
      }

      if (token) {
        localStorage.setItem('spk_auth_token', token);
      } else {
        localStorage.removeItem('spk_auth_token');
      }
    } catch (e) {
      console.error('Failed to sync auth state', e);
    }
  }, [user, token]);

  const login = async (credentials, optionalPassword) => {
    const payload = typeof credentials === 'object' && credentials !== null
      ? credentials
      : { email: credentials, password: optionalPassword };

    const targetEmail = String(payload.email || '').toLowerCase().trim();
    const targetPassword = String(payload.password || '');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      // Check if Multi-Factor Authentication is required
      if (data.mfaRequired) {
        return {
          success: true,
          mfaRequired: true,
          mfaToken: data.mfaToken,
          message: data.message
        };
      }

      setUser(data.user);
      setToken(data.token);
      addToast(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setUser(data.user);
      setToken(data.token);
      addToast(`Account created! Welcome, ${data.user.name}`);
      return { success: true, user: data.user };
    } catch (err) {
      addToast(err.message || 'Failed to create account', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    addToast('You have been logged out.');
  };

  const updateProfile = async (updatedFields) => {
    try {
      if (user?.id) {
        await api.auth.updateProfile({ id: user.id, ...updatedFields });
      }
      setUser(prev => {
        const updated = { ...prev, ...updatedFields };
        localStorage.setItem('spk_auth_user', JSON.stringify(updated));
        return updated;
      });
      addToast('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      setUser(prev => {
        const updated = { ...prev, ...updatedFields };
        localStorage.setItem('spk_auth_user', JSON.stringify(updated));
        return updated;
      });
      addToast('Profile saved locally.');
      return { success: true };
    }
  };

  const verifyMfa = async (mfaToken, code) => {
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfaToken, code })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Two-factor verification failed');
      }

      setUser(data.user);
      setToken(data.token);
      addToast(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      addToast(err.message || 'MFA verification failed', 'error');
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        verifyMfa,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
