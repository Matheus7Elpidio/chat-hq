import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { History, Users, BarChart2, Eye, ArrowRight, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:3001";

interface AdminMetrics {
  activeConversations: number;
  onlineAgents: number;
}

const fetchAdminMetrics = async (): Promise<AdminMetrics> => {
  const response = await fetch(`${API_URL}/api/admin/metrics`);
  if (!response.ok) {
    throw new Error('Falha ao buscar métricas do admin');
  }
  return response.json();
};

export function SupervisorDashboard() {
  const { user } = useAuth();
  const { data: metrics, isLoading, isError } = useQuery<AdminMetrics>({
    queryKey: ['adminMetrics'],
    queryFn: fetchAdminMetrics,
    refetchInterval: 10000, // Atualiza a cada 10 segundos
  });

  const kpiData = [
    {
      title: "Conversas Ativas",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isError ? "Erro" : metrics?.activeConversations ?? 0),
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Conversas ocorrendo em tempo real."
    },
    {
      title: "Agentes Online",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isError ? "Erro" : metrics?.onlineAgents ?? 0),
      icon: <Eye className="h-6 w-6 text-primary" />,
      description: "Agentes, supervisores e admins online."
    },
    {
      title: "Resolução Média",
      value: "N/D",
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
      description: "Métrica de eficiência do time."
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard do Supervisor</h1>
        <p className="text-muted-foreground">Bem-vindo(a) de volta, {user?.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:border-primary/80 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><History/> Auditoria de Histórico</CardTitle>
            <CardDescription>Revise, filtre e exporte o histórico completo das conversas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/chat-history">
                <Button className="w-full">Acessar Auditoria <ArrowRight className='ml-2 h-4 w-4'/></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/80 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Eye/> Monitoramento em Tempo Real</CardTitle>
            <CardDescription>Acompanhe conversas e envie orientações aos agentes ao vivo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/monitor">
                 <Button className="w-full">Acessar Monitoramento <ArrowRight className='ml-2 h-4 w-4'/></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
