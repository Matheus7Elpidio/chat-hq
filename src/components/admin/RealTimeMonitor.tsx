import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Users, Eye, Radio, Send } from "lucide-react";

const API_URL = "http://localhost:3001";

// Interfaces (sem alteração)
interface ActiveConversation { /* ... */ }
interface Message { id: number; conversation_id: string; message_content: string; timestamp: string; sender_name: string; sender_id: number; receiver_id: number; }

export function RealTimeMonitor() {
  const { user: supervisor } = useAuth(); // 1. Obter o supervisor logado
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessage, setPrivateMessage] = useState(""); // 2. Estado para a mensagem privada
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeitos de busca e socket (sem alterações significativas)
  useEffect(() => { /* ... */ }, []);
  useEffect(() => { /* ... */ }, [selectedConversationId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 3. Função para enviar a mensagem privada
  const handleSendPrivateMessage = () => {
    if (!privateMessage.trim() || !selectedConversationId || !supervisor) return;

    // Assume-se que o Agente tem ID 1 para este projeto
    const agentId = 1; 

    const messageData = {
      conversation_id: selectedConversationId,
      agent_id: agentId,
      supervisor_name: supervisor.name,
      message_content: privateMessage,
    };

    socketRef.current?.emit('send_private_supervisor_message', messageData);
    setPrivateMessage("");
  };

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <Card>{/* Header (sem alteração) */}</Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <Card className="md:col-span-1 flex flex-col">{/* Lista de conversas (sem alteração) */}</Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>{/* ... */}</CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100/80">
            {/* ... (Renderização das mensagens) */}
          </CardContent>

          {/* 4. Formulário de intervenção do supervisor */}
          {selectedConversationId && (
            <CardFooter className="p-4 border-t bg-background">
              <div className="relative w-full flex items-center gap-2">
                <Textarea
                  placeholder={`Enviar uma nota privada para o agente...`}
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrivateMessage();
                    }
                  }}
                  className="flex-1 min-h-[40px] max-h-[100px] pr-12 resize-none"
                  rows={1}
                />
                <Button onClick={handleSendPrivateMessage} disabled={!privateMessage.trim()} size="icon" aria-label="Enviar nota privada">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
