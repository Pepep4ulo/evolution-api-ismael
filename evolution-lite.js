// Evolution API Lite com Baileys - WhatsApp real
const express = require('express');
const cors = require('cors');
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const instances = new Map();

// Criar diretório para sessões
const sessionsDir = './sessions';
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

console.log('Starting Evolution API Lite with Baileys...');

// Função para criar/conectar instância
async function createInstance(instanceName) {
  console.log(`Creating instance: ${instanceName}`);
  
  if (instances.has(instanceName)) {
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
      printQRInTerminal: false,
      logger: { level: 'silent', child: () => ({ level: 'silent' }) }
    });

    socket.ev.on('creds.update', saveCreds);
    
    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      const instance = instances.get(instanceName);
      
      if (qr && instance) {
        console.log(`QR Code generated for ${instanceName}`);
        try {
          const qrCode = await QRCode.toDataURL(qr);
          instance.qrCode = qrCode;
          instance.status = 'qr';
        } catch (error) {
          console.error('Error generating QR:', error);
        }
      }
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(`Connection closed for ${instanceName}, reconnect: ${shouldReconnect}`);
        
        if (instance) {
          instance.status = shouldReconnect ? 'connecting' : 'disconnected';
        }
        
        if (shouldReconnect) {
          setTimeout(() => createInstance(instanceName), 3000);
        }
      } else if (connection === 'open') {
        console.log(`WhatsApp connected: ${instanceName}`);
        if (instance) {
          instance.status = 'connected';
          instance.qrCode = null;
        }
      }
    });

    // Processar mensagens recebidas
    socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.key.fromMe && message.message) {
        console.log(`New message for ${instanceName}:`, message.key.remoteJid);
        
        // Bot básico - responde "oi" com mensagem do Ismael
        const text = message.message.conversation || 
                    message.message.extendedTextMessage?.text ||
                    '';
        
        if (text && text.toLowerCase().includes('oi')) {
          try {
            await socket.sendMessage(message.key.remoteJid, { 
              text: 'Olá! Eu sou o bot do Ismael, motorista particular. Como posso ajudar?' 
            });
          } catch (error) {
            console.error('Error sending reply:', error);
          }
        }
      }
    });

    instances.set(instanceName, {
      socket,
      status: 'connecting',
      qrCode: null,
      created: new Date()
    });

    return instances.get(instanceName);
    
  } catch (error) {
    console.error(`Error creating instance ${instanceName}:`, error);
    throw error;
  }
}

// Rotas da API
app.get('/', (req, res) => {
  res.json({ 
    status: 'Evolution API Lite Running with Baileys',
    version: '2.0.0',
    instances: instances.size
  });
});

// Criar instância
app.post('/instance/create', async (req, res) => {
  const { instanceName } = req.body;
  
  if (!instanceName) {
    return res.status(400).json({ error: 'instanceName required' });
  }

  try {
    await createInstance(instanceName);
    const instance = instances.get(instanceName);
    
    res.json({
      instance: {
        instanceName,
        status: instance.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter QR Code
app.get('/instance/qrcode/:instanceName', (req, res) => {
  const { instanceName } = req.params;
  const instance = instances.get(instanceName);
  
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
  
  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }
  
  res.json({
    instanceName,
    status: instance.status
  });
});

// Enviar mensagem de texto
app.post('/message/sendText/:instanceName', async (req, res) => {
  const { instanceName } = req.params;
  const { number, text } = req.body;
  
  const instance = instances.get(instanceName);
  
  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }
  
  if (instance.status !== 'connected') {
    return res.status(400).json({ error: 'Instance not connected' });
  }
  
  try {
    const jid = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
    const result = await instance.socket.sendMessage(jid, { text });
    
    res.json({
      key: result.key,
      status: 'success'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evolution API Lite running on port ${PORT}`);
  console.log('Ready to create WhatsApp instances!');
});
