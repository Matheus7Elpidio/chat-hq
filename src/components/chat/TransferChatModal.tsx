import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, User, ArrowRight } from 'lucide-react';

const API_URL = "http://localhost:3001";

// Tipagem para os dados de transferência
interface TransferOptions {
  sectors: { id: number; name: string }[];
  agents: { id: number; name: string; sectorName: string }[];
}

// Função para buscar as opções de transferência da API
const fetchTransferOptions = async (): Promise<TransferOptions> => {
  const res = await fetch(`${API_URL}/api/transfer-options`);
  if (!res.ok) throw new Error('Falha ao buscar opções de transferência');
  return res.json();
};

interface TransferChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (targetId: number, targetType: 'agent' | 'sector', targetName: string) => void;
}

export const TransferChatModal = ({ isOpen, onClose, onTransfer }: TransferChatModalProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('agent');

  const { data, isLoading, isError } = useQuery<TransferOptions>({ 
    queryKey: ['transferOptions'], 
    queryFn: fetchTransferOptions, 
    enabled: isOpen, // Só busca os dados quando o modal está aberto
  });

  const handleTransfer = () => {
    if (activeTab === 'agent' && selectedAgent) {
      const agent = data?.agents.find(a => a.id.toString() === selectedAgent);
      if (agent) onTransfer(agent.id, 'agent', agent.name);
    } else if (activeTab === 'sector' && selectedSector) {
      const sector = data?.sectors.find(s => s.id.toString() === selectedSector);
      if (sector) onTransfer(sector.id, 'sector', sector.name);
    }
    onClose();
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (isError) return <div className="text-center text-red-500">Falha ao carregar dados. Tente novamente.</div>;
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agent"><User className="w-4 h-4 mr-2"/>Agente</TabsTrigger>
          <TabsTrigger value="sector"><Users className="w-4 h-4 mr-2"/>Setor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agent" className="py-4">
            <Select onValueChange={setSelectedAgent} value={selectedAgent || undefined}>
              <SelectTrigger>
                  <SelectValue placeholder="Selecione um agente online" />
              </SelectTrigger>
              <SelectContent>
                  {data?.agents && data.agents.length > 0 ? (
                      data.agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id.toString()}>
                              {agent.name} <span className="text-xs text-muted-foreground ml-2">({agent.sectorName})</span>
                          </SelectItem>
                      ))
                  ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">Nenhum agente online.</div>
                  )}
              </SelectContent>
            </Select>
        </TabsContent>

        <TabsContent value="sector" className="py-4">
            <Select onValueChange={setSelectedSector} value={selectedSector || undefined}>
                 <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                    {data?.sectors?.map(sector => (
                        <SelectItem key={sector.id} value={sector.id.toString()}>{sector.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Atendimento</DialogTitle>
          <DialogDescription>
            Escolha um agente específico ou um setor para transferir esta conversa.
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleTransfer} disabled={(!selectedAgent && !selectedSector) || isLoading}>
            Transferir <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};