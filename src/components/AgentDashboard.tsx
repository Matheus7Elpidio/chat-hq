import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Clock, 
  Star, 
  CheckCircle,
  TrendingUp,
  Target,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AgentDashboard = () => {
  const { user } = useAuth();

  // Métricas específicas do agente logado
  const agentMetrics = {
    ticketsAtendidos: 23,
    tempoMedioResposta: "1.8 min",
    satisfacaoCliente: 96.5,
    ticketsResolvidos: 21,
    ticketsAbertos: 2,
    metaMensal: 45,
    progressoMeta: (23 / 45) * 100
  };

  const ticketsRecentes = [
    { id: "#1234", cliente: "João Silva", assunto: "Problema de rede", status: "Em andamento", tempo: "14:30", prioridade: "Alta" },
    { id: "#1235", cliente: "Maria Santos", assunto: "Reset de senha", status: "Resolvido", tempo: "14:25", prioridade: "Baixa" },
    { id: "#1236", cliente: "Carlos Oliveira", assunto: "Instalação software", status: "Em andamento", tempo: "14:20", prioridade: "Média" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolvido": return "bg-success text-success-foreground";
      case "Em andamento": return "bg-primary text-primary-foreground";
      case "Aguardando": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
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
          <h1 className="text-3xl font-bold">Meu Dashboard</h1>
          <p className="text-muted-foreground mt-1">Olá, {user?.name}! Aqui está sua performance hoje</p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      {/* Métricas Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Atendidos Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{agentMetrics.ticketsAtendidos}</div>
            <p className="text-xs text-muted-foreground">Meta mensal: {agentMetrics.metaMensal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meu Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{agentMetrics.tempoMedioResposta}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              15% melhor que ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minha Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{agentMetrics.satisfacaoCliente}%</div>
            <p className="text-xs text-muted-foreground">Baseado em 18 avaliações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{agentMetrics.ticketsResolvidos}</div>
            <p className="text-xs text-muted-foreground">{agentMetrics.ticketsAbertos} em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso da Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso da Meta Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {agentMetrics.ticketsAtendidos} de {agentMetrics.metaMensal} tickets
              </span>
              <span className="text-sm text-muted-foreground">
                {agentMetrics.progressoMeta.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${agentMetrics.progressoMeta}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Restam {agentMetrics.metaMensal - agentMetrics.ticketsAtendidos} tickets para atingir a meta
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meus Tickets Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Atendimentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketsRecentes.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{ticket.id} - {ticket.assunto}</p>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {ticket.cliente} • {ticket.tempo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(ticket.prioridade)}>
                    {ticket.prioridade}
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

      {/* Dicas e Melhorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-success">🎉 Parabéns!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                ✅ <strong>Ótima performance hoje!</strong> Você está 15% acima da média da equipe.
              </p>
              <p className="text-sm">
                ⭐ <strong>Satisfação excelente!</strong> 96.5% de satisfação dos clientes.
              </p>
              <p className="text-sm">
                ⚡ <strong>Resposta rápida!</strong> Seu tempo médio está 20% melhor que a meta.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">💡 Dicas para Melhorar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                📚 <strong>Estude os tickets mais comuns</strong> para respostas mais rápidas
              </p>
              <p>
                🤝 <strong>Use templates</strong> para problemas frequentes
              </p>
              <p>
                📊 <strong>Acompanhe suas métricas</strong> diariamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;