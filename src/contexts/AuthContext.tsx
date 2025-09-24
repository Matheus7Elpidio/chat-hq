'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const API_URL = ''; // O proxy do Vite cuida do redirecionamento

interface User {
  id: number;
  name: string;
  role: 'admin' | 'supervisor' | 'agent' | 'client';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean; // Indica se está tentando autenticar via token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
          } else {
            // Token inválido ou expirado
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error("Falha ao verificar token", error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
