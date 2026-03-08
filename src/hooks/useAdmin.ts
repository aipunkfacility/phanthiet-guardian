import { useState, useCallback, useEffect } from 'react';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((password: string) => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    const success = password === correctPassword;
    
    if (success) {
      setIsAdmin(true);
      setIsAuthenticated(true);
      sessionStorage.setItem('phanthiet-admin', 'true');
    }
    
    return success;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setIsAuthenticated(false);
    sessionStorage.removeItem('phanthiet-admin');
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('phanthiet-admin');
    if (saved === 'true') {
      setIsAdmin(true);
      setIsAuthenticated(true);
    }
  }, []);

  return {
    isAdmin,
    isAuthenticated,
    login,
    logout,
  };
}

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  return {
    isAdmin,
    toggleAdmin,
  };
}

export function useAdminProtection() {
  const { isAdmin, isAuthenticated, login } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);

  const requireAdmin = useCallback(() => {
    if (!isAdmin) {
      setShowLogin(true);
      return false;
    }
    return true;
  }, [isAdmin]);

  const closeLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  return {
    isAdmin,
    isAuthenticated,
    login,
    showLogin,
    closeLogin,
    requireAdmin,
  };
}