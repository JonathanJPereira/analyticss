# 🚀 Início Rápido - Analytics Backend

## Para iniciar o sistema:

```bash
# 1. Executar o servidor
npm start

# 2. Escanear QR Code no terminal
# (use o WhatsApp do seu celular)

# 3. Aguardar mensagem de confirmação
```

## 📱 Configuração WhatsApp:
- Abra WhatsApp no celular
- Vá em: **Configurações → Dispositivos conectados → Conectar dispositivo**
- Escaneie o QR code que aparece no terminal
- Aguarde confirmação: "Sistema de Analytics iniciado e conectado!"

## 🧪 Testar o sistema:

```bash
# Teste 1: Nova visita
curl -X POST http://localhost:3000/init \
  -H "Content-Type: application/json" \
  -d '{"userAgent":"curl/test","ip":"127.0.0.1"}'

# Teste 2: Nova ação
curl -X POST http://localhost:3000/acao \
  -H "Content-Type: application/json" \
  -d '{"action":"teste","data":{"origem":"curl"}}'

# Teste 3: Status
curl http://localhost:3000/status

# Teste 4: WhatsApp
curl -X POST http://localhost:3000/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message":"Teste via curl"}'
```

## 🌐 Teste com navegador:
Abra o arquivo: `exemplo-frontend.html` no navegador

## 📊 Rotas disponíveis:
- `POST /init` - Registra entrada no site
- `POST /acao` - Registra ação do usuário  
- `GET /status` - Status do sistema
- `POST /test-whatsapp` - Teste WhatsApp

## 📱 Notificações WhatsApp:
Serão enviadas para: **21988255211**

## ❓ Problemas?
1. Verifique se o Node.js está instalado (v18+)
2. Execute `npm install` se necessário
3. Certifique-se que a porta 3000 está livre
4. Para WhatsApp: escaneie o QR code novamente se desconectar
