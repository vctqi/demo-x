const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { initializeDatabase } = require('./models');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const logger = require('./config/logger');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3002; // Mudando para porta 3002

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Rotas da API
app.use('/api', routes);

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API do Analisador de Risco de Cliente PJ via CNPJ',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      cnpj: '/api/cnpj/:cnpj'
    }
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar o servidor
const startServer = async () => {
  try {
    // Inicializar o banco de dados
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      logger.error('Falha ao inicializar o banco de dados. Encerrando aplicação.', { context: 'Server' });
      process.exit(1);
    }
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`, { context: 'Server' });
    });
  } catch (error) {
    logger.error(`Erro ao iniciar o servidor: ${error.message}`, { context: 'Server' });
    process.exit(1);
  }
};

// Tratamento de sinais para encerramento limpo
process.on('SIGINT', () => {
  logger.info('Recebido sinal SIGINT. Encerrando aplicação.', { context: 'Server' });
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Recebido sinal SIGTERM. Encerrando aplicação.', { context: 'Server' });
  process.exit(0);
});

// Capturar exceções não tratadas
process.on('uncaughtException', (error) => {
  logger.error(`Exceção não tratada: ${error.message}`, { context: 'Server', stack: error.stack });
  process.exit(1);
});

// Iniciar o servidor
startServer();