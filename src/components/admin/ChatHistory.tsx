import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search, MessageSquare, User, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const API_URL = "http://localhost:3001";

interface Message {
  id: number;
  conversation_id: string;
  message_content: string;
  timestamp: string;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  receiver_name: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: string[];
  lastTimestamp: string;
}

export function ChatHistory() {
  const [filters, setFilters] = useState<{
    agentId: string;
    userId: string;
    startDate?: Date;
    endDate?: Date;
  }>({ agentId: "", userId: "" });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setSelectedConversation(null);
    const query = new URLSearchParams();
    if (filters.agentId) query.append("agentId", filters.agentId);
    if (filters.userId) query.append("userId", filters.userId);
    if (filters.startDate) query.append("startDate", format(filters.startDate, "yyyy-MM-dd"));
    if (filters.endDate) query.append("endDate", format(filters.endDate, "yyyy-MM-dd"));

    try {
      const response = await fetch(`${API_URL}/api/admin/chat/search?${query.toString()}`);
      const messages: Message[] = await response.json();
      const conversationsMap = new Map<string, Conversation>();
      messages.forEach(msg => {
        if (!conversationsMap.has(msg.conversation_id)) {
          conversationsMap.set(msg.conversation_id, { 
            id: msg.conversation_id, 
            messages: [],
            participants: [],
            lastTimestamp: msg.timestamp
          });
        }
        const convo = conversationsMap.get(msg.conversation_id)!;
        convo.messages.push(msg);
        if (msg.sender_name && !convo.participants.includes(msg.sender_name)) convo.participants.push(msg.sender_name);
        if (msg.receiver_name && !convo.participants.includes(msg.receiver_name)) convo.participants.push(msg.receiver_name);
        if (new Date(msg.timestamp) > new Date(convo.lastTimestamp)) {
            convo.lastTimestamp = msg.timestamp;
        }
      });
      const sortedConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime());
      setConversations(sortedConversations);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Auditoria de Conversas</CardTitle>
          <CardDescription>Busque e filtre o histórico de conversas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="agentId">ID do Agente</Label>
              <Input id="agentId" placeholder="Ex: 1" value={filters.agentId} onChange={e => setFilters({...filters, agentId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">ID do Cliente</Label>
              <Input id="userId" placeholder="Ex: 2" value={filters.userId} onChange={e => setFilters({...filters, userId: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={filters.startDate} onSelect={date => setFilters({...filters, startDate: date})} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data de Fim</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={filters.endDate} onSelect={date => setFilters({...filters, endDate: date})} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="w-full lg:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-320px)]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Resultados ({conversations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto">
            {conversations.map(convo => (
              <div key={convo.id} onClick={() => setSelectedConversation(convo)} className={`p-3 mb-2 rounded-lg cursor-pointer border ${selectedConversation?.id === convo.id ? 'bg-primary/10 border-primary' : 'bg-white hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center"><Users className="h-4 w-4 mr-2"/> {convo.participants.join(', ')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{convo.messages.slice(-1)[0].message_content}</p>
                 <p className="text-xs text-gray-500 text-right mt-2">{formatDateTime(convo.lastTimestamp)}</p>
              </div>
            ))}
            {!isLoading && conversations.length === 0 && <p className="text-center text-sm text-gray-500 p-4">Nenhuma conversa encontrada.</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Detalhes da Conversa</CardTitle>
             {selectedConversation && <CardDescription>Conversa entre {selectedConversation.participants.join(', ')}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedConversation ? selectedConversation.messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === (parseInt(filters.agentId) || -1) ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender_id === (parseInt(filters.agentId) || -1) ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
                  <p className="font-bold text-sm">{msg.sender_name}</p>
                  <p>{msg.message_content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{formatDateTime(msg.timestamp)}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4"/>
                <p>Selecione uma conversa para ver os detalhes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
