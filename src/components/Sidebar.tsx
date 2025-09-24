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
  Headphones,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Simulando dados do usuário logado
  if (!user) return null;

  // Menu baseado no role do usuário
  const getMenuItems = () => {
    const baseItems = [
      { 
        name: "Dashboard", 
        icon: LayoutDashboard, 
        path: "/", 
        notifications: 0,
        roles: ["Admin", "Supervisor", "Agente", "Cliente"]
      },
    ];

    const roleBasedItems = [];

    if (user.role === "Admin" || user.role === "Supervisor") {
      roleBasedItems.push(
        { 
          name: "Chat Suporte", 
          icon: MessageSquare, 
          path: "/chat", 
          notifications: 3,
          roles: ["Admin", "Supervisor", "Agente"]
        },
        { 
          name: "Usuários", 
          icon: Users, 
          path: "/users", 
          notifications: 0,
          roles: ["Admin", "Supervisor"]
        },
        { 
          name: "Analytics", 
          icon: BarChart3, 
          path: "/analytics", 
          notifications: 0,
          roles: ["Admin", "Supervisor"]
        }
      );
    }

    if (user.role === "Agente") {
      roleBasedItems.push(
        { 
          name: "Chat Suporte", 
          icon: MessageSquare, 
          path: "/chat", 
          notifications: 3,
          roles: ["Admin", "Supervisor", "Agente"]
        }
      );
    }

    if (user.role === "Cliente") {
      roleBasedItems.push(
        { 
          name: "Meus Tickets", 
          icon: MessageSquare, 
          path: "/tickets", 
          notifications: 1,
          roles: ["Cliente"]
        }
      );
    }

    roleBasedItems.push(
      { 
        name: "Configurações", 
        icon: Settings, 
        path: "/settings", 
        notifications: 0,
        roles: ["Admin", "Supervisor", "Agente", "Cliente"]
      }
    );

    return [...baseItems, ...roleBasedItems].filter(item => 
      item.roles.includes(user.role)
    );
  };

  const menuItems = getMenuItems();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-status-online";
      case "busy": return "bg-status-busy"; 
      case "away": return "bg-status-away";
      default: return "bg-status-offline";
    }
  };

  const handleLogout = () => {
    logout();
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
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-status-online`}></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.role}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
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