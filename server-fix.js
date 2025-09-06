const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const port = 3000;

// Middleware CORS
app.use(cors({
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para JSON
app.use(express.json());

// Configuração do cliente WhatsApp com configurações para servidor
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ],
        executablePath: '/usr/bin/google-chrome-stable' // Caminho do Chrome no Ubuntu
    }
});

// Estado da aplicação
let whatsappReady = false;
const targetNumber = '5521988255211';
const analyticsData = {
    sessions: 0,
    actions: 0,
    visitors: new Set()
};

// Eventos do WhatsApp
client.on('qr', (qr) => {
    console.log('\n🔗 ESCANEIE O QR CODE ABAIXO PARA CONECTAR O WHATSAPP:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n⚠️  Abra o WhatsApp no seu celular e escaneie o código acima');
    console.log('📱 Vá em: Configurações > Dispositivos conectados > Conectar dispositivo\n');
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado com sucesso!');
    whatsappReady = true;
    sendWhatsAppMessage('🚀 Sistema de Analytics iniciado e conectado!');
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp autenticado!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp desconectado:', reason);
    whatsappReady = false;
});

// Função para enviar mensagem WhatsApp
async function sendWhatsAppMessage(message) {
    if (!whatsappReady) {
        console.log('⚠️  WhatsApp não está pronto. Mensagem não enviada:', message);
        return false;
    }
    
    try {
        await client.sendMessage(targetNumber + '@c.us', message);
        console.log('📱 Mensagem enviada via WhatsApp:', message);
        return true;
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem WhatsApp:', error);
        return false;
    }
}

// Rota /init
app.post('/init', async (req, res) => {
    try {
        const { userAgent, ip, timestamp = new Date().toISOString() } = req.body;
        
        analyticsData.sessions++;
        const visitorId = ip || req.ip || 'unknown';
        analyticsData.visitors.add(visitorId);
        
        console.log(`📊 Nova sessão iniciada - Total: ${analyticsData.sessions}`);
        
        const message = `🔔 *Nova Visita no Site*\n\n` +
                       `👤 Sessões total: ${analyticsData.sessions}\n` +
                       `🆔 Visitantes únicos: ${analyticsData.visitors.size}\n` +
                       `🌐 IP: ${visitorId}\n` +
                       `🕒 Horário: ${new Date(timestamp).toLocaleString('pt-BR')}\n` +
                       `📱 User Agent: ${userAgent || 'Não informado'}`;
        
        await sendWhatsAppMessage(message);
        
        res.json({
            success: true,
            message: 'Sessão registrada com sucesso',
            sessionId: analyticsData.sessions,
            timestamp: timestamp
        });
        
    } catch (error) {
        console.error('❌ Erro na rota /init:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota /acao
app.post('/acao', async (req, res) => {
    try {
        const { 
            action, 
            data, 
            userAgent, 
            ip, 
            timestamp = new Date().toISOString() 
        } = req.body;
        
        analyticsData.actions++;
        const visitorId = ip || req.ip || 'unknown';
        
        console.log(`🎯 Nova ação registrada: ${action} - Total: ${analyticsData.actions}`);
        
        const message = `⚡ *Nova Ação no Site*\n\n` +
                       `🎯 Ação: ${action || 'Não especificada'}\n` +
                       `📊 Total de ações: ${analyticsData.actions}\n` +
                       `👤 Visitor ID: ${visitorId}\n` +
                       `🕒 Horário: ${new Date(timestamp).toLocaleString('pt-BR')}\n` +
                       `📋 Dados: ${data ? JSON.stringify(data) : 'Nenhum'}\n` +
                       `📱 User Agent: ${userAgent || 'Não informado'}`;
        
        await sendWhatsAppMessage(message);
        
        res.json({
            success: true,
            message: 'Ação registrada com sucesso',
            actionId: analyticsData.actions,
            timestamp: timestamp
        });
        
    } catch (error) {
        console.error('❌ Erro na rota /acao:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota de status
app.get('/status', (req, res) => {
    res.json({
        server: 'online',
        whatsapp: whatsappReady ? 'conectado' : 'desconectado',
        analytics: {
            sessions: analyticsData.sessions,
            actions: analyticsData.actions,
            uniqueVisitors: analyticsData.visitors.size
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Rota de teste WhatsApp
app.post('/test-whatsapp', async (req, res) => {
    const { message = 'Teste de mensagem do sistema de analytics' } = req.body;
    
    const success = await sendWhatsAppMessage(`🧪 ${message}`);
    
    res.json({
        success,
        whatsappReady,
        message: success ? 'Mensagem enviada' : 'Falha ao enviar mensagem'
    });
});

// Middleware para logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Inicializar WhatsApp
console.log('🔄 Inicializando cliente WhatsApp...');
client.initialize();

// Inicializar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📊 Analytics Backend iniciado`);
    console.log(`📱 Notificações serão enviadas para: ${targetNumber}`);
    console.log('\n📋 Rotas disponíveis:');
    console.log(`   POST http://52.15.124.72:${port}/init`);
    console.log(`   POST http://52.15.124.72:${port}/acao`);
    console.log(`   GET  http://52.15.124.72:${port}/status`);
    console.log(`   POST http://52.15.124.72:${port}/test-whatsapp`);
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada:', reason);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Desligando servidor...');
    client.destroy();
    process.exit(0);
});
