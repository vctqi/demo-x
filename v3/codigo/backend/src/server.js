const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const logger = require('./utils/logger');
const { testConnection, syncModels } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const CNAERepository = require('./repositories/CNAERepository');
const cnaeData = require('./utils/cnaeData');

// Inicializa o Express
const app = express();

// Configura middlewares
app.use(helmet()); // Segurança
app.use(cors()); // CORS
app.use(express.json()); // Parse de JSON
app.use(express.urlencoded({ extended: false })); // Parse de URL encoded

// Registra informações básicas das requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Configura as rotas da API
app.use('/api', routes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testa a conexão com o banco de dados
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('Falha ao conectar ao banco de dados. Abortando inicialização do servidor.');
      process.exit(1);
    }
    
    // Sincroniza os modelos com o banco de dados
    await syncModels();
    
    // Seed de dados iniciais para a tabela de CNAEs
    await CNAERepository.seedInitialData(cnaeData);
    
    // Inicia o servidor
    const PORT = config.server.port;
    
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Inicia o servidor
startServer();

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  logger.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejeição não tratada:', reason);
  process.exit(1);
});

module.exports = app; // Para testes