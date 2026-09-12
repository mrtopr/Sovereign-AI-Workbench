import { useState, createContext, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
    try {
      const data = await authAPI.login(username, password);
      setUser(data.user);
      localStorage.setItem('mrpl_user', JSON.stringify(data.user));
      localStorage.setItem('mrpl_user_id', data.user.username);
      return true;
    } catch (err) {
      // Fallback to local mock if backend is down
      const found = DEMO_USERS.find(u => u.username === username && u.password === password);
      if (found) {
        setUser(found);
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
    localStorage.removeItem('mrpl_user');
    localStorage.removeItem('mrpl_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
