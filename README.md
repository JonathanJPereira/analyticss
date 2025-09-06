# Analytics Backend com WhatsApp

Sistema de analytics em Node.js 22.12 que envia notificações via WhatsApp quando usuários acessam o site ou executam ações.

## 🚀 Características

- **Duas rotas principais**: `/init` (entrada no site) e `/acao` (ações do usuário)
- **Notificações WhatsApp**: Mensagens automáticas para o número configurado
- **QR Code**: Autenticação inicial via QR code no terminal
- **Analytics**: Contador de sessões, ações e visitantes únicos
- **Status em tempo real**: Endpoint para verificar status do sistema

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar o servidor
npm start

# Ou executar em modo desenvolvimento (com auto-reload)
npm run dev
```

## 🔧 Configuração

O número do WhatsApp está configurado no código: `21988255211`

Para alterar, modifique a variável `targetNumber` no arquivo `server.js`:

```javascript
const targetNumber = '5521988255211'; // Seu número aqui
```

## 📱 Primeira Configuração do WhatsApp

1. Execute o servidor com `npm start`
2. Um QR code aparecerá no terminal
3. Abra o WhatsApp no celular
4. Vá em: **Configurações > Dispositivos conectados > Conectar dispositivo**
5. Escaneie o QR code
6. Aguarde a confirmação de conexão

## 🛠 Endpoints da API

### POST `/init`
Registra uma nova sessão (entrada no site)

**Body:**
```json
{
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Sessão registrada com sucesso",
  "sessionId": 1,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST `/acao`
Registra uma ação do usuário

**Body:**
```json
{
  "action": "clique_botao",
  "data": { "botao": "comprar", "produto": "123" },
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Ação registrada com sucesso",
  "actionId": 1,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET `/status`
Verifica o status do sistema

**Resposta:**
```json
{
  "server": "online",
  "whatsapp": "conectado",
  "analytics": {
    "sessions": 10,
    "actions": 25,
    "uniqueVisitors": 8
  },
  "uptime": 3600,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST `/test-whatsapp`
Testa o envio de mensagem WhatsApp

**Body:**
```json
{
  "message": "Mensagem de teste"
}
```

## 🌐 Exemplo de Uso no Frontend

### JavaScript Vanilla
```javascript
// Registrar entrada no site
fetch('http://localhost:3000/init', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })
});

// Registrar ação
function registrarAcao(acao, dados) {
  fetch('http://localhost:3000/acao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: acao,
      data: dados,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  });
}

// Exemplo de uso
registrarAcao('clique_botao', { botao: 'comprar', produto: 'abc123' });
```

## 📊 Notificações WhatsApp

O sistema envia duas tipos de notificações:

### 🔔 Nova Visita
```
🔔 Nova Visita no Site

👤 Sessões total: 15
🆔 Visitantes únicos: 12
🌐 IP: 192.168.1.1
🕒 Horário: 01/01/2024 12:00:00
📱 User Agent: Mozilla/5.0...
```

### ⚡ Nova Ação
```
⚡ Nova Ação no Site

🎯 Ação: clique_botao
📊 Total de ações: 25
👤 Visitor ID: 192.168.1.1
🕒 Horário: 01/01/2024 12:00:00
📋 Dados: {"botao":"comprar"}
📱 User Agent: Mozilla/5.0...
```

## 🔒 Segurança

- Não utiliza arquivos `.env` conforme solicitado
- Autenticação WhatsApp local via QR code
- Tratamento de erros robusto
- Logs detalhados de atividade

## 🚀 Execução

```bash
# Porta padrão: 3000
npm start

# O servidor estará disponível em:
http://localhost:3000
```

## 📝 Logs

O sistema gera logs detalhados no console:
- ✅ Sucessos (conexões, mensagens enviadas)
- ❌ Erros (falhas de conexão, mensagens)
- 📊 Analytics (sessões, ações)
- 🔄 Status (inicialização, shutdown)

## 🔧 Troubleshooting

### WhatsApp não conecta
1. Verifique se o QR code foi escaneado corretamente
2. Certifique-se que o WhatsApp está aberto no celular
3. Tente reiniciar o servidor

### Mensagens não são enviadas
1. Verifique se o WhatsApp está conectado (`/status`)
2. Confirme o número de destino no código
3. Teste com `/test-whatsapp`
