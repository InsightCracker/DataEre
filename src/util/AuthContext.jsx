import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const safeParseUser = () => {
  try {
    const raw = localStorage.getItem('dataere_user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(safeParseUser());
  const [token, setToken] = useState(
    localStorage.getItem('dataere_token') || null
  );

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('dataere_user', JSON.stringify(userData));
    localStorage.setItem('dataere_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dataere_user');
    localStorage.removeItem('dataere_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);