const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] } });
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./sql.db', (err) => {
  if (err) console.error('Erro ao abrir o banco de dados', err.message);
  else console.log('Conectado ao banco de dados SQLite.');
});

const onlineTrackedUsers = new Set();

// --- ENDPOINTS DA API REST ---

// ... (endpoints existentes: /api/admin/metrics, /api/agent/metrics/:agentId, etc.)

// NOVO: Endpoint para buscar opções de transferência (setores e agentes online)
app.get('/api/transfer-options', (req, res) => {
    const sectorsQuery = "SELECT id, name FROM sectors ORDER BY name ASC";
    
    // Retorna agentes e setores mesmo que não haja agentes online
    db.all(sectorsQuery, [], (err, sectors) => {
        if (err) return res.status(500).json({ error: 'Falha ao buscar setores.' });

        if (onlineTrackedUsers.size === 0) {
            return res.json({ sectors, agents: [] });
        }

        const agentsQuery = `
            SELECT u.id, u.name, s.name as sectorName
            FROM users u
            JOIN sectors s ON u.sector_id = s.id
            WHERE u.role = 'Agente' AND u.id IN (${Array.from(onlineTrackedUsers).map(id => `'${id}'`).join(',')})
            ORDER BY u.name ASC
        `;

        db.all(agentsQuery, [], (err, agents) => {
            if (err) return res.status(500).json({ error: 'Falha ao buscar agentes online.' });
            res.json({ sectors, agents });
        });
    });
});


// --- LÓGICA DO WEBSOCKET ---
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.userRole;

    if (userId) {
        socket.join(userId.toString());
        if (['Agente', 'Supervisor', 'Admin'].includes(userRole)) {
            onlineTrackedUsers.add(userId);
        }
    }

    socket.on('disconnect', () => {
        if (userId && ['Agente', 'Supervisor', 'Admin'].includes(userRole)) {
            onlineTrackedUsers.delete(userId);
        }
    });

    // NOVO: Evento para gerenciar a transferência de chat
    socket.on('transfer_chat', (data) => {
        const {
            conversationId,
            clientId,
            currentAgentId,
            targetId,      // ID do agente ou setor de destino
            targetType,    // 'agent' ou 'sector'
            targetName,    // Nome do agente ou setor
            clientName,
            transferringAgentName
        } = data;

        const transferMessage = `O agente ${transferringAgentName} está transferindo você para ${targetType === 'agent' ? 'o agente' : 'o setor'} ${targetName}. Por favor, aguarde.`;

        // 1. Envia uma mensagem do sistema para o cliente informando sobre a transferência
        db.run(`INSERT INTO chat_history (conversation_id, sender_id, receiver_id, message_content, timestamp) VALUES (?, ?, ?, ?, ?)`, 
            [conversationId, 0, clientId, transferMessage, new Date().toISOString()], function(err) {
            if (err) { console.error('Falha ao salvar a mensagem de transferência:', err); return; }

            const newMessage = { ...data, id: this.lastID, message_content: transferMessage, sender_name: 'Sistema' };
            io.to(clientId.toString()).to(`supervisor_${conversationId}`).emit('receive_message', newMessage);
        });

        // 2. Notifica o(s) novo(s) agente(s)
        const notification = {
            conversationId, 
            clientId, 
            clientName, 
            message: `Atendimento de ${clientName} transferido por ${transferringAgentName}.`
        };

        if (targetType === 'agent') {
            io.to(targetId.toString()).emit('chat_transfer_notification', notification);
        } else {
            db.all('SELECT id FROM users WHERE sector_id = ? AND role = \'Agente\'', [targetId], (err, agents) => {
                if (agents) {
                    agents.forEach(agent => {
                        if (onlineTrackedUsers.has(agent.id.toString())) {
                            io.to(agent.id.toString()).emit('chat_transfer_notification', notification);
                        }
                    });
                }
            });
        }

        // 3. Confirma a transferência para o agente original para que a UI possa ser atualizada
        socket.emit('chat_transfer_completed', { conversationId });
    });

    // ... (outros eventos de socket: send_message, etc.)
});

server.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
