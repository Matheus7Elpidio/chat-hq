import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:3001";

// Interface para as métricas do agente
interface AgentMetrics {
  totalChats: number;
  todayChats: number;
  averageRating: string; // "N/D" ou um número
}

// Função para buscar as métricas do agente
const fetchAgentMetrics = async (agentId: number): Promise<AgentMetrics> => {
  const response = await fetch(`${API_URL}/api/agent/metrics/${agentId}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar as métricas do agente.');
  }
  return response.json();
};

const AgentDashboard = () => {
  const { user } = useAuth();

  const { data: metrics, isLoading, isError } = useQuery<AgentMetrics>({
    queryKey: ['agentMetrics', user?.id],
    queryFn: () => fetchAgentMetrics(user!.id),
    enabled: !!user, // Só executa a query se o usuário existir
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const kpiCards = [
    {
      title: "Atendimentos Hoje",
      value: metrics?.todayChats,
      icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />,
      description: "Conversas que você participou hoje."
    },
    {
      title: "Total de Atendimentos",
      value: metrics?.totalChats,
      icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
      description: "Seu número total de conversas."
    },
    {
      title: "Satisfação Média",
      value: metrics?.averageRating,
      icon: <Star className="h-5 w-5 text-muted-foreground" />,
      description: "Métrica de avaliação do cliente."
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Meu Desempenho</h1>
        <p className="text-muted-foreground">Olá, {user?.name}! Aqui estão suas métricas atualizadas.</p>
      </div>

      {/* Métricas Pessoais Dinâmicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isError ? "Erro" : card.value)}
              </div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* TODO: Implementar lista de atendimentos recentes com dados da API */}
      {/* A seção de "Atendimentos Recentes" foi removida temporariamente 
          porque seus dados eram estáticos. Ela será reimplementada quando 
          o endpoint correspondente estiver disponível. */}

    </div>
  );
};

export default AgentDashboard;
