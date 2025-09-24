import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

// ... (Interfaces Message, ChatRoom, SupervisorMessage)

interface TransferPayload {
  conversationId: string;
  clientId: number;
  clientName: string;
  currentAgentId: number;
  transferringAgentName: string;
  targetId: number;
  targetType: 'agent' | 'sector';
  targetName: string;
}

interface TransferNotification {
  conversationId: string;
  clientId: number;
  clientName: string;
  message: string;
}

const SOCKET_SERVER_URL = "http://localhost:3001";

export const useChat = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [supervisorMessages, setSupervisorMessages] = useState<Record<string, SupervisorMessage[]>>({});

  // ... (useEffect para buscar histórico)

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_SERVER_URL, { 
      query: { userId: user.id, userRole: user.role } 
    });
    const socket = socketRef.current;

    // ... (listeners existentes: receive_message, etc.)

    // NOVO: Listener para notificação de transferência
    socket.on('chat_transfer_notification', (notification: TransferNotification) => {
      toast({
        title: "Transferência de Atendimento",
        description: notification.message,
        duration: 10000,
      });
      // Opcional: Atualizar a lista de chats para refletir a nova conversa
    });

    // NOVO: Listener para confirmar que a transferência foi completada
    socket.on('chat_transfer_completed', ({ conversationId }: { conversationId: string }) => {
      // Remove a sala de chat da UI do agente que transferiu
      setChatRooms(prev => prev.filter(room => room.id !== conversationId));
      if (selectedRoom === conversationId) {
        setSelectedRoom(null);
      }
      toast({ title: "Sucesso", description: "O atendimento foi transferido." });
    });

    return () => {
      socket.off('chat_transfer_notification');
      socket.off('chat_transfer_completed');
      socket.disconnect();
    };
  }, [user, selectedRoom]);

  const sendMessage = (content: string) => { /* ... */ };

  // NOVA: Função para emitir o evento de transferência
  const transferChat = (payload: TransferPayload) => {
    socketRef.current?.emit('transfer_chat', payload);
  };

  return {
    chatRooms,
    messages,
    supervisorMessages,
    selectedRoom,
    setSelectedRoom,
    sendMessage,
    transferChat, // Expor a nova função
  };
};
