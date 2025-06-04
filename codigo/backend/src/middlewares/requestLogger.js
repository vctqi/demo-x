const logger = require('../config/logger');

/**
 * Middleware para logging de requisições HTTP
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Logar início da requisição
  logger.info(`${req.method} ${req.originalUrl}`, {
    context: 'HTTP',
    ip: req.ip
  });
  
  // Capturar finalização da requisição
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Definir nível de log baseado no status code
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    // Logar finalização da requisição
    logger[level](`${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`, {
      context: 'HTTP',
      statusCode,
      duration
    });
  });
  
  next();
};

module.exports = requestLogger;