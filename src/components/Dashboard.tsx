import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp, 
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

const Dashboard = () => {
  const metrics = {
    totalTickets: 247,
    activeChats: 12,
    avgResponseTime: "2.3 min",
    satisfactionRate: 94.2,
    agentsOnline: 8,
    agentsTotal: 12,
    todayResolved: 45,
    pendingTickets: 23
  };

  const recentTickets = [
    { id: "#1234", user: "João Silva", subject: "Problema de rede", status: "Em andamento", time: "14:30", priority: "Alta" },
    { id: "#1235", user: "Maria Santos", subject: "Reset de senha", status: "Resolvido", time: "14:25", priority: "Baixa" },
    { id: "#1236", user: "Carlos Oliveira", subject: "Instalação software", status: "Aguardando", time: "14:20", priority: "Média" },
    { id: "#1237", user: "Ana Costa", subject: "Acesso ao sistema", status: "Em andamento", time: "14:15", priority: "Alta" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolvido": return "bg-success text-success-foreground";
      case "Em andamento": return "bg-primary text-primary-foreground";
      case "Aguardando": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-destructive text-destructive-foreground";
      case "Média": return "bg-warning text-warning-foreground";
      case "Baixa": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Suporte TI</h1>
          <p className="text-muted-foreground mt-1">Visão geral das operações de suporte</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Novo Ticket
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTickets}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chats Ativos</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeChats}</div>
            <p className="text-xs text-muted-foreground">Agentes disponíveis: {metrics.agentsOnline}/{metrics.agentsTotal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TME (Tempo Médio)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">-8% melhoria esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">Meta: 90%</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Diário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Resolvidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{metrics.todayResolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{metrics.pendingTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Agentes Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{metrics.agentsOnline}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{ticket.id} - {ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.user} • {ticket.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrações Futuras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Integração GLPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Conecte com o GLPI para sincronizar tickets e dados de atendimento
            </p>
            <Button variant="outline" disabled>
              Configurar Integração
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Agent n8n</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configure automações e workflows com n8n para otimizar atendimentos
            </p>
            <Button variant="outline" disabled>
              Configurar Agent
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;