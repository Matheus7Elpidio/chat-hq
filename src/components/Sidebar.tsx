import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  UserCircle,
  Menu,
  X,
  Headphones,
  LogOut,
  Users,      
  FileText,    
  Eye,
  BarChart3
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { ModeToggle } from "./ThemeToggle";

// Definição da interface para um item do menu para garantir a tipagem
interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Guarda de segurança para o primeiro render, antes do usuário ser carregado.
  if (!user) {
    return <div className={`h-screen bg-card sticky top-0 left-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}></div>;
  }

  // Lógica de menu explícita e segura para cada perfil
  const getMenuItems = (): MenuItem[] => {
    const userRole = user.role;

    // Menu base para Supervisor
    const supervisorMenu: MenuItem[] = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Atendimentos", path: "/admin/chat-history", icon: MessageSquare },
        { name: "Monitoramento", path: "/admin/monitor", icon: Eye },
        { name: "Relatórios", path: "/admin/reports", icon: FileText },
        { name: "Configurações", path: "/admin/settings", icon: Settings },
    ];

    if (userRole === 'admin') {
      // O Admin tem tudo do supervisor, mais "Usuários"
      const adminMenu = [...supervisorMenu];
      // Adiciona o item "Usuários" na posição desejada (antes de Configurações)
      adminMenu.splice(4, 0, { name: "Usuários", path: "/admin/users", icon: Users });
      return adminMenu;
    }
    
    if (userRole === 'supervisor') {
      return supervisorMenu;
    }

    if (userRole === 'agent') {
      return [
          { name: "Dashboard", path: "/", icon: LayoutDashboard },
          { name: "Chat", path: "/chat", icon: MessageSquare },
          { name: "Configurações", path: "/settings", icon: Settings },
      ];
    }

    // Retorna um array vazio como fallback seguro
    return [];
  };

  const menuItems = getMenuItems();

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
            // Verificação de rota ativa mais precisa
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
                    onClick={logout}
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
