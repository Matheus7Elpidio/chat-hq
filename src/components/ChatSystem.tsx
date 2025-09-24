import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, UserCircle, Clock, MessageSquare, ArrowRightLeft, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../hooks/useChat";
import { TransferChatModal } from "./chat/TransferChatModal";

interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'event';
}

interface SupervisorMessage {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
}

// Interface combinada para renderização unificada
interface CombinedMessage extends Message {
  isSupervisorMessage?: boolean;
}

const ChatSystem = () => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const {
    chatRooms,
    messages,
    supervisorMessages,
    selectedRoom,
    setSelectedRoom,
    sendMessage: sendChatMessage,
    transferChat
  } = useChat();

  useEffect(() => {
    console.log("Chat rooms updated:", chatRooms);
  }, [chatRooms]);

  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  const combinedMessages = useMemo(() => {
    if (!selectedRoom) return [];
    const roomMessages = messages[selectedRoom] || [];
    const roomSupervisorMessages = supervisorMessages[selectedRoom] || [];

    const allMessages: CombinedMessage[] = [
      ...roomMessages.map(m => ({ ...m, isSupervisorMessage: false })),
      ...roomSupervisorMessages.map(m => ({ 
        ...m, 
        type: 'message' as const, // Forçar o tipo para compatibilidade
        isSupervisorMessage: true 
      })),
    ];

    return allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  }, [selectedRoom, messages, supervisorMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedRoom && user) {
      sendChatMessage(newMessage);
      setNewMessage("");
    }
  };

  const formatTime = (date: string) => new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const selectedChat = chatRooms.find(r => r.id === selectedRoom);

  const handleConfirmTransfer = (targetId: number, targetType: 'agent' | 'sector', targetName: string) => {
    if (!selectedChat || !user) return;

    transferChat({
      conversationId: selectedChat.id,
      clientId: selectedChat.participants.find(p => p.role === 'Cliente')!.id,
      clientName: selectedChat.participants.find(p => p.role === 'Cliente')!.name,
      currentAgentId: user.id,
      transferringAgentName: user.name,
      targetId,
      targetType,
      targetName,
    });
    setTransferModalOpen(false);
  };

  return (
    <div className="p-6 bg-dashboard-bg min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle>Atendimentos</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 p-2">
              {chatRooms.length > 0 ? (
                chatRooms.map(room => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg cursor-pointer ${selectedRoom === room.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'}`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{room.participants.find(p => p.role === 'Cliente')?.name || 'Cliente Desconhecido'}</p>
                      <span className="text-xs">{formatTime(room.lastMessageTimestamp)}</span>
                    </div>
                    <p className="text-sm truncate">{room.sectorName}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <p className="font-bold">Nenhum atendimento ativo.</p>
                  <p className="text-sm">Aguarde novos clientes iniciarem uma conversa.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
              {selectedRoom && selectedChat ? (
                  <>
                      <CardHeader className="flex-row items-center justify-between">
                          <div>
                              <CardTitle>{selectedChat.participants.find(p => p.role === 'Cliente')?.name || 'Cliente'}</CardTitle>
                              <CardDescription>No setor: {selectedChat.sectorName}</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setTransferModalOpen(true)}>
                              <ArrowRightLeft className="w-4 h-4 mr-2"/>
                              Transferir
                          </Button>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-0">
                          <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {combinedMessages.map((msg) => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user?.id ? 'justify-end' : ''}`}>
                                    <div className={`flex flex-col max-w-[70%] rounded-lg px-3 py-2 ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <span className="font-semibold text-sm">{msg.senderName}</span>
                                        <p>{msg.content}</p>
                                        <span className="text-xs self-end mt-1">{formatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                          <div className="p-4 border-t bg-background">
                            <div className="relative">
                                <Textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="pr-16"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                      }
                                    }}
                                />
                                <Button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                          </div>
                      </CardContent>
                  </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                        <p className="font-bold text-lg">Selecione um atendimento</p>
                        <p>Escolha um chat da lista para ver as mensagens.</p>
                    </div>
                </CardContent>
              )}
          </Card>
      </div>

      <TransferChatModal 
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleConfirmTransfer}
      />
    </div>
  );
};

export default ChatSystem;
