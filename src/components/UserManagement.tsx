import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  UserCircle,
  Settings
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Agente' | 'Cliente';
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  department: string;
  lastLogin: Date;
  createdAt: Date;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dados simulados de usuários
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Ana Suporte",
      email: "ana@empresa.com",
      role: "Admin",
      status: "Ativo",
      department: "TI",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Pedro Supervisor",
      email: "pedro@empresa.com", 
      role: "Supervisor",
      status: "Ativo",
      department: "TI",
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      name: "Carlos Agente",
      email: "carlos@empresa.com",
      role: "Agente", 
      status: "Ativo",
      department: "Suporte",
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      name: "João Silva",
      email: "joao@empresa.com",
      role: "Cliente",
      status: "Ativo", 
      department: "Vendas",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "5",
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "Cliente",
      status: "Inativo",
      department: "Marketing", 
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-destructive text-destructive-foreground";
      case "Supervisor": return "bg-warning text-warning-foreground";
      case "Agente": return "bg-primary text-primary-foreground";
      case "Cliente": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-success text-success-foreground";
      case "Inativo": return "bg-muted text-muted-foreground";
      case "Suspenso": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "Admin": 
        return ["Todos os acessos", "Gerenciar usuários", "Configurações", "Relatórios"];
      case "Supervisor":
        return ["Gerenciar agentes", "Visualizar relatórios", "Atribuir tickets"];
      case "Agente":
        return ["Atender tickets", "Chat com clientes", "Visualizar métricas próprias"];
      case "Cliente":
        return ["Abrir tickets", "Chat com suporte", "Acompanhar status"];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerencie usuários e hierarquia de acessos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+3 novos esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "Admin").length}
            </div>
            <p className="text-xs text-muted-foreground">Acesso total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "Agente" || u.role === "Supervisor").length}
            </div>
            <p className="text-xs text-muted-foreground">Equipe de suporte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "Cliente").length}
            </div>
            <p className="text-xs text-muted-foreground">Usuários finais</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Agente">Agente</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </span>
                      <span>{user.department}</span>
                      <span>Último login: {formatDate(user.lastLogin)}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        Permissões: {getRolePermissions(user.role).join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hierarquia de Acessos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hierarquia de Acessos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-l-destructive bg-destructive/5 rounded">
                <h4 className="font-medium text-destructive">Administrador</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesso total ao sistema, gerenciamento de usuários, configurações avançadas
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium">
                    {users.filter(u => u.role === "Admin").length} usuários
                  </span>
                </div>
              </div>

              <div className="p-4 border-l-4 border-l-warning bg-warning/5 rounded">
                <h4 className="font-medium text-warning">Supervisor</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerenciamento de equipe, relatórios, atribuição de tickets
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium">
                    {users.filter(u => u.role === "Supervisor").length} usuários
                  </span>
                </div>
              </div>

              <div className="p-4 border-l-4 border-l-primary bg-primary/5 rounded">
                <h4 className="font-medium text-primary">Agente</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Atendimento ao cliente, gerenciamento de tickets próprios
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium">
                    {users.filter(u => u.role === "Agente").length} usuários
                  </span>
                </div>
              </div>

              <div className="p-4 border-l-4 border-l-muted bg-muted/5 rounded">
                <h4 className="font-medium text-muted-foreground">Cliente</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Abertura de tickets, acompanhamento de status
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium">
                    {users.filter(u => u.role === "Cliente").length} usuários
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integração com GLPI */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Integração GLPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sincronize usuários e permissões com o GLPI para uma gestão unificada
            </p>
            <div className="space-y-3">
              <Button variant="outline" disabled className="w-full">
                Sincronizar Usuários GLPI
              </Button>
              <Button variant="outline" disabled className="w-full">
                Importar Estrutura Organizacional
              </Button>
              <Button variant="outline" disabled className="w-full">
                Configurar Mapeamento de Funções
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;