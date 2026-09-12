import { useState, createContext, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Restore session from localStorage on page reload
  useEffect(() => {
    const stored = localStorage.getItem('mrpl_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setError('');
    // Authentic LDAP / Sovereign Auth Verification delay
    await new Promise(r => setTimeout(r, 750));
    try {
      const data = await authAPI.login(username, password);
      setUser(data.user);
      setIsInitializing(true);
      localStorage.setItem('mrpl_user', JSON.stringify(data.user));
      localStorage.setItem('mrpl_user_id', data.user.username);
      return true;
    } catch (err) {
      // Fallback to local mock if backend is down
      const found = DEMO_USERS.find(u => u.username === username && u.password === password);
      if (found) {
        setUser(found);
        setIsInitializing(true);
        localStorage.setItem('mrpl_user', JSON.stringify(found));
        localStorage.setItem('mrpl_user_id', found.username);
        return true;
      }
      setError(err?.response?.data?.detail || 'Invalid credentials. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsInitializing(false);
    localStorage.removeItem('mrpl_user');
    localStorage.removeItem('mrpl_user_id');
  };

  const finishInitializing = () => {
    setIsInitializing(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading, isInitializing, finishInitializing }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
