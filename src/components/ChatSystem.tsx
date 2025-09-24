import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserCircle, Clock, MessageSquare, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { TransferChatModal } from "./chat/TransferChatModal"; // Importa o novo modal

// ... (interfaces CombinedMessage e outras permanecem as mesmas)

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
    transferChat // 2. Obtém a nova função do hook
  } = useChat();

  // State para controlar o modal de transferência
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  // ... (useMemo e useEffect para mensagens combinadas)

  const handleSendMessage = () => { /* ... */ };
  const formatTime = (date: string) => new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const selectedChat = chatRooms.find(r => r.id === selectedRoom);

  // 3. Função para lidar com a confirmação da transferência
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
    setTransferModalOpen(false); // Fecha o modal após a transferência
  };

  return (
    <div className="p-6 bg-dashboard-bg min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="lg:col-span-1 flex flex-col">{/* ... (Lista de chats) */}</Card>

          <Card className="lg:col-span-2 flex flex-col">
              {selectedRoom && selectedChat ? (
                  <>
                      <CardHeader className="flex-row items-center justify-between">
                          <div>
                              <CardTitle>{selectedChat.participants.find(p => p.role === 'Cliente')?.name || 'Cliente'}</CardTitle>
                              {/* ... (descrição) */}
                          </div>
                          {/* 1. Botão para abrir o modal de transferência */}
                          <Button variant="outline" size="sm" onClick={() => setTransferModalOpen(true)}>
                              <ArrowRightLeft className="w-4 h-4 mr-2"/>
                              Transferir
                          </Button>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-0">
                          <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {/* ... (Renderização das mensagens) */}
                            <div ref={messagesEndRef} />
                          </div>
                          <div className="p-4 border-t bg-background">{/* ... (Área de input) */}</div>
                      </CardContent>
                  </>
              ) : (
                  <CardContent>{/* ... (Placeholder) */}</CardContent>
              )}
          </Card>
      </div>

      {/* Modal de Transferência */}
      <TransferChatModal 
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleConfirmTransfer}
      />
    </div>
  );
};

export default ChatSystem;
