import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Star,
  Target,
  Download,
  Calendar
} from "lucide-react";

const Analytics = () => {
  // Dados simulados de analytics
  const performanceData = {
    tme: {
      current: 2.3,
      previous: 2.8,
      target: 2.0,
      trend: "improving"
    },
    satisfaction: {
      current: 94.2,
      previous: 91.8,
      target: 90.0,
      trend: "improving"
    },
    resolution: {
      current: 87.5,
      previous: 85.2,
      target: 85.0,
      trend: "improving"
    },
    productivity: {
      ticketsPerDay: 12.4,
      previousMonth: 11.8,
      target: 15.0,
      trend: "improving"
    }
  };

  const agentPerformance = [
    {
      name: "Ana Suporte",
      ticketsResolved: 145,
      avgResponseTime: 1.8,
      satisfactionRate: 96.5,
      efficiency: 92
    },
    {
      name: "Pedro Supervisor", 
      ticketsResolved: 89,
      avgResponseTime: 2.1,
      satisfactionRate: 94.8,
      efficiency: 88
    },
    {
      name: "Carlos Agente",
      ticketsResolved: 123,
      avgResponseTime: 2.5,
      satisfactionRate: 93.2,
      efficiency: 85
    },
    {
      name: "Laura Agente",
      ticketsResolved: 167,
      avgResponseTime: 1.9,
      satisfactionRate: 97.1,
      efficiency: 94
    }
  ];

  const monthlyStats = [
    { month: "Jan", tickets: 234, resolved: 198, satisfaction: 91.2 },
    { month: "Fev", tickets: 267, resolved: 225, satisfaction: 92.5 },
    { month: "Mar", tickets: 298, resolved: 261, satisfaction: 93.1 },
    { month: "Abr", tickets: 312, resolved: 275, satisfaction: 94.2 },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "improving" ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTrendColor = (current: number, target: number) => {
    return current >= target ? "text-success" : "text-warning";
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "bg-success text-success-foreground";
    if (value >= 75) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Performance</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de performance do suporte</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TME - Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{performanceData.tme.current} min</div>
              {getTrendIcon(performanceData.tme.trend)}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Anterior: {performanceData.tme.previous} min</span>
              <span className={getTrendColor(performanceData.tme.current, performanceData.tme.target)}>
                Meta: {performanceData.tme.target} min
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação do Cliente</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{performanceData.satisfaction.current}%</div>
              {getTrendIcon(performanceData.satisfaction.trend)}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Anterior: {performanceData.satisfaction.previous}%</span>
              <span className={getTrendColor(performanceData.satisfaction.current, performanceData.satisfaction.target)}>
                Meta: {performanceData.satisfaction.target}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{performanceData.resolution.current}%</div>
              {getTrendIcon(performanceData.resolution.trend)}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Anterior: {performanceData.resolution.previous}%</span>
              <span className={getTrendColor(performanceData.resolution.current, performanceData.resolution.target)}>
                Meta: {performanceData.resolution.target}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{performanceData.productivity.ticketsPerDay}</div>
              <span className="text-xs text-muted-foreground">tickets/dia</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Anterior: {performanceData.productivity.previousMonth}</span>
              <span className={getTrendColor(performanceData.productivity.ticketsPerDay, performanceData.productivity.target)}>
                Meta: {performanceData.productivity.target}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((month, index) => {
              const resolutionRate = (month.resolved / month.tickets * 100).toFixed(1);
              return (
                <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-6">
                    <div className="text-lg font-medium w-12">{month.month}</div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-sm text-muted-foreground">Tickets</p>
                        <p className="text-lg font-bold">{month.tickets}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Resolvidos</p>
                        <p className="text-lg font-bold text-success">{month.resolved}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Taxa Resolução</p>
                        <p className="text-lg font-bold">{resolutionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfação</p>
                        <p className="text-lg font-bold">{month.satisfaction}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Individual dos Agentes */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {agent.ticketsResolved} tickets resolvidos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">TME</p>
                    <p className="font-medium">{agent.avgResponseTime} min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Satisfação</p>
                    <p className="font-medium">{agent.satisfactionRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Eficiência</p>
                    <Badge className={getPerformanceColor(agent.efficiency)}>
                      {agent.efficiency}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Pontos Positivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">TME em melhoria</p>
                  <p className="text-sm text-muted-foreground">
                    Redução de 18% no tempo médio de resposta
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Alta satisfação</p>
                  <p className="text-sm text-muted-foreground">
                    94.2% de satisfação, acima da meta de 90%
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Equipe performática</p>
                  <p className="text-sm text-muted-foreground">
                    Laura e Ana com excelente performance
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-warning">Oportunidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Meta de produtividade</p>
                  <p className="text-sm text-muted-foreground">
                    Aumentar de 12.4 para 15 tickets/dia
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Balanceamento de carga</p>
                  <p className="text-sm text-muted-foreground">
                    Redistribuir tickets entre agentes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Automação</p>
                  <p className="text-sm text-muted-foreground">
                    Implementar chatbot para casos simples
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
