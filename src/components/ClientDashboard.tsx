import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

const ClientDashboard = () => {
  const { user } = useAuth();

  // Dados do cliente
  const clientStats = {
    ticketsAbertos: 2,
    ticketsResolvidos: 8,
    ticketsPendentes: 1,
    tempoMedioResolucao: "4.2 horas"
  };

  const meusTickets = [
    { 
      id: "#1234", 
      assunto: "Problema com acesso ao sistema", 
      status: "Em andamento", 
      prioridade: "Alta",
      criadoEm: "Hoje 14:30",
      agente: "Ana Suporte",
      ultimaAtualizacao: "15:45"
    },
    { 
      id: "#1230", 
      assunto: "Solicitação de nova impressora", 
      status: "Aguardando aprovação", 
      prioridade: "Média",
      criadoEm: "Ontem 16:20",
      agente: "Pedro Supervisor",
      ultimaAtualizacao: "Hoje 09:30"
    },
    { 
      id: "#1228", 
      assunto: "Reset de senha do email", 
      status: "Resolvido", 
      prioridade: "Baixa",
      criadoEm: "2 dias atrás",
      agente: "Carlos Agente",
      ultimaAtualizacao: "Ontem 14:15"
    },
    { 
      id: "#1225", 
      assunto: "Instalação de software", 
      status: "Resolvido", 
      prioridade: "Média",
      criadoEm: "5 dias atrás",
      agente: "Ana Suporte",
      ultimaAtualizacao: "3 dias atrás"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolvido": return "bg-success text-success-foreground";
      case "Em andamento": return "bg-primary text-primary-foreground";
      case "Aguardando aprovação": return "bg-warning text-warning-foreground";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolvido": return <CheckCircle className="h-4 w-4" />;
      case "Em andamento": return <Clock className="h-4 w-4" />;
      case "Aguardando aprovação": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus Tickets</h1>
          <p className="text-muted-foreground mt-1">Olá, {user?.name}! Acompanhe seus chamados</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Abrir Ticket
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{clientStats.ticketsAbertos}</div>
            <p className="text-xs text-muted-foreground">Em atendimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{clientStats.ticketsPendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{clientStats.ticketsResolvidos}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.tempoMedioResolucao}</div>
            <p className="text-xs text-muted-foreground">Para resolução</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tickets por número ou assunto..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              Todos os Status
            </Button>
            <Button variant="outline">
              Todas as Prioridades
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Tickets ({meusTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meusTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{ticket.id}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.prioridade)}>
                          {ticket.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">{ticket.assunto}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Criado: {ticket.criadoEm}</p>
                        <p>Agente: {ticket.agente}</p>
                        <p>Última atualização: {ticket.ultimaAtualizacao}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {ticket.status !== "Resolvido" && (
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações e Ajuda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Como Abrir um Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1. Clique em "Abrir Ticket"</strong> no canto superior direito
              </p>
              <p>
                <strong>2. Descreva o problema</strong> de forma clara e detalhada
              </p>
              <p>
                <strong>3. Selecione a prioridade</strong> adequada ao seu caso
              </p>
              <p>
                <strong>4. Acompanhe o progresso</strong> através desta tela
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📞 Outras Formas de Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Telefone:</strong> (11) 1234-5678
              </p>
              <p>
                <strong>Email:</strong> suporte@empresa.com
              </p>
              <p>
                <strong>Chat:</strong> Disponível das 8h às 18h
              </p>
              <p>
                <strong>Urgência:</strong> Ramal 9999 (24h)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;