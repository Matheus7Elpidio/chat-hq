import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSector } from "./UserSectorManagement";

// Função auxiliar para cores do status
const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
};


// Define as colunas da tabela
export const columns = ({ 
    updateUser, 
    deleteUser, 
    openManageSectorsModal 
}: { 
    updateUser: (id: string, updatedFields: Partial<UserSector>) => void; 
    deleteUser: (id: string) => void; 
    openManageSectorsModal: (user: UserSector) => void; 
}): ColumnDef<UserSector>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <div className="font-medium">{row.getValue("name")}</div>
                <div className="text-sm text-muted-foreground">{row.original.email}</div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
  },
  {
    accessorKey: "sectors",
    header: "Setores Vinculados",
    cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
            {row.original.sectors.map(sector => (
                <Badge key={sector} variant="secondary">{sector}</Badge>
            ))}
        </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getStatusColor(row.getValue("status"))}`} />
            <span className="capitalize">{row.getValue("status")}</span>
        </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {
                    const newName = prompt("Novo nome do usuário:", user.name);
                    if (newName) {
                        updateUser(user.id, { name: newName });
                    }
                }}>Editar Usuário</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openManageSectorsModal(user)}>Vincular a Setores</DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
                            deleteUser(user.id);
                        }
                    }}
                    className="text-destructive"
                >Excluir Usuário</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
