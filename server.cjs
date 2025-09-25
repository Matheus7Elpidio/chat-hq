'use strict';

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile.cjs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = 3001;
const JWT_SECRET = 'uma-chave-secreta-muito-forte-e-temporaria';
const db = knex(knexConfig.development);

// Armazenamento em memória para status de agentes online
let onlineAgents = {}; // { userId: { socketId, name, ... }, ... }

db.raw('select 1+1 as result').then(() => {
  console.log('Conexão com o banco de dados (via Knex) estabelecida com sucesso.');
}).catch(err => {
  console.error('Erro ao conectar com o banco de dados:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ===== ROTAS DE AUTENTICAÇÃO =====

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUserId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ id: newUserId, name, email, role });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao tentar registrar usuário.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const tokenPayload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: tokenPayload });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// ===== ROTAS DE CONFIGURAÇÕES =====

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db('app_settings').orderBy('created_at', 'desc').first();
    res.json(settings ? settings.config_json || {} : {});
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Falha ao buscar as configurações do servidor.' });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
   if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  try {
    await db('app_settings').insert({ config_json: req.body });
    res.status(200).json({ message: 'Configurações salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    res.status(500).json({ error: 'Falha ao salvar as configurações no servidor.' });
  }
});

// ===== ROTAS DO DASHBOARD (ADMIN/SUPERVISOR) =====

app.get('/api/admin/metrics', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
    return res.status(403).json({ error: 'Acesso não autorizado a estas métricas.' });
  }
  try {
    const activeConversations = await db('conversations').whereIn('status', ['pending', 'active']).count({ count: 'id' }).first();
    // Agora a contagem de agentes online vem do nosso sistema de presença em memória
    const onlineAgentsCount = Object.keys(onlineAgents).length;
    res.json({ activeConversations: activeConversations.count || 0, onlineAgents: onlineAgentsCount });
  } catch (error) {
    console.error('Erro ao buscar métricas do admin:', error);
    res.status(500).json({ error: 'Erro interno ao buscar as métricas.' });
  }
});

app.get('/api/admin/conversations', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  try {
    const activeConversations = await getActiveConversations();
    res.json(activeConversations);
  } catch (error) {
    console.error('Erro ao buscar conversas para monitoramento:', error);
    res.status(500).json({ error: 'Erro interno ao buscar conversas.' });
  }
});


// ===== ROTAS DE CONVERSA =====

// Buscar conversas do agente
app.get('/api/chats/agent', authenticateToken, async (req, res) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({ error: 'Acesso negado. Somente agentes podem acessar esta rota.' });
  }
  
  try {
    const agentId = req.user.id;
    
    // Buscar conversas ativas do agente
    const conversations = await db('conversations as c')
      .leftJoin('users as client', 'c.client_id', 'client.id')
      .where('c.agent_id', agentId)
      .whereIn('c.status', ['active', 'pending'])
      .select(
        'c.id',
        'c.status',
        'c.created_at',
        'client.id as clientId',
        'client.name as clientName'
      )
      .orderBy('c.created_at', 'desc');

    // Converter para formato ChatRoom esperado pelo frontend
    const chatRooms = conversations.map(conv => ({
      id: conv.id.toString(),
      participants: [
        { id: conv.clientId, name: conv.clientName, role: 'client' },
        { id: agentId, name: req.user.name, role: 'agent' }
      ],
      lastMessage: null, // TODO: buscar última mensagem se necessário
      unreadCount: 0 // TODO: calcular mensagens não lidas se necessário
    }));

    res.json(chatRooms);
  } catch (error) {
    console.error('Erro ao buscar chats do agente:', error);
    res.status(500).json({ error: 'Erro interno ao buscar chats do agente.' });
  }
});

