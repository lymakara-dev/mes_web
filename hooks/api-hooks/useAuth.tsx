'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // <-- Import js-cookie

// Define the shape of the data from your login API
interface AuthData {
  user: { id: string; name: string; email: string; role: string };
  accessToken: string;
}

interface AuthContextType {
  user: { id: string; name: string; email: string; role: string } | null;
  isLoading: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On initial load, try to retrieve user info if a token exists
    try {
      const token = Cookies.get('auth_token');
      if (token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth state');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (authData: AuthData) => {
    setUser(authData.user);
    // --- KEY CHANGES ---
    // 1. Store the token in a cookie for server and client access
    Cookies.set('auth_token', authData.accessToken, { expires: 1, secure: process.env.NODE_ENV === 'production' });
    // 2. Store user data in localStorage for quick UI updates
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const logout = () => {
    setUser(null);
    // --- KEY CHANGES ---
    // 1. Remove the cookie
    Cookies.remove('auth_token');
    // 2. Remove user data from localStorage
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};