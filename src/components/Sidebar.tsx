import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  UserCircle,
  Menu,
  X,
  Headphones,
  LogOut,
  Building2, // Ícone para Organização
  Users,      // Ícone para Usuários
  FileText    // Ícone para Relatórios
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ThemeToggle";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Helper para construir o caminho da rota com base no perfil
  const getPath = (basePath: string) => {
    if ((user.role === 'Admin' || user.role === 'Supervisor')) {
        // Assegura que o basePath comece com / e remove duplicidades
        const cleanBasePath = basePath.startsWith('/') ? basePath.substring(1) : basePath;
        // Lida com o caso especial do dashboard
        if (cleanBasePath === 'dashboard') return '/admin/dashboard';
        return `/admin/${cleanBasePath}`;
    }
    return basePath.startsWith('/') ? basePath : `/${basePath}`;
  };

  const getMenuItems = () => {
    const allItems = [
      // Rota para Dashboard de Admin/Supervisor
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: getPath('dashboard'), // Caminho dinâmico
        roles: ["Admin", "Supervisor"]
      },
      // Rota para Dashboard de Agente
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: '/', // Rota raiz para agente
        roles: ["Agente"]
      },
      {
        name: "Atendimentos",
        icon: MessageSquare,
        path: getPath('chat-history'),
        notifications: 3, 
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Chat",
        icon: MessageSquare,
        path: '/chat',
        notifications: 3, 
        roles: ["Agente"]
      },
      {
        name: "Usuários",
        icon: Users,
        path: getPath('users'),
        roles: ["Admin"]
      },
      {
        name: "Relatórios",
        icon: FileText,
        path: getPath('reports'),
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Monitoramento",
        icon: BarChart3,
        path: getPath('monitor'),
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Configurações",
        icon: Settings,
        path: getPath('settings'),
        roles: ["Admin", "Supervisor", "Agente"]
      }
    ];

    return allItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`bg-card text-card-foreground h-screen flex flex-col transition-all duration-300 sticky top-0 left-0 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
       <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Headphones className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold">IT Support</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:bg-accent"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <UserCircle className="h-8 w-8 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // A verificação de rota ativa precisa ser mais inteligente
          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-card-foreground'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`flex-shrink-0 h-5 w-5`} />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {!isCollapsed && item.notifications && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {item.notifications}
                  </Badge>
                )}
              </NavLink>
            </li>
          );
        })}
      </nav>

      <div className="p-2 border-t mt-auto">
         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-muted-foreground hover:bg-accent space-x-3"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </Button>
            )}
            <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