app.post('/api/conversations', authenticateToken, async (req, res) => {
  const { clientId, sectorId } = req.body;
  if (!clientId || !sectorId) {
    return res.status(400).json({ error: 'O ID do cliente e do setor são obrigatórios.' });
  }
  try {
    // Create conversation
    const [newConversationId] = await db('conversations').insert({
      client_id: clientId,
      agent_id: null,
      sector_id: sectorId,
      status: 'pending',
    });

    // Try to assign to an available agent
    let assignedAgent = null;
    const onlineAgentIds = Object.keys(onlineAgents);
    
    if (onlineAgentIds.length > 0) {
      // Get first available agent (simple round-robin, can be improved)
      const selectedAgentId = parseInt(onlineAgentIds[0]);
      assignedAgent = onlineAgents[selectedAgentId];
      
      // Update conversation with agent assignment
      await db('conversations')
        .where('id', newConversationId)
        .update({
          agent_id: selectedAgentId,
          status: 'active'
        });

      // Get client and agent details for the chat room
      const client = await db('users').where('id', clientId).first();
      const agent = await db('users').where('id', selectedAgentId).first();

      // Create chat room object for the agent
      const chatRoom = {
        id: newConversationId.toString(),
        participants: [
          { id: client.id, name: client.name, role: 'client' },
          { id: agent.id, name: agent.name, role: 'agent' }
        ],
        lastMessage: null,
        unreadCount: 0
      };

      // Emit chat_assigned event to the specific agent
      if (assignedAgent.socketId) {
        io.to(assignedAgent.socketId).emit('chat_assigned', chatRoom);
        console.log(`Conversa ${newConversationId} atribuída ao agente ${agent.name} (${selectedAgentId})`);
      }
    }

    // Update all admins/supervisors with new conversation list
    const activeConversations = await getActiveConversations();
    io.emit('update_conversations', activeConversations);

    res.status(201).json({ 
      conversationId: newConversationId,
      assignedAgent: assignedAgent ? assignedAgent.name : null
    });
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    res.status(500).json({ error: 'Erro interno ao tentar iniciar a conversa.' });
  }
});

// Helper para buscar conversas ativas
const getActiveConversations = async () => {
    const activeConversations = await db('conversations as c')
        .leftJoin('users as agent', 'c.agent_id', 'agent.id')
        .leftJoin('users as client', 'c.client_id', 'client.id')
        .whereIn('c.status', ['pending', 'active'])
        .select(
            'c.id',
            'c.status',
            'client.name as clientName',
            'agent.name as agentName',
            'c.sector_id as sectorName',
            'c.created_at'
        ).orderBy('c.created_at', 'desc');
    return activeConversations;
}

// ===== LÓGICA DE SOCKET.IO PARA PRESENÇA =====

const broadcastOnlineAgents = () => {
    io.emit('update_online_agents', Object.values(onlineAgents));
}

io.on('connection', (socket) => {
    console.log('Um usuário conectou via WebSocket:', socket.id);

    // Quando um agente se identifica como online
    socket.on('agent_online', (agentUser) => {
        if (agentUser && agentUser.id) {
            onlineAgents[agentUser.id] = { 
                socketId: socket.id,
                ...agentUser 
            };
            console.log(`Agente ${agentUser.name} está online.`);
            broadcastOnlineAgents();
        }
    });

    // Handler para envio de mensagens
    socket.on('send_message', async (messageData) => {
        try {
            const { conversationId, content, senderId, senderName } = messageData;
            
            if (!conversationId || !content || !senderId) {
                console.error('Dados de mensagem incompletos:', messageData);
                return;
            }

            // Salvar mensagem no banco de dados
            const [messageId] = await db('messages').insert({
                conversation_id: conversationId,
                sender_id: senderId,
                sender_type: 'user',
                content: content,
            });

            // Buscar participantes da conversa
            const conversation = await db('conversations as c')
                .leftJoin('users as client', 'c.client_id', 'client.id')
                .leftJoin('users as agent', 'c.agent_id', 'agent.id')
                .where('c.id', conversationId)
                .select('c.*', 'client.name as clientName', 'agent.name as agentName')
                .first();

            if (conversation) {
                // Criar objeto de mensagem para broadcast
                const messageToSend = {
                    id: messageId,
                    conversationId: conversationId,
                    content: content,
                    senderId: senderId,
                    senderName: senderName,
                    timestamp: new Date().toISOString(),
                    type: 'message'
                };

                // Send message only to conversation participants (not broadcast)
                // For now, emit to all sockets but this needs room-based implementation
                // TODO: Implement proper room-based messaging for privacy
                if (conversation.client_id !== senderId) {
                    // Send to client - for now we don't track client sockets, 
                    // but this should be room-based or targeted
                }

                // Send message to the agent if they're not the sender
                if (conversation.agent_id && conversation.agent_id !== senderId) {
                    const agent = onlineAgents[conversation.agent_id];
                    if (agent && agent.socketId) {
                        io.to(agent.socketId).emit('receive_message', messageToSend);
                    }
                }

                // Also emit to the sender to confirm message was sent
                socket.emit('receive_message', messageToSend);

                console.log(`Mensagem enviada na conversa ${conversationId}: ${content}`);
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectou:', socket.id);
        // Encontrar e remover o agente da lista de online pelo socket.id
        const agentId = Object.keys(onlineAgents).find(key => onlineAgents[key].socketId === socket.id);
        if (agentId) {
            console.log(`Agente ${onlineAgents[agentId].name} ficou offline.`);
            delete onlineAgents[agentId];
            broadcastOnlineAgents();
        }
    });
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
