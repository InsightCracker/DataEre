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

// Split "John Doe" → { firstName: "John", lastName: "Doe" }
const splitUsername = (username = "") => {
  const parts = username.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName  = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(safeParseUser());
  const [token, setToken] = useState(localStorage.getItem('dataere_token') || null);

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

  // Derived values — always in sync with user object
  const { firstName, lastName } = splitUsername(user?.username);
  const email    = user?.email    || "";
  const userId   = user?.id       || null;
  const username = user?.username || "";
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{
      // Raw
      user,
      token,
      // Derived
      userId,
      username,
      firstName,
      lastName,
      email,
      isLoggedIn,
      // Actions
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);