import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MessageSquare, Users, Eye, Radio, Send, UserCircle } from "lucide-react";

interface ActiveConversation { 
  id: string;
  clientName: string;
  agentName: string;
  status: string;
  sectorName: string;
  created_at: string;
}

interface OnlineAgent {
  id: number;
  name: string;
  // Adicione outros campos relevantes que o objeto `user` possa ter
}

interface Message { id: number; conversation_id: string; message_content: string; timestamp: string; sender_name: string; sender_id: number; receiver_id: number; }

export default function RealTimeMonitor() {
  const { user: supervisor, token } = useAuth();
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([]);
  const [onlineAgents, setOnlineAgents] = useState<OnlineAgent[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to backend server via proxy
    socketRef.current = io();

    socketRef.current.on('update_conversations', (conversations) => {
        setActiveConversations(conversations);
    });

    // Novo listener para agentes online
    socketRef.current.on('update_online_agents', (agents) => {
        setOnlineAgents(agents);
    });

    const fetchConversations = async () => {
        try {
            const response = await fetch(`/api/admin/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }
            const data = await response.json();
            setActiveConversations(data);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        }
    };

    if (token) {
        fetchConversations();
    }

    return () => {
        socketRef.current?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendPrivateMessage = () => {
    // ... (lógica existente)
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Radio className="text-red-500 animate-pulse"/> Monitoramento Ao Vivo</CardTitle>
              <CardDescription>Acompanhe conversas e status de agentes em tempo real.</CardDescription>
          </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Card de Conversas Ativas */}
          <Card className="flex flex-col h-1/2">
              <CardHeader>
                  <CardTitle className='text-lg flex items-center gap-2'><Users/> Conversas Ativas ({activeConversations.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 overflow-y-auto">
                  {activeConversations.map((convo) => (
                      <div key={convo.id} onClick={() => setSelectedConversationId(convo.id)} className={`p-3 rounded-lg cursor-pointer hover:bg-gray-200/50 ${selectedConversationId === convo.id ? 'bg-gray-200/80' : ''}`}>
                          <div className="font-semibold">{convo.clientName}</div>
                          <div className="text-sm text-gray-600">{convo.agentName || "Aguardando agente"}</div>
                          <div className="text-xs text-gray-500 mt-1">Setor: {convo.sectorName}</div>
                      </div>
                  ))}
              </CardContent>
          </Card>

          {/* Card de Agentes Online */}
          <Card className="flex flex-col h-1/2">
            <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'><UserCircle className="text-green-500"/> Agentes Online ({onlineAgents.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-1 overflow-y-auto">
                 {onlineAgents.map((agent) => (
                    <div key={agent.id} className={`p-3 rounded-lg`}>
                        <div className="font-semibold flex items-center gap-2">
                           <span className="h-2 w-2 rounded-full bg-green-500"></span>
                           {agent.name}
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 flex flex-col">
          {/* ... (resto do componente de chat) */}
        </Card>
      </div>
    </div>
  );
}
