import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lms_token');
    const savedUser = localStorage.getItem('lms_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch { logout(); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      const userData = data.data;
      localStorage.setItem('lms_token', userData.token);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setUser(userData);
      return userData;
    }
    throw new Error(data.message);
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    if (data.success) {
      const userData = data.data;
      localStorage.setItem('lms_token', userData.token);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setUser(userData);
      return userData;
    }
    throw new Error(data.message);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('lms_user', JSON.stringify(merged));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
