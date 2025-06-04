const logger = require('../config/logger');

/**
 * Middleware para tratamento centralizado de erros
 */
const errorHandler = (err, req, res, next) => {
  // Definir status code padrão para erro
  const statusCode = err.statusCode || 500;
  
  // Logar o erro
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    context: 'ErrorHandler',
    stack: err.stack
  });
  
  // Responder com o erro
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Erro interno do servidor' : err.message
  });
};

module.exports = errorHandler;