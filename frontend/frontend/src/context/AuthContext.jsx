import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('shareit_token'));
  const [user,  setUser]  = useState(() => {
    const t = localStorage.getItem('shareit_token');
    return t ? parseJwt(t) : null;
  });

  const login = useCallback((jwt) => {
    localStorage.setItem('shareit_token', jwt);
    setToken(jwt);
    setUser(parseJwt(jwt));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('shareit_token');
    setToken(null);
    setUser(null);
  }, []);

  const username = user?.sub || user?.username || user?.name || '';

  const value = { token, user, username, login, logout, isAuthed: !!token };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}