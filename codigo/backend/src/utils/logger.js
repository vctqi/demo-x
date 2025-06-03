const winston = require('winston');
const config = require('../config/config');

// Configuração do formato de log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configuração do nível de log baseado no ambiente
const logLevel = config.server.nodeEnv === 'production' ? 'info' : 'debug';

// Criação do logger
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'analisador-risco-cnpj' },
  transports: [
    // Logs de erro e acima vão para 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Todos os logs vão para 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Se não estiver em produção, também exibe logs no console
if (config.server.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;