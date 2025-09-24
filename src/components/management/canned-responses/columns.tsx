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

// Define a estrutura de dados da Resposta Padrão
export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt?: string;
}

// Props para as colunas
interface CannedResponseColumnsProps {
    updateResponse: (id: string, updatedFields: Partial<CannedResponse>) => void;
    deleteResponse: (id: string) => void;
}

// Define as colunas da tabela
export const columns = ({ updateResponse, deleteResponse }: CannedResponseColumnsProps): ColumnDef<CannedResponse>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Título
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "content",
    header: "Conteúdo",
    cell: ({ row }) => <p className="truncate max-w-xs">{row.getValue("content")}</p>
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("category")}</Badge>
  },
    {
        accessorKey: "author",
        header: "Autor",
    },
  {
    id: "actions",
    cell: ({ row }) => {
        const response = row.original;
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
                        const newTitle = prompt("Novo título:", response.title);
                        const newContent = prompt("Novo conteúdo:", response.content);
                        const newCategory = prompt("Nova categoria:", response.category);
                        if (newTitle && newContent && newCategory) {
                            updateResponse(response.id, { title: newTitle, content: newContent, category: newCategory });
                        }
                    }}>Editar Resposta</DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => {
                            if (window.confirm("Tem certeza que deseja excluir esta resposta?")) {
                                deleteResponse(response.id);
                            }
                        }}
                        className="text-destructive"
                    >Excluir Resposta</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    },
  },
];
