import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  UserCircle,
  Menu,
  X,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Simulando dados do usuário logado
  const user = {
    name: "Admin Sistema",
    role: "Administrador",
    status: "online"
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: LayoutDashboard, 
      path: "/", 
      notifications: 0 
    },
    { 
      name: "Chat Suporte", 
      icon: MessageSquare, 
      path: "/chat", 
      notifications: 3 
    },
    { 
      name: "Usuários", 
      icon: Users, 
      path: "/users", 
      notifications: 0 
    },
    { 
      name: "Analytics", 
      icon: BarChart3, 
      path: "/analytics", 
      notifications: 0 
    },
    { 
      name: "Configurações", 
      icon: Settings, 
      path: "/settings", 
      notifications: 0 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-status-online";
      case "busy": return "bg-status-busy"; 
      case "away": return "bg-status-away";
      default: return "bg-status-offline";
    }
  };

  return (
    <div className={`bg-sidebar-bg text-sidebar-foreground h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header com logo e toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Headphones className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">IT Support</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Informações do usuário */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <UserCircle className="h-8 w-8" />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></div>
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.notifications > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          {item.notifications}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer com status do sistema */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70">
            <p>Sistema v2.1.0</p>
            <p>🟢 Todos os serviços operacionais</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;