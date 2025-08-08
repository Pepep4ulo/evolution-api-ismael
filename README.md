# Evolution API no Render - Deploy Gratuito

Este é o setup para deploy do Evolution API no Render de forma 100% gratuita.

## Como fazer o deploy:

### 1. Preparar repositório
1. Crie um repositório no GitHub
2. Faça upload destes arquivos:
   - Dockerfile
   - render.yaml

### 2. Deploy no Render
1. Acesse https://render.com
2. Crie conta gratuita
3. Clique em "New" > "Web Service"
4. Conecte seu repositório GitHub
5. Escolha o plano FREE
6. Clique em "Create Web Service"

### 3. Configurar no seu bot
Após o deploy, você receberá uma URL como:
`https://evolution-api-ismael.onrender.com`

Use esta URL nas configurações do seu bot.

## Limites do plano gratuito:
- 750 horas por mês (suficiente para uso 24/7)
- Hiberna após 15 minutos sem uso
- Volta a funcionar automaticamente quando recebe uma requisição

## Após o deploy, configure no seu bot:

### 1. Pegar a URL do servidor
Após o deploy no Render, você receberá uma URL como:
`https://evolution-api-ismael.onrender.com`

### 2. Criar uma instância
Acesse no navegador:
`https://evolution-api-ismael.onrender.com/manager/instance/create`

Ou faça uma requisição POST para:
`https://evolution-api-ismael.onrender.com/instance/create`

Com o body:
```json
{
  "instanceName": "ismael-driver",
  "token": "sua-chave-personalizada-aqui"
}
```

### 3. Configurar no seu bot (Replit):
```
EVOLUTION_SERVER_URL=https://evolution-api-ismael.onrender.com
EVOLUTION_INSTANCE_NAME=ismael-driver  
EVOLUTION_API_KEY=sua-chave-personalizada-aqui
```

### 4. Conectar WhatsApp
Acesse: `https://evolution-api-ismael.onrender.com/instance/connect/ismael-driver`
Escaneie o QR Code com seu WhatsApp
