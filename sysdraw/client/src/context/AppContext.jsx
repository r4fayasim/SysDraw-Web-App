/**
 * SysDraw - App Context
 * Manages global authentication state and current project state
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('sysdraw_token');
    const savedUser = localStorage.getItem('sysdraw_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsAuthLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('sysdraw_token', token);
    localStorage.setItem('sysdraw_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sysdraw_token');
    localStorage.removeItem('sysdraw_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentProject(null);
    setCurrentPage(null);
  };

  const openProject = (project) => {
    setCurrentProject(project);
    setCurrentPage(project.pages?.[0] || null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthLoading,
        login,
        logout,
        currentProject,
        setCurrentProject,
        currentPage,
        setCurrentPage,
        openProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
