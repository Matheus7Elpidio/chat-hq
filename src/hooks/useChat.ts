import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "../components/ui/use-toast";

interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderRole: 'client' | 'agent' | 'supervisor';
  content: string;
  timestamp: string;
  type: 'message' | 'event';
}

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface ChatRoom {
  id: string;
  participants: Participant[];
  lastMessageTimestamp: string;
  sectorName: string;
}

interface SupervisorMessage {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
}

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

export const useChat = () => {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [supervisorMessages, setSupervisorMessages] = useState<Record<string, SupervisorMessage[]>>({});

  const fetchAgentChats = useCallback(async () => {
    if (user?.role !== 'agent' || !token) return;
    try {
      const response = await fetch('/api/chats/agent', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (!response.ok) throw new Error('Falha ao buscar atendimentos do agente.');
      const data: ChatRoom[] = await response.json();
      setChatRooms(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Não foi possível carregar seus atendimentos.', variant: 'destructive' });
    }
  }, [user, token]);

  useEffect(() => {
    if (user?.role === 'agent') {
      fetchAgentChats();
    }
  }, [user, fetchAgentChats]);


  useEffect(() => {
    if (!user) return;

    // Connect to backend server via proxy
    socketRef.current = io({ 
      query: { userId: user.id, userRole: user.role } 
    });
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket.IO conectado!');
      // If user is an agent, announce as online
      if (user.role === 'agent') {
        socket.emit('agent_online', user);
        console.log('Agente anunciado como online:', user.name);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO Erro de conexão:', err);
    });

    socket.on('receive_message', (message: Message) => {
      setMessages(prev => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] || []), message]
      }));
    });

    socket.on('chat_assigned', (newRoom: ChatRoom) => {
        setChatRooms(prev => {
            // Evita duplicatas
            if (prev.find(room => room.id === newRoom.id)) {
                return prev;
            }
            return [newRoom, ...prev];
        });
        toast({ 
            title: "Novo Atendimento", 
            description: `Um novo chat com ${newRoom.participants.find(p => p.role === 'client')?.name || 'cliente'} foi atribuído a você.` 
        });
    });

    socket.on('chat_transfer_notification', (notification: TransferNotification) => {
      toast({
        title: "Transferência de Atendimento",
        description: notification.message,
        duration: 10000,
      });
      // O agente que recebe a transferência, precisa atualizar sua lista
      fetchAgentChats(); 
    });

    socket.on('chat_transfer_completed', ({ conversationId }: { conversationId: string }) => {
      setChatRooms(prev => prev.filter(room => room.id !== conversationId));
      if (selectedRoom === conversationId) {
        setSelectedRoom(null);
      }
      toast({ title: "Sucesso", description: "O atendimento foi transferido." });
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('receive_message');
      socket.off('chat_assigned');
      socket.off('chat_transfer_notification');
      socket.off('chat_transfer_completed');
      socket.disconnect();
    };
  }, [user, selectedRoom, fetchAgentChats]);

  const sendMessage = (content: string) => {
    if (socketRef.current && selectedRoom && user) {
      const message = {
        conversationId: selectedRoom,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content,
      };
      socketRef.current.emit('send_message', message);
    }
  };

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
    transferChat,
  };
};
