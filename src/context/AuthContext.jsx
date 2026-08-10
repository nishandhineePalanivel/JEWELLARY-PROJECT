import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('neela_token') || null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (token) {
      api.get('/auth/profile')
        .then(res => {
          setUser(res.data.user);
          fetchAddresses();
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses');
      setAddresses(res.data);
    } catch (e) {
      console.warn('Failed to load user addresses');
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('neela_token', newToken);
    setToken(newToken);
    setUser(userData);
    fetchAddresses();
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('neela_token', newToken);
    setToken(newToken);
    setUser(userData);
    fetchAddresses();
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('neela_token');
    setToken(null);
    setUser(null);
    setAddresses([]);
  };

  const addAddress = async (addressData) => {
    const res = await api.post('/auth/addresses', addressData);
    setAddresses(prev => [res.data, ...prev]);
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    addresses,
    addAddress,
    refreshAddresses: fetchAddresses
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
