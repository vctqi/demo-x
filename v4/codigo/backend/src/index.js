const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const logger = require('./config/logger');
const { requestLogger, errorHandler } = require('./middlewares/validationMiddleware');
const { testConnection, syncModels } = require('./config/database');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e configuração
app.use(helmet()); // Adiciona headers de segurança
app.use(cors());   // Habilita CORS
app.use(express.json()); // Parse de JSON

// Middleware de logging
app.use(requestLogger);

// Rotas
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Função para inicializar o servidor
const iniciarServidor = async () => {
    try {
        // Testar conexão com o banco de dados
        await testConnection();
        
        // Sincronizar modelos com o banco de dados
        await syncModels();
        
        // Iniciar o servidor
        app.listen(PORT, () => {
            logger.info(`Servidor iniciado na porta ${PORT}`);
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error(`Falha ao iniciar o servidor: ${error.message}`);
        process.exit(1);
    }
};

// Tratamento de eventos do processo
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
});

// Iniciar o servidor
iniciarServidor();

// Exportar a aplicação para testes
module.exports = app;
