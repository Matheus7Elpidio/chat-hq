'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "./ui/use-toast";
import { Headphones, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

interface RegisterFormProps {
  onToggleMode: () => void;
}

const API_URL = ''; // O proxy do Vite cuida do redirecionamento

const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'client' | 'agent' | 'supervisor' | 'admin' | '' >('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !role) {
      toast({
        title: "Erro de Validação",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // O `data.error` virá do nosso backend
        throw new Error(data.error || 'Falha ao tentar registrar.');
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login com suas novas credenciais.",
      });

      // Muda para o modo de login após o sucesso
      onToggleMode();

    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="hidden bg-muted lg:block">
            <div className="flex flex-col justify-between h-full bg-zinc-900 p-8 text-white">
                <div className="flex items-center gap-3 font-bold text-2xl">
                    <Headphones className="h-8 w-8"/>
                    ChatHQ
                </div>
                <div className='grid gap-2'>
                    <p className='text-lg font-semibold'>"Desde que adotamos o ChatHQ, nossa comunicação interna e o suporte ao cliente atingiram um novo patamar de eficiência."</p>
                    <footer className="text-sm text-zinc-400">Roberto, CEO da InovaTech</footer>
                </div>
            </div>
       </div>
       <div className="flex items-center justify-center py-12">
         <div className="mx-auto grid w-[380px] gap-6">
           <div className="grid gap-2 text-center">
            <Headphones className="h-10 w-10 mx-auto text-primary"/>
             <h1 className="text-3xl font-bold">Criar Conta</h1>
             <p className="text-balance text-muted-foreground">
               Preencha os campos para criar seu acesso
             </p>
           </div>
           <form onSubmit={handleSubmit} className="grid gap-4">
             <div className="grid gap-2">
               <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
             </div>
             <div className="grid gap-2">
               <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
             </div>
             <div className="grid gap-2">
                <Label htmlFor="role">Função</Label>
                <Select value={role} onValueChange={(value) => setRole(value as any)} >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua função no sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="agent">Agente de Suporte</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             <div className="grid gap-2">
               <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Criando conta..." : "Criar Conta"}
             </Button>
           </form>
           <div className="mt-4 text-center text-sm">
             Já possui uma conta?{" "}
             <button onClick={onToggleMode} className="underline">
               Fazer Login
             </button>
           </div>
         </div>
       </div>
     </div>
  );
};

export default RegisterForm;
