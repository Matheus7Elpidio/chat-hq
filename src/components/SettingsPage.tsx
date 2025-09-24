import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Database, 
  Bot, 
  Zap, 
  Check, 
  X, 
  AlertCircle,
  TestTube,
  Key,
  Globe,
  Shield,
  Wifi,
  Server
} from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estados para configurações GLPI
  const [glpiSettings, setGlpiSettings] = useState({
    enabled: false,
    url: "",
    apiToken: "",
    userToken: "",
    syncInterval: "15",
    syncUsers: true,
    syncTickets: true,
    syncCategories: true
  });

  // Estados para configurações n8n
  const [n8nSettings, setN8nSettings] = useState({
    enabled: false,
    webhookUrl: "",
    apiKey: "",
    agentName: "Assistente IT",
    autoResponse: true,
    escalationRules: true,
    workingHours: "08:00-18:00",
    languages: ["pt-BR", "en-US"]
  });

  // Estado de conexão
  const [connectionStatus, setConnectionStatus] = useState({
    glpi: "disconnected", // disconnected, connecting, connected, error
    n8n: "disconnected"
  });

  const handleGlpiTest = async () => {
    if (!glpiSettings.url || !glpiSettings.apiToken) {
      toast({
        title: "Erro",
        description: "Preencha a URL e Token da API do GLPI",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus(prev => ({ ...prev, glpi: "connecting" }));
    
    // Simular teste de conexão
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance de sucesso
      setConnectionStatus(prev => ({ 
        ...prev, 
        glpi: success ? "connected" : "error" 
      }));
      
      toast({
        title: success ? "Conexão GLPI" : "Erro na Conexão",
        description: success 
          ? "Conectado com sucesso ao GLPI!" 
          : "Falha ao conectar. Verifique as configurações.",
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const handleN8nTest = async () => {
    if (!n8nSettings.webhookUrl) {
      toast({
        title: "Erro", 
        description: "Preencha a URL do Webhook n8n",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus(prev => ({ ...prev, n8n: "connecting" }));
    
    // Simular teste de conexão
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConnectionStatus(prev => ({ 
        ...prev, 
        n8n: success ? "connected" : "error" 
      }));
      
      toast({
        title: success ? "Conexão n8n" : "Erro na Conexão",
        description: success 
          ? "Agent n8n conectado com sucesso!" 
          : "Falha ao conectar. Verifique o webhook.",
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <Check className="h-4 w-4 text-success" />;
      case "connecting": return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      case "error": return <X className="h-4 w-4 text-destructive" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected": return <Badge className="bg-success text-success-foreground">Conectado</Badge>;
      case "connecting": return <Badge className="bg-primary text-primary-foreground">Conectando...</Badge>;
      case "error": return <Badge className="bg-destructive text-destructive-foreground">Erro</Badge>;
      default: return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  if (!user || (user.role !== "Admin" && user.role !== "Supervisor")) {
    return (
      <div className="p-6 bg-dashboard-bg min-h-screen">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar as configurações do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-dashboard-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-1">Gerencie integrações e configurações avançadas</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Status das Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status GLPI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus.glpi)}
                <span className="font-medium">Integração GLPI</span>
              </div>
              {getStatusBadge(connectionStatus.glpi)}
            </div>
            {connectionStatus.glpi === "connected" && (
              <div className="mt-3 text-sm text-muted-foreground">
                <p>✅ Sincronização de usuários ativa</p>
                <p>✅ Sincronização de tickets ativa</p>
                <p>✅ Última sincronização: há 5 minutos</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Status n8n Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus.n8n)}
                <span className="font-medium">Agent n8n</span>
              </div>
              {getStatusBadge(connectionStatus.n8n)}
            </div>
            {connectionStatus.n8n === "connected" && (
              <div className="mt-3 text-sm text-muted-foreground">
                <p>🤖 Agent respondendo automaticamente</p>
                <p>⚡ Regras de escalação ativas</p>
                <p>📊 Última resposta: há 2 minutos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configurações GLPI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Integração GLPI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle Principal */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Habilitar Integração GLPI</Label>
              <p className="text-sm text-muted-foreground">
                Conecte com o GLPI para sincronizar usuários, tickets e dados
              </p>
            </div>
            <Switch 
              checked={glpiSettings.enabled}
              onCheckedChange={(checked) => 
                setGlpiSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {glpiSettings.enabled && (
            <>
              <Separator />
              
              {/* Configurações de Conexão */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Configurações de Conexão
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="glpi-url">URL do GLPI</Label>
                    <Input
                      id="glpi-url"
                      placeholder="https://glpi.empresa.com/apirest.php"
                      value={glpiSettings.url}
                      onChange={(e) => setGlpiSettings(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="glpi-interval">Intervalo de Sync (min)</Label>
                    <Input
                      id="glpi-interval"
                      type="number"
                      placeholder="15"
                      value={glpiSettings.syncInterval}
                      onChange={(e) => setGlpiSettings(prev => ({ ...prev, syncInterval: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="glpi-api-token">API Token</Label>
                    <Input
                      id="glpi-api-token"
                      type="password"
                      placeholder="Digite o App Token do GLPI"
                      value={glpiSettings.apiToken}
                      onChange={(e) => setGlpiSettings(prev => ({ ...prev, apiToken: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="glpi-user-token">User Token</Label>
                    <Input
                      id="glpi-user-token"
                      type="password"
                      placeholder="Digite o User Token"
                      value={glpiSettings.userToken}
                      onChange={(e) => setGlpiSettings(prev => ({ ...prev, userToken: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Opções de Sincronização */}
              <div className="space-y-4">
                <h4 className="font-medium">Opções de Sincronização</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Sincronizar Usuários</Label>
                    <Switch 
                      checked={glpiSettings.syncUsers}
                      onCheckedChange={(checked) => 
                        setGlpiSettings(prev => ({ ...prev, syncUsers: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Sincronizar Tickets</Label>
                    <Switch 
                      checked={glpiSettings.syncTickets}
                      onCheckedChange={(checked) => 
                        setGlpiSettings(prev => ({ ...prev, syncTickets: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Sincronizar Categorias</Label>
                    <Switch 
                      checked={glpiSettings.syncCategories}
                      onCheckedChange={(checked) => 
                        setGlpiSettings(prev => ({ ...prev, syncCategories: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Botão de Teste */}
              <div className="flex items-center gap-4">
                <Button onClick={handleGlpiTest} disabled={connectionStatus.glpi === "connecting"}>
                  <TestTube className="w-4 h-4 mr-2" />
                  {connectionStatus.glpi === "connecting" ? "Testando..." : "Testar Conexão"}
                </Button>
                
                {connectionStatus.glpi !== "disconnected" && (
                  <Button variant="outline">
                    <Wifi className="w-4 h-4 mr-2" />
                    Sincronizar Agora
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configurações n8n */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Agent n8n
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle Principal */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Habilitar Agent n8n</Label>
              <p className="text-sm text-muted-foreground">
                Configure um agente automatizado para responder tickets e escalar casos complexos
              </p>
            </div>
            <Switch 
              checked={n8nSettings.enabled}
              onCheckedChange={(checked) => 
                setN8nSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {n8nSettings.enabled && (
            <>
              <Separator />
              
              {/* Configurações de Webhook */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Configurações do Agent
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="n8n-webhook">URL do Webhook n8n</Label>
                    <Input
                      id="n8n-webhook"
                      placeholder="https://n8n.empresa.com/webhook/chat"
                      value={n8nSettings.webhookUrl}
                      onChange={(e) => setN8nSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n8n-apikey">API Key (Opcional)</Label>
                    <Input
                      id="n8n-apikey"
                      type="password"
                      placeholder="Chave de autenticação"
                      value={n8nSettings.apiKey}
                      onChange={(e) => setN8nSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Nome do Agent</Label>
                    <Input
                      id="agent-name"
                      placeholder="Assistente IT"
                      value={n8nSettings.agentName}
                      onChange={(e) => setN8nSettings(prev => ({ ...prev, agentName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="working-hours">Horário de Funcionamento</Label>
                    <Input
                      id="working-hours"
                      placeholder="08:00-18:00"
                      value={n8nSettings.workingHours}
                      onChange={(e) => setN8nSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Comportamento do Agent */}
              <div className="space-y-4">
                <h4 className="font-medium">Comportamento do Agent</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Resposta Automática</Label>
                      <p className="text-xs text-muted-foreground">
                        Agent responde automaticamente perguntas simples
                      </p>
                    </div>
                    <Switch 
                      checked={n8nSettings.autoResponse}
                      onCheckedChange={(checked) => 
                        setN8nSettings(prev => ({ ...prev, autoResponse: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Regras de Escalação</Label>
                      <p className="text-xs text-muted-foreground">
                        Escalar automaticamente casos complexos para humanos
                      </p>
                    </div>
                    <Switch 
                      checked={n8nSettings.escalationRules}
                      onCheckedChange={(checked) => 
                        setN8nSettings(prev => ({ ...prev, escalationRules: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Prompt do Agent */}
              <div className="space-y-2">
                <Label htmlFor="agent-prompt">Instruções do Agent</Label>
                <Textarea
                  id="agent-prompt"
                  placeholder="Você é um assistente de TI especializado em resolver problemas técnicos. Seja prestativo, claro e escalate casos complexos..."
                  rows={4}
                />
              </div>

              {/* Botão de Teste */}
              <div className="flex items-center gap-4">
                <Button onClick={handleN8nTest} disabled={connectionStatus.n8n === "connecting"}>
                  <TestTube className="w-4 h-4 mr-2" />
                  {connectionStatus.n8n === "connecting" ? "Testando..." : "Testar Agent"}
                </Button>
                
                {connectionStatus.n8n === "connected" && (
                  <Button variant="outline">
                    <Bot className="w-4 h-4 mr-2" />
                    Treinar Agent
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configurações Gerais do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Sistema</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Notificações por Email</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log de Auditoria</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Backup Automático</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Interface</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Modo Escuro</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notificações Desktop</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Som de Notificação</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;