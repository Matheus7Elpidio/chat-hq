
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
import { useToast } from "../../components/ui/use-toast";
import { User, Mail, KeyRound, Save, Loader2 } from "lucide-react";

const AgentSettingsPage = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name.split(' ')[0] || '');
  const [surname, setSurname] = useState(user?.name.split(' ').slice(1).join(' ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: `${name} ${surname}` })
      });

      if (!response.ok) throw new Error('Falha ao atualizar o perfil.');

      toast({ title: "Sucesso!", description: "Seu perfil foi atualizado." });

    } catch (error: any) {
      toast({ title: "Erro!", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsSendingEmail(true);
    try {
      const response = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email })
      });

      if (!response.ok) throw new Error('Falha ao enviar e-mail de redefinição de senha.');

      toast({ title: "E-mail Enviado!", description: "Verifique sua caixa de entrada para redefinir sua senha." });

    } catch (error: any) {
      toast({ title: "Erro!", description: error.message, variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Minha Conta</h1>
        <p className="mt-2 text-muted-foreground">Gerencie suas informações pessoais.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User />Informações do Perfil</CardTitle>
          <CardDescription>Atualize seu nome e sobrenome.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="name">Nome</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label htmlFor="surname">Sobrenome</Label><Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} /></div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound />Segurança</CardTitle>
          <CardDescription>Altere sua senha através de um link seguro enviado para seu e-mail.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p className="text-sm text-muted-foreground">Clique no botão abaixo para receber um e-mail com as instruções para criar uma nova senha. Por segurança, você será desconectado da sua conta atual.</p>
          <Button onClick={handlePasswordReset} variant="outline" disabled={isSendingEmail}>
            {isSendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Enviar E-mail de Redefinição de Senha
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default AgentSettingsPage;
