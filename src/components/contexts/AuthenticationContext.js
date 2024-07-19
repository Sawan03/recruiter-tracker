import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  const login = (token) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUserRole(decodedToken.role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', decodedToken.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
