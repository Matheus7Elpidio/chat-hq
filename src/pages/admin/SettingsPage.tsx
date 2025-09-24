
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import { BrainCircuit, KeyRound, Terminal, Save, Bot, Mail, Loader2, Server as SmtpServerIcon, Send, Clock } from "lucide-react";

// --- SIMULAÇÃO DE USUÁRIO ---
// Em uma aplicação real, isso viria de um contexto de autenticação.
// Mude 'role' para "supervisor" para ver a visão limitada.
const fakeUser = {
  name: "Usuário Admin",
  role: "admin" // ou "supervisor"
};
// -----------------------------


const fetchSettings = async () => {
  const response = await fetch('/api/settings');
  if (!response.ok) throw new Error('A rede não respondeu corretamente');
  return response.json();
};

const saveSettings = async (settings: any) => {
  const response = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Falha ao salvar configurações');
  return data;
};

const testEmail = async () => {
    const response = await fetch('/api/test-email', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Falha ao enviar e-mail de teste.');
    }
    return data;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados dos campos
  const [aiProvider, setAiProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [n8nWebhook, setN8nWebhook] = useState("");
  const [glpiWebhook, setGlpiWebhook] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [notifCsat, setNotifCsat] = useState(false);
  const [notifUrgent, setNotifUrgent] = useState(false);
  const [notifWaitTime, setNotifWaitTime] = useState(false);
  const [waitTimeThreshold, setWaitTimeThreshold] = useState(5); // <-- NOVO ESTADO

  const { data: savedSettings, isLoading } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: fetchSettings,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (savedSettings) {
      setAiProvider(savedSettings.aiProvider || "");
      setApiKey(savedSettings.apiKey || "");
      setSystemPrompt(savedSettings.systemPrompt || "");
      setN8nWebhook(savedSettings.n8nWebhook || "");
      setGlpiWebhook(savedSettings.glpiWebhook || "");
      setSmtpHost(savedSettings.smtp?.host || "");
      setSmtpPort(savedSettings.smtp?.port || 587);
      setSmtpUser(savedSettings.smtp?.user || "");
      setSmtpPass(savedSettings.smtp?.pass || "");
      setSupervisorEmail(savedSettings.smtp?.supervisorEmail || "");
      setNotifCsat(savedSettings.notifications?.onNegativeCstat || false);
      setNotifUrgent(savedSettings.notifications?.onUrgentChat || false);
      setNotifWaitTime(savedSettings.notifications?.onWaitTimeExceeded || false);
      setWaitTimeThreshold(savedSettings.notifications?.waitTimeThreshold || 5); // <-- CARREGA NOVO CAMPO
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({ title: "Configurações Salvas!", description: "Suas alterações foram persistidas no servidor." });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Salvar!", description: error.message, variant: "destructive" });
    }
  });

  const testEmailMutation = useMutation({
    mutationFn: testEmail,
    onSuccess: () => {
        toast({ title: "Sucesso!", description: "E-mail de teste enviado para o supervisor." });
    },
    onError: (error: Error) => {
        toast({ title: "Erro no Teste de E-mail!", description: error.message, variant: "destructive" });
    }
  });

  const handleSave = () => {
    // Começa com as configurações existentes para não sobreescrever dados de admin
    const newSettings = { ...savedSettings };

    // Atualiza as configurações de notificação (ambas as funções podem fazer)
    newSettings.notifications = {
      ...newSettings.notifications,
      onNegativeCstat: notifCsat,
      onUrgentChat: notifUrgent,
      onWaitTimeExceeded: notifWaitTime,
      waitTimeThreshold: Number(waitTimeThreshold), // <-- SALVA NOVO CAMPO
    };

    // Se for admin, atualiza também os campos de administrador
    if (fakeUser.role === 'admin') {
      newSettings.aiProvider = aiProvider;
      newSettings.apiKey = apiKey;
      newSettings.systemPrompt = systemPrompt;
      newSettings.n8nWebhook = n8nWebhook;
      newSettings.glpiWebhook = glpiWebhook;
      newSettings.smtp = {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        pass: smtpPass,
        supervisorEmail: supervisorEmail,
      };
    }
    
    saveMutation.mutate(newSettings);
  };
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  return (
    <div className="p-6 space-y-6">
       <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="mt-2 text-muted-foreground">
            {fakeUser.role === 'admin' 
                ? "Visão do Administrador: Ajuste as configurações gerais, integrações e I.A."
                : "Visão do Supervisor: Ajuste os parâmetros de notificação."
            }
          </p>
        </div>

      {/* Cartões visíveis apenas para Administradores */}
      {fakeUser.role === 'admin' && (
        <>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit />Configurações de I.A.</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="ai-provider">Provedor de I.A.</Label>
                    <Select value={aiProvider} onValueChange={setAiProvider}>
                        <SelectTrigger id="ai-provider"><SelectValue placeholder="Selecione um provedor" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="api-key" className="flex items-center gap-2"><KeyRound size={16}/> Chave da API</Label>
                    <Input id="api-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Cole sua chave de API aqui" />
                </div>
                <div>
                    <Label htmlFor="system-prompt" className="flex items-center gap-2"><Bot size={16}/> Prompt do Sistema</Label>
                    <Textarea id="system-prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Instruções para o assistente de I.A...." rows={4}/>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><SmtpServerIcon />Configuração de E-mail (SMTP)</CardTitle>
                <CardDescription>Para o envio de e-mails de notificação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="smtp-host">Servidor SMTP</Label><Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.example.com" /></div>
                    <div><Label htmlFor="smtp-port">Porta</Label><Input id="smtp-port" type="number" value={smtpPort} onChange={(e) => setSmtpPort(Number(e.target.value))} placeholder="587" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="smtp-user">Usuário/E-mail</Label><Input id="smtp-user" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="seu-email@example.com" /></div>
                    <div><Label htmlFor="smtp-pass">Senha</Label><Input id="smtp-pass" type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="Sua senha ou senha de app" /></div>
                </div>
                <div>
                    <Label htmlFor="supervisor-email">E-mail do Supervisor</Label>
                    <Input id="supervisor-email" value={supervisorEmail} onChange={(e) => setSupervisorEmail(e.target.value)} placeholder="supervisor@sua-empresa.com" />
                    <p className="text-sm text-muted-foreground mt-1">Os alertas serão enviados para este endereço.</p>
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={() => testEmailMutation.mutate()} disabled={testEmailMutation.isPending} variant="outline">
                        {testEmailMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                        Testar Conexão
                    </Button>
                </div>
                </CardContent>
            </Card>
        </>
      )}

      {/* Cartão de Notificações - Visível para todos */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail />Configurações de Notificação</CardTitle>
            <CardDescription>Defina quais eventos devem gerar alertas por e-mail.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div><Label htmlFor="notif-csat">Avaliação Negativa</Label><p className="text-sm text-muted-foreground">Alertar quando um cliente der uma nota de satisfação baixa.</p></div>
                <Switch id="notif-csat" checked={notifCsat} onCheckedChange={setNotifCsat} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div><Label htmlFor="notif-urgent">Conversa Urgente</Label><p className="text-sm text-muted-foreground">Alertar quando um agente marcar uma conversa como "Urgente".</p></div>
                <Switch id="notif-urgent" checked={notifUrgent} onCheckedChange={setNotifUrgent} />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div><Label htmlFor="notif-wait-time">Tempo de Espera Excedido</Label><p className="text-sm text-muted-foreground">Alertar se um cliente exceder o tempo definido na fila de espera.</p></div>
                <Switch id="notif-wait-time" checked={notifWaitTime} onCheckedChange={setNotifWaitTime} />
            </div>
            {/* NOVO CAMPO DE INPUT */}
            <div className="rounded-lg border p-4">
                <Label htmlFor="wait-time-threshold" className="flex items-center gap-2"><Clock />Tempo Máximo de Espera (minutos)</Label>
                <Input 
                    id="wait-time-threshold" 
                    type="number" 
                    value={waitTimeThreshold} 
                    onChange={(e) => setWaitTimeThreshold(Number(e.target.value))} 
                    placeholder="5" 
                    className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Defina o tempo em minutos para disparar o alerta de tempo de espera.
                </p>
            </div>
        </CardContent>
      </Card>

      {/* Cartão de Webhooks - Visível apenas para Administradores */}
      {fakeUser.role === 'admin' && (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Terminal />Automação e Webhooks</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><Label htmlFor="n8n-webhook">Webhook do n8n</Label><Input id="n8n-webhook" value={n8nWebhook} onChange={(e) => setN8nWebhook(e.target.value)} placeholder="https://seu-n8n.exemplo.com/webhook/123..." /></div>
                <div><Label htmlFor="glpi-webhook">Webhook do GLPI</Label><Input id="glpi-webhook" value={glpiWebhook} onChange={(e) => setGlpiWebhook(e.target.value)} placeholder="https://seu-glpi.exemplo.com/plugins/webservices/..." /></div>
            </CardContent>
        </Card>
      )}

      {/* Botão Salvar - Visível para todos */}
      <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Alterações
          </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
