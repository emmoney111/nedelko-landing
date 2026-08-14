import { useCallback, useState } from 'react';
import { AUTH_CONFIG, AUTH_STORAGE_KEY } from '../config/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const login = useCallback((login: string, password: string): boolean => {
    if (login === AUTH_CONFIG.login && password === AUTH_CONFIG.password) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
