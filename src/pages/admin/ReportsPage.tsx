
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  Users,
  Clock,
  Star,
  Download,
  Calendar,
  Info
} from "lucide-react";

// CORREÇÃO: Os dados agora refletem um estado sem dados, em vez de valores fictícios.
const kpiData = [
  { title: "Total de Conversas", value: "---", icon: <BarChart />, change: "N/D" },
  { title: "Tempo Médio de Atendimento", value: "---", icon: <Clock />, change: "N/D" },
  { title: "Satisfação do Cliente (CSAT)", value: "---", icon: <Star />, change: "N/D" },
  { title: "Total de Usuários Ativos", value: "---", icon: <Users />, change: "N/D" },
];

const ReportsPage = () => {
  const hasData = false; // Simula a ausência de dados do backend

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Relatórios de Desempenho</h1>
          <p className="mt-2 text-muted-foreground">
            Analise métricas sobre atendimentos, agentes e satisfação do cliente.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" disabled={!hasData}>
                <Calendar className="mr-2 h-4 w-4" /> Selecionar Período
            </Button>
            <Button disabled={!hasData}>
                <Download className="mr-2 h-4 w-4" /> Exportar Relatório
            </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className="text-muted-foreground">{kpi.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {/* CORREÇÃO: Mostra um placeholder em vez de uma comparação falsa */}
              <p className="text-xs text-muted-foreground">Sem dados para comparação</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos - Estado Vazio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volume de Conversas</CardTitle>
            <CardDescription>Conversas iniciadas por dia no último mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md border-2 border-dashed">
                <LineChart className="w-12 h-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-semibold">Nenhum dado de gráfico para exibir</h3>
                <p className="text-sm text-muted-foreground">Os dados aparecerão aqui assim que houver atividade.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Atendimento</CardTitle>
            <CardDescription>Distribuição dos assuntos mais comuns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md border-2 border-dashed">
                <PieChart className="w-12 h-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-semibold">Nenhum dado de gráfico para exibir</h3>
                <p className="text-sm text-muted-foreground">Os dados aparecerão aqui assim que houver atividade.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData && (
        <div className="flex items-center justify-center text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 mr-3 text-blue-600"/>
          <p className="text-sm text-blue-700">
            Os relatórios estão prontos. Os dados começarão a ser exibidos assim que as primeiras conversas forem concluídas.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
