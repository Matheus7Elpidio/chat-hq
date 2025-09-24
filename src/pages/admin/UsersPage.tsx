
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { MoreHorizontal, UserPlus, Trash2, Edit, Users } from "lucide-react";

// CORREÇÃO: A função agora retorna um array vazio para simular a ausência de dados reais.
const fetchUsers = async () => {
  // Em um ambiente real, isso seria: `const response = await fetch('/api/users'); ...`
  return []; 
};

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Supervisor" | "Agente";
  status: "Ativo" | "Inativo";
};

const getRoleBadgeVariant = (role: User["role"]) => {
  switch (role) {
    case "Admin":
      return "destructive";
    case "Supervisor":
      return "secondary";
    case "Agente":
    default:
      return "outline";
  }
};

const getStatusBadgeVariant = (status: User["status"]) => {
  return status === "Ativo" ? "default" : "secondary";
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const hasUsers = !isLoading && users && users.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <p className="mt-2 text-muted-foreground">Adicione, edite e remova usuários da plataforma.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Total de {users?.length || 0} usuários no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell>
                </TableRow>
              ) : hasUsers ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // CORREÇÃO: Estado vazio quando não há usuários
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-16 h-16 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">Nenhum usuário encontrado</h3>
                      <p className="text-muted-foreground">Comece a construir sua equipe.</p>
                      <Button className="mt-2">
                        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Primeiro Usuário
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
