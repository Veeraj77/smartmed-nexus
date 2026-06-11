import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data);
    } catch { localStorage.removeItem('token'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
