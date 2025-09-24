import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusCircle, Trash2, Bot, HelpCircle } from 'lucide-react';

// Mock de dados inicial
const initialShortcuts = [
  {
    id: '1',
    command: '/f',
    description: 'Finaliza o chat e o marca como resolvido.',
    restricted: true,
  },
];

const ChatShortcuts = () => {
  const [shortcuts, setShortcuts] = useState(initialShortcuts);
  const [newShortcut, setNewShortcut] = useState({ command: '', description: '' });

  const handleAddShortcut = () => {
    if (newShortcut.command.trim() !== '' && newShortcut.description.trim() !== '') {
      setShortcuts([
        ...shortcuts,
        {
          id: (shortcuts.length + 1).toString(),
          ...newShortcut,
          restricted: false,
        },
      ]);
      setNewShortcut({ command: '', description: '' });
    }
  };

  const handleDeleteShortcut = (id) => {
    setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
  };

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                Atalhos e Comandos do Chat
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Gerencie os comandos rápidos para agilizar o atendimento no chat.
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Os atalhos permitem que agentes usem comandos como /f para finalizar um chat.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Formulário para Adicionar Novo Atalho */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-4">Adicionar Novo Atalho</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="command">Comando</Label>
                <Input
                  id="command"
                  placeholder="/saudacao"
                  value={newShortcut.command}
                  onChange={(e) => setNewShortcut({ ...newShortcut, command: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Envia uma mensagem de saudação inicial"
                  value={newShortcut.description}
                  onChange={(e) => setNewShortcut({ ...newShortcut, description: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleAddShortcut}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Atalho
            </Button>
          </div>

          {/* Tabela de Atalhos */}
          <div>
            <h4 className="font-medium mb-4">Atalhos Cadastrados</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comando</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortcuts.map((shortcut) => (
                  <TableRow key={shortcut.id}>
                    <TableCell className="font-mono bg-muted/50 px-2 py-1 rounded-sm w-1/4">{shortcut.command}</TableCell>
                    <TableCell>{shortcut.description}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => !shortcut.restricted && handleDeleteShortcut(shortcut.id)}
                              disabled={shortcut.restricted}
                              className={shortcut.restricted ? 'cursor-not-allowed' : ''}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          {shortcut.restricted && (
                            <TooltipContent>
                              <p>Este atalho não pode ser removido.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatShortcuts;
