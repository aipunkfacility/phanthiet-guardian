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
