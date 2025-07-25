import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // On mount, read token and user from localStorage
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      try {
        const parsed: User = JSON.parse(savedUser);
        setUser(parsed);
      } catch (err) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { identifier, password });
      const { token: jwt, ...userData } = res.data;
      setToken(jwt);
      setUser(userData as User);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Optionally reload the page to clear state
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const value: AuthContextProps = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};