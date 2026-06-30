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

const splitUsername = (username = "") => {
  const parts     = username.trim().split(" ");
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

  // Update stored user (used after profile edit)
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('dataere_user', JSON.stringify(merged));
  };

  // Derived values
  const { firstName, lastName } = splitUsername(user?.username);
  const email         = user?.email         || "";
  const userId        = user?.id            || null;
  const username      = user?.username      || "";
  const streak        = user?.streak        ?? 0;
  const longestStreak = user?.longestStreak ?? 0;
  const joinDate      = user?.joinDate      || null;
  const isPublic      = user?.isPublic      ?? true;
  const isLoggedIn    = !!token;

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
      streak,
      longestStreak,
      joinDate,
      isPublic,
      isLoggedIn,
      // Actions
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);