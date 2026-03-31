import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('agromart_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('agromart_user', JSON.stringify(userData));
    localStorage.setItem('agromart_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agromart_user');
    localStorage.removeItem('agromart_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
