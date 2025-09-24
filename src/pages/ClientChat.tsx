
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Send, Smile, MoreVertical, LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import RatingModal from '../components/RatingModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from "../components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  senderName: string;
}

const ClientChat = () => {
  const [searchParams] = useSearchParams();
  const sectorId = searchParams.get('sector');
  const navigate = useNavigate();
  // CORREÇÃO: Obter token do contexto de autenticação
  const { user, token, logout } = useAuth();
  const { toast } = useToast();

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sectorName = sectorId === 'ti' ? 'Suporte T.I.' : `Setor ${sectorId}`;

  useEffect(() => {
    if (!sectorId || !user?.id || !token) { // CORREÇÃO: Adicionar verificação de token
      navigate('/select-sector');
      return;
    }

    const startConversation = async () => {
      try {
        // CORREÇÃO: Usar URL relativa e adicionar token de autenticação
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ clientId: user.id, sectorId: sectorId }),
        });
        if (!response.ok) {
            // Log de erro mais detalhado
            const errorData = await response.text();
            console.error("Erro ao iniciar conversa:", response.status, errorData);
            throw new Error('Falha ao iniciar conversa.');
        }
        const data = await response.json();
        setConversationId(data.conversationId);
        setMessages([
          {
            id: 'system-1',
            content: `Você iniciou um chat com ${sectorName}. Um agente irá atendê-lo em breve.`,
            sender: 'system', timestamp: new Date(), senderName: 'Sistema'
          }
        ]);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível iniciar o chat. Tente novamente.", variant: "destructive" });
        navigate('/select-sector');
      } finally {
        setIsLoading(false);
      }
    };

    startConversation();

  }, [sectorId, user, token, navigate, toast, sectorName]); // CORREÇÃO: Adicionar token às dependências

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Enviando mensagem:", newMessage);
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderName: user?.name || 'Cliente'
    };
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleFinishChat = () => {
    if (!conversationId) return;
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!conversationId || !token) return; // CORREÇÃO: Adicionar verificação de token
    try {
      // CORREÇÃO: Usar URL relativa e adicionar token
      const response = await fetch(`/api/conversations/${conversationId}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error('Falha ao enviar avaliação.');
      toast({ title: "Obrigado!", description: "Sua avaliação foi enviada com sucesso." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar sua avaliação.", variant: "destructive" });
    } finally {
      setIsRatingModalOpen(false);
      setMessages(prev => [...prev, { id: 'system-end', content: 'O chat foi encerrado.', sender: 'system', timestamp: new Date(), senderName: 'Sistema' }]);
      setTimeout(() => {
        logout();
        navigate('/');
      }, 3000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center gap-2"><Loader2 className="h-8 w-8 animate-spin" /> Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-0 sm:p-4">
      <Card className="w-full h-screen sm:h-auto sm:max-w-2xl flex flex-col shadow-lg sm:rounded-lg">
        <CardHeader className="border-b flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{sectorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-base">{sectorName}</p>
              <p className="text-sm text-muted-foreground">Atendimento Online</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleFinishChat} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Encerrar Atendimento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'agent' ? 'justify-start' : 'justify-center'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 break-words ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.sender === 'system'
                    ? 'bg-muted/80 text-muted-foreground text-xs italic text-center'
                    : 'bg-muted'
              }`}>
                {message.sender !== 'system' && <p className="font-bold text-xs mb-1">{message.senderName}</p>}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t">
          <div className="relative w-full">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              className="w-full pr-24 min-h-[40px] max-h-[120px]"
              rows={1}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-muted-foreground"><Smile className="h-5 w-5" /></Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default ClientChat;
