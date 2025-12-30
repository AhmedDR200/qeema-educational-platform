/**
 * Authentication Context
 * Manages global authentication state and provides auth methods
 */

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi } from '../api/endpoints/auth';
import { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

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
          // Only allow students to access student portal
          if (response.data.role === 'STUDENT') {
            setUser(response.data);
          } else {
            // Admin trying to access student portal - logout
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
    
    // Only allow students to login to student portal
    if (response.data.user.role !== 'STUDENT') {
      throw new Error('Access denied. This portal is for students only.');
    }
    
    localStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const response = await authApi.register(credentials);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

