'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./ui/use-toast";
import { Headphones, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onToggleMode: () => void;
}

const API_URL = ''; // O proxy do Vite cuida do redirecionamento

const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState("admin@chathq.com"); // Padrão para facilitar testes
  const [password, setPassword] = useState("123456");       // Padrão para facilitar testes
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha o e-mail e a senha.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }
      
      // Se a resposta for bem-sucedida, o backend enviará o token e os dados do usuário
      login(data.token, data.user);

      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a) de volta, ${data.user.name}!`,
      });

    } catch (error: any) {
      toast({
        title: "Erro no Login",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
       <div className="flex items-center justify-center py-12">
         <div className="mx-auto grid w-[350px] gap-6">
           <div className="grid gap-2 text-center">
            <Headphones className="h-10 w-10 mx-auto text-primary"/>
             <h1 className="text-3xl font-bold">Login</h1>
             <p className="text-balance text-muted-foreground">
               Entre com seu e-mail para acessar o painel
             </p>
           </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
               <div className="flex items-center">
                 <Label htmlFor="password">Senha</Label>
               </div>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
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
              {isLoading ? "Entrando..." : "Entrar"}
             </Button>
           </form>
           <div className="mt-4 text-center text-sm">
             Não possui uma conta?{" "}
             <button onClick={onToggleMode} className="underline">
               Cadastre-se
             </button>
           </div>
         </div>
       </div>
       <div className="hidden bg-muted lg:block">
        <div className="flex flex-col justify-between h-full bg-zinc-900 p-8 text-white">
            <div className="flex items-center gap-3 font-bold text-2xl">
                <Headphones className="h-8 w-8"/>
                ChatHQ
            </div>
            <div className='grid gap-2'>
                <p className='text-lg font-semibold'>"A nova plataforma de chat revolucionou nosso atendimento. É intuitiva, rápida e melhorou drasticamente a satisfação dos nossos clientes."</p>
                <footer className="text-sm text-zinc-400">Sofia, Gerente de Suporte</footer>
            </div>
        </div>
       </div>
     </div>
  );
};

export default LoginForm;
