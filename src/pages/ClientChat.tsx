import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile, MoreVertical, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import RatingModal from '@/components/RatingModal'; // Será criado a seguir
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  senderName: string;
}

const ClientChat = () => {
  const [searchParams] = useSearchParams();
  const sector = searchParams.get('sector');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sectorName = sector === 'ti' ? 'Suporte T.I.' : 'Suporte';

  useEffect(() => {
    // Se não houver um setor, redireciona para a seleção
    if (!sector) {
      navigate('/select-sector');
    }

    // Mensagem inicial do sistema
    setMessages([
      {
        id: 'system-1',
        content: `Você iniciou um chat com ${sectorName}. Um agente irá atendê-lo em breve.`,
        sender: 'system',
        timestamp: new Date(),
        senderName: 'Sistema'
      }
    ]);
  }, [sector, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderName: user?.name || 'Cliente'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simula resposta do agente
    setTimeout(() => {
        const agentMessage: Message = {
            id: Date.now().toString(),
            content: "Olá! Obrigado por esperar. Como posso te ajudar hoje?",
            sender: "agent",
            timestamp: new Date(),
            senderName: "Agente de Suporte"
        };
        setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFinishChat = () => {
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating: number) => {
    console.log(`Avaliação recebida: ${rating} estrelas`);
    setIsRatingModalOpen(false);
    
    // Adiciona mensagem de encerramento e desloga
    const systemMessage: Message = {
      id: 'system-end',
      content: 'Obrigado por avaliar! O chat foi encerrado.',
      sender: 'system',
      timestamp: new Date(),
      senderName: 'Sistema'
    };
    setMessages(prev => [...prev, systemMessage]);

    setTimeout(() => {
        logout();
        navigate('/');
    }, 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

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
                    onKeyPress={handleKeyPress}
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
