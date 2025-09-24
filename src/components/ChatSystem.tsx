import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Paperclip,
  Smile,
  UserCircle,
  Clock,
  MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  senderName: string;
}

interface ChatRoom {
  id: string;
  user: {
    name: string;
    email: string;
    status: 'online' | 'away';
  };
  agent?: {
    name: string;
    status: 'online' | 'busy';
  };
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Ativo' | 'Aguardando' | 'Encerrado';
  subject: string;
  createdAt: Date;
  lastMessage?: string;
}

const ChatSystem = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dados simulados
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: "1",
      user: { name: "João Silva", email: "joao@empresa.com", status: "online" },
      agent: { name: "Ana Suporte", status: "online" },
      priority: "Alta",
      status: "Ativo",
      subject: "Problema com acesso ao sistema",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      lastMessage: "Preciso acessar o sistema urgente"
    },
    {
      id: "2", 
      user: { name: "Maria Santos", email: "maria@empresa.com", status: "online" },
      priority: "Média",
      status: "Aguardando",
      subject: "Reset de senha do email",
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      lastMessage: "Aguardando atendimento..."
    },
    {
      id: "3",
      user: { name: "Carlos Oliveira", email: "carlos@empresa.com", status: "away" },
      agent: { name: "Pedro Suporte", status: "busy" },
      priority: "Baixa",
      status: "Ativo",
      subject: "Instalação de software",
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      lastMessage: "Obrigado pela ajuda!"
    }
  ]);

  // Mensagens simuladas
  useEffect(() => {
    setMessages({
      "1": [
        {
          id: "1",
          content: "Olá, estou com problema para acessar o sistema da empresa",
          sender: "user",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          senderName: "João Silva"
        },
        {
          id: "2", 
          content: "Olá João! Vou te ajudar com esse problema. Pode me informar qual erro está aparecendo?",
          sender: "agent",
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          senderName: "Ana Suporte"
        },
        {
          id: "3",
          content: "Aparece 'Usuário ou senha inválidos' mas tenho certeza que estão corretos",
          sender: "user", 
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          senderName: "João Silva"
        },
        {
          id: "4",
          content: "Entendi. Vou verificar sua conta no sistema. Um momento por favor...",
          sender: "agent",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          senderName: "Ana Suporte"
        }
      ]
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedRoom]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "agent",
      timestamp: new Date(),
      senderName: "Ana Suporte"
    };

    setMessages(prev => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), message]
    }));
    
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-destructive text-destructive-foreground";
      case "Média": return "bg-warning text-warning-foreground";
      case "Baixa": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-success text-success-foreground";
      case "Aguardando": return "bg-warning text-warning-foreground";
      case "Encerrado": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 bg-dashboard-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sistema de Chat</h1>
        <p className="text-muted-foreground">Gerencie atendimentos em tempo real</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Lista de Chats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conversas Ativas
              <Badge className="bg-primary text-primary-foreground">
                {chatRooms.filter(room => room.status === "Ativo").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                    selectedRoom === room.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-8 w-8" />
                      <div>
                        <p className="font-medium text-sm">{room.user.name}</p>
                        <p className="text-xs text-muted-foreground">{room.user.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Badge className={getPriorityColor(room.priority)}>
                        {room.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium mb-1">{room.subject}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {room.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(room.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedRoom ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserCircle className="h-8 w-8" />
                    <div>
                      <p className="font-medium">
                        {chatRooms.find(r => r.id === selectedRoom)?.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {chatRooms.find(r => r.id === selectedRoom)?.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {(messages[selectedRoom] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'agent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.senderName} • {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de mensagem */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 min-h-[40px] max-h-[100px]"
                      rows={1}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa da lista para começar o atendimento
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Área para integração com n8n Agent */}
      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Integração n8n Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Configure um agente automatizado para responder perguntas frequentes e redirecionar casos complexos
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" disabled>
              Configurar Webhook n8n
            </Button>
            <Button variant="outline" disabled>
              Treinar Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSystem;