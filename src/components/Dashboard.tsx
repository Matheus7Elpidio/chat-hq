import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, BarChart, Loader2 } from "lucide-react";

const API_URL = "http://localhost:3001";

interface AdminMetrics {
  activeConversations: number;
  onlineAgents: number;
}

const fetchAdminMetrics = async (): Promise<AdminMetrics> => {
  const response = await fetch(`${API_URL}/api/admin/metrics`);
  if (!response.ok) {
    // Isso será capturado pelo react-query e definirá `isError` como true
    throw new Error('Falha ao buscar as métricas do painel de administração.');
  }
  return response.json();
};

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery<AdminMetrics>({ 
    queryKey: ['adminMetrics'], 
    queryFn: fetchAdminMetrics,
    refetchInterval: 15000,
  });

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Atendimento</h1>
          <p className="text-muted-foreground mt-1">Visão geral das operações em tempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Conversas Ativas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isError ? 0 : data?.activeConversations ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Conversas ocorrendo em tempo real.</p>
          </CardContent>
        </Card>

        {/* Card Agentes Online */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes Online</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isError ? 0 : data?.onlineAgents ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Agentes, supervisores e admins online.</p>
          </CardContent>
        </Card>

        {/* Card Resolução Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolução Média</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">N/D</div>
            <p className="text-xs text-muted-foreground">Métrica de eficiência do time.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
