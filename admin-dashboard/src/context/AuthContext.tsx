/**
 * Authentication Context for Admin Dashboard
 * Manages global authentication state and provides auth methods
 */

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi } from '../api/endpoints/auth';
import { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          // Only allow admins to access admin dashboard
          if (response.data.role === 'ADMIN') {
            setUser(response.data);
          } else {
            // Student trying to access admin dashboard - logout
            localStorage.removeItem(TOKEN_KEY);
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    
    // Only allow admins to login to admin dashboard
    if (response.data.user.role !== 'ADMIN') {
      throw new Error('Access denied. This dashboard is for administrators only.');
    }
    
    localStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

