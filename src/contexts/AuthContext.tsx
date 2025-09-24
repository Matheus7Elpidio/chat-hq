import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Agente' | 'Cliente';
  department: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Dados simulados de usuários
const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Ana Suporte",
    email: "admin@empresa.com",
    password: "admin123",
    role: "Admin",
    department: "TI"
  },
  {
    id: "2", 
    name: "Pedro Supervisor",
    email: "supervisor@empresa.com",
    password: "sup123",
    role: "Supervisor",
    department: "TI"
  },
  {
    id: "3",
    name: "Carlos Agente", 
    email: "agente@empresa.com",
    password: "agent123",
    role: "Agente",
    department: "Suporte"
  },
  {
    id: "4",
    name: "João Cliente",
    email: "cliente@empresa.com", 
    password: "client123",
    role: "Cliente",
    department: "Vendas"
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se email já existe
    const emailExists = mockUsers.some(u => u.email === userData.email);
    if (emailExists) {
      setIsLoading(false);
      return false;
    }
    
    // Criar novo usuário
    const newUser = {
      ...userData,
      id: Date.now().toString()
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};