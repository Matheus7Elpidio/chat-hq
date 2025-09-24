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

// Define a estrutura de dados do Atalho
export interface Shortcut {
  id: string;
  name: string; // O gatilho do atalho, ex: "/saudacao"
  content: string; // O texto que será inserido
  sector: string; // O setor ao qual o atalho pertence
}

// Props para as colunas
interface ShortcutColumnsProps {
    updateShortcut: (id: string, updatedFields: Partial<Shortcut>) => void;
    deleteShortcut: (id: string) => void;
}

// Define as colunas da tabela
export const columns = ({ updateShortcut, deleteShortcut }: ShortcutColumnsProps): ColumnDef<Shortcut>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Atalho
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-mono p-1 bg-muted rounded-md text-sm">{row.getValue("name")}</div>
  },
  {
    accessorKey: "content",
    header: "Conteúdo",
    cell: ({ row }) => <p className="truncate max-w-xs">{row.getValue("content")}</p>
  },
  {
    accessorKey: "sector",
    header: "Setor",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("sector")}</Badge>
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const shortcut = row.original;
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
                    const newName = prompt("Novo nome do atalho:", shortcut.name);
                    const newContent = prompt("Novo conteúdo:", shortcut.content);
                    const newSector = prompt("Novo setor:", shortcut.sector);
                    if (newName && newContent && newSector) {
                        updateShortcut(shortcut.id, { name: newName, content: newContent, sector: newSector });
                    }
                }}>Editar Atalho</DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir este atalho?")) {
                            deleteShortcut(shortcut.id);
                        }
                    }}
                    className="text-destructive"
                >Excluir Atalho</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
