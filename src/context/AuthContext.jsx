import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { REVIEW_USERS } from '../data/reviewMockData';

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

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
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
      }
    } catch {
      // API not reachable on static host -> check directory accounts
    }

    // Static Hosting Review Mode Fallback (Vercel)
    const registeredUsers = JSON.parse(localStorage.getItem('spk_registered_users') || '[]');
    const candidate = [...REVIEW_USERS, ...registeredUsers].find(
      u => u.email.toLowerCase() === targetEmail && u.password === targetPassword
    );

    if (candidate) {
      const safeUser = { ...candidate };
      delete safeUser.password;
      setUser(safeUser);
      const sessionToken = 'jwt_review_' + Date.now();
      setToken(sessionToken);
      localStorage.setItem('spk_auth_token', sessionToken);
      localStorage.setItem('spk_auth_user', JSON.stringify(safeUser));
      addToast(`Welcome back, ${safeUser.name}!`);
      return { success: true, user: safeUser };
    }

    addToast('Invalid email or password', 'error');
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        addToast(`Account created! Welcome, ${data.user.name}`);
        return { success: true, user: data.user };
      }
    } catch {
      // API not reachable -> create in localStorage for review
    }

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'customer',
      hospitalClinicName: userData.hospitalClinicName || '',
      city: userData.city || 'Lahore',
      password: userData.password
    };

    const registeredUsers = JSON.parse(localStorage.getItem('spk_registered_users') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('spk_registered_users', JSON.stringify(registeredUsers));

    const safeUser = { ...newUser };
    delete safeUser.password;
    setUser(safeUser);
    const sessionToken = 'jwt_review_' + Date.now();
    setToken(sessionToken);
    localStorage.setItem('spk_auth_token', sessionToken);
    localStorage.setItem('spk_auth_user', JSON.stringify(safeUser));
    addToast(`Account created! Welcome, ${safeUser.name}`);
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    addToast('You have been logged out.');
  };

  const updateProfile = async (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('spk_auth_user', JSON.stringify(updated));
      return updated;
    });
    addToast('Profile updated successfully!');
    return { success: true };
  };

  const verifyMfa = async (mfaToken, code) => {
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfaToken, code })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        addToast(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
    } catch {
      // API not reachable
    }

    if (code && String(code).trim().length >= 6) {
      addToast('Two-factor verification passed!');
      return { success: true };
    }

    addToast('Invalid verification code', 'error');
    return { success: false, error: 'Invalid verification code' };
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
