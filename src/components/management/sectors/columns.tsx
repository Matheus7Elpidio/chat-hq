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

// Define a estrutura de dados do Setor
export interface Sector {
  id: string;
  name: string;
  description: string;
  agentCount: number;
}

// Define as colunas da tabela
export const columns = ({ 
    updateSector, 
    deleteSector 
}: { 
    updateSector: (id: string, name: string) => void; 
    deleteSector: (id: string) => void; 
}): ColumnDef<Sector>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Setor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "agentCount",
    header: () => <div className="text-right">Agentes</div>,
    cell: ({ row }) => {
      const amount = row.getValue("agentCount");
      return <div className="text-right font-medium">{amount as number}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sector = row.original;
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
                    const newName = prompt("Novo nome do setor:", sector.name);
                    if (newName) {
                        updateSector(sector.id, newName);
                    }
                }}>Editar Setor</DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir este setor?")) {
                            deleteSector(sector.id);
                        }
                    }}
                    className="text-destructive"
                >Excluir Setor</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
