// EVOLUTION LITE SIMPLIFICADO - Versão mais estável
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

console.log('🚀 Starting Evolution API Lite (Simple Mode)...');

// Simulador de instância ativa para desenvolvimento
const instances = new Map();
let qrCodeGenerated = false;

// Criar instância padrão
setTimeout(() => {
  instances.set('ismael_bot', {
    instanceName: 'ismael_bot',
    status: 'qr',
    created: new Date(),
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+s9J6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF8klEQVR4nO3dTY7bMAyGUXeVde9QZ+kOc5YuOmfpDXWWLjqHmI0RTOD+oCRLfhBCt78JJNuyLX54JAaO4zh+AfjdT//vArxNeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzjxF8wqRsFrJQJfAAAAAElFTkSuQmCC'
  });
  console.log('✅ Default instance ismael_bot created');
  qrCodeGenerated = true;
}, 3000);

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

  console.log(`🔧 Creating instance: ${instanceName}`);

  // Simular criação
  if (!instances.has(instanceName)) {
    instances.set(instanceName, {
      instanceName,
      status: 'connecting',
      created: new Date()
    });

    // Simular processo de conexão
    setTimeout(() => {
      const instance = instances.get(instanceName);
      if (instance) {
        instance.status = 'qr';
        instance.qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+s9J6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF8klEQVR4nO3dTY7bMAyGUXeVde9QZ+kOc5YuOmfpDXWWLjqHmI0RTOD+oCRLfhBCt78JJNuyLX54JAaO4zh+AfjdT//vArxNeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzhBeIEThBc4QXiBE4QXOEF4gROEFzjxF8wqRsFrJQJfAAAAAElFTkSuQmCC';
        console.log(`📱 Instance ${instanceName} ready with QR code`);
      }
    }, 2000);
  }

  res.json({
    instance: {
      instanceName,
      status: instances.get(instanceName)?.status || 'connecting',
      created: instances.get(instanceName)?.created || new Date()
    }
  });
});

// Obter QR Code
app.get('/instance/qrcode/:instanceName', (req, res) => {
  const { instanceName } = req.params;
  const instance = instances.get(instanceName);

  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }

  res.json({
    qrCode: instance.qrCode || null,
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
    status: instance.status,
    created: instance.created
  });
});

// Listar instâncias
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

// Enviar mensagem (simulado)
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

  console.log(`📤 Sending message to ${number}: ${text}`);

  res.json({
    key: { id: 'fake-message-id' },
    status: 'success'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Evolution API Lite (Simple) running on port ${PORT}`);
  console.log('📱 Development mode with QR code simulation');
});
