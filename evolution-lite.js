// EVOLUTION LITE CORRIGIDO - Instâncias persistentes
const express = require('express');
const cors = require('cors');
const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const makeWASocket = require('@whiskeysockets/baileys').default;
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const instances = new Map();
const sessionsDir = './sessions';

// Criar diretório de sessões
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

console.log('🚀 Starting Evolution API Lite with Baileys...');

// Função para criar instância WhatsApp
async function createInstance(instanceName) {
  console.log(`📱 Creating instance: ${instanceName}`);

  // Se já existe, retorna a existente
  if (instances.has(instanceName)) {
    console.log(`♻️ Instance ${instanceName} already exists`);
    return instances.get(instanceName);
  }

  const sessionPath = path.join(sessionsDir, instanceName);
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: { level: 'silent' },
      browser: ['Evolution Lite', 'Chrome', '1.0.0']
    });

    // Criar entrada da instância ANTES dos eventos
    const instanceData = {
      socket,
      status: 'connecting',
      qrCode: null,
      created: new Date(),
      instanceName
    };
    
    instances.set(instanceName, instanceData);
    console.log(`✅ Instance ${instanceName} added to Map. Total: ${instances.size}`);

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      const instance = instances.get(instanceName);

      console.log(`🔄 Connection update for ${instanceName}: ${connection}`);

      if (qr && instance) {
        console.log(`🔲 QR Code generated for ${instanceName}`);
        try {
          const qrCode = await QRCode.toDataURL(qr);
          instance.qrCode = qrCode;
          instance.status = 'qr';
          console.log(`📱 QR Code ready for ${instanceName}`);
        } catch (error) {
          console.error('❌ Error generating QR:', error);
        }
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(`⚠️ Connection closed for ${instanceName}, reconnect: ${shouldReconnect}`);

        if (instance) {
          instance.status = shouldReconnect ? 'connecting' : 'disconnected';
          // NÃO remove a instância, apenas atualiza status
        }

        if (shouldReconnect) {
          console.log(`🔁 Reconnecting ${instanceName} in 5 seconds...`);
          setTimeout(() => {
            // Remove a instância antiga e cria nova
            instances.delete(instanceName);
            createInstance(instanceName);
          }, 5000);
        }
      } else if (connection === 'open') {
        console.log(`✅ WhatsApp connected: ${instanceName}`);
        if (instance) {
          instance.status = 'connected';
          instance.qrCode = null;
        }
      }
    });

    // Bot básico - auto resposta
    socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.key.fromMe && message.message) {
        const text = message.message.conversation ||
                    message.message.extendedTextMessage?.text ||
                    '';

        console.log(`📨 New message for ${instanceName}: ${text}`);

        // Resposta automática para "oi" ou "olá"
        if (text && (text.toLowerCase().includes('oi') || text.toLowerCase().includes('olá'))) {
          try {
            await socket.sendMessage(message.key.remoteJid, {
              text: `🚗 Olá! Sou o bot do Ismael, motorista particular.

Para solicitar corrida, envie:
📍 *Origem, Destino, Nº pessoas*

💰 Valores:
• R$ 15 (1 pessoa)  
• R$ 18 (2+ pessoas)

*Exemplo:* Centro, Hospital, 2`
            });
            console.log(`✅ Auto-reply sent to ${message.key.remoteJid}`);
          } catch (error) {
            console.error('❌ Error sending reply:', error);
          }
        }
      }
    });

    return instanceData;

  } catch (error) {
    console.error(`❌ Error creating instance ${instanceName}:`, error);
    // Mesmo com erro, mantém uma instância com status de erro
    const errorInstance = {
      socket: null,
      status: 'error',
      qrCode: null,
      created: new Date(),
      instanceName,
      error: error.message
    };
    instances.set(instanceName, errorInstance);
    return errorInstance;
  }
}

// ROTAS DA API
app.get('/', (req, res) => {
  res.json({
    status: 'Evolution API Lite Running with Baileys',
    version: '2.0.0',
    instances: instances.size,
    activeInstances: Array.from(instances.keys())
  });
});

// Criar instância
app.post('/instance/create', async (req, res) => {
  const { instanceName } = req.body;

  if (!instanceName) {
    return res.status(400).json({ error: 'instanceName required' });
  }

  console.log(`🔧 API request to create instance: ${instanceName}`);

  try {
    const instance = await createInstance(instanceName);
    res.json({
      instance: {
        instanceName,
        status: instance.status,
        created: instance.created
      }
    });
  } catch (error) {
    console.error(`❌ API error creating ${instanceName}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Obter QR Code
app.get('/instance/qrcode/:instanceName', (req, res) => {
  const { instanceName } = req.params;
  const instance = instances.get(instanceName);

  console.log(`🔲 QR request for ${instanceName}, exists: ${!!instance}`);

  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }

  res.json({
    qrCode: instance.qrCode,
    status: instance.status
  });
});

// Status da instância
app.get('/instance/status/:instanceName', (req, res) => {
  const { instanceName } = req.params;
  const instance = instances.get(instanceName);

  console.log(`📊 Status request for ${instanceName}, exists: ${!!instance}`);

  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }

  res.json({
    instanceName,
    status: instance.status,
    created: instance.created
  });
});

// Listar todas as instâncias
app.get('/instances', (req, res) => {
  const instanceList = Array.from(instances.entries()).map(([name, data]) => ({
    instanceName: name,
    status: data.status,
    created: data.created
  }));

  res.json({
    instances: instanceList,
    total: instances.size
  });
});

// Enviar mensagem
app.post('/message/sendText/:instanceName', async (req, res) => {
  const { instanceName } = req.params;
  const { number, text } = req.body;

  const instance = instances.get(instanceName);

  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }

  if (instance.status !== 'connected') {
    return res.status(400).json({ error: `Instance not connected. Status: ${instance.status}` });
  }

  try {
    const jid = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
    const result = await instance.socket.sendMessage(jid, { text });

    res.json({
      key: result.key,
      status: 'success'
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicializar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Evolution API Lite running on port ${PORT}`);
  console.log('📱 Ready to create WhatsApp instances!');
  
  // Criar instância padrão automaticamente
  setTimeout(() => {
    console.log('🚀 Creating default instance...');
    createInstance('ismael_bot');
  }, 2000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  instances.forEach((instance, name) => {
    if (instance.socket) {
      console.log(`📴 Closing instance ${name}`);
      instance.socket.end();
    }
  });
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Server interrupted...');
  process.exit(0);
});
