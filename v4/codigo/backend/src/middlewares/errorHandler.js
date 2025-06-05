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
  
  // Mensagem amigável para o usuário
  let userMessage = err.message;
  
  // Para erros 500, fornecer mensagem genérica em produção
  if (statusCode === 500) {
    userMessage = getUserFriendlyErrorMessage(err);
  }
  
  // Responder com o erro
  res.status(statusCode).json({
    status: 'error',
    message: userMessage,
    // Incluir detalhes técnicos apenas em ambiente não-produção
    details: process.env.NODE_ENV === 'production' ? undefined : {
      error: err.message,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Converte erros técnicos em mensagens amigáveis para o usuário
 * @param {Error} err - O erro ocorrido
 * @returns {string} - Mensagem amigável
 */
function getUserFriendlyErrorMessage(err) {
  const errorMessage = err.message.toLowerCase();
  
  if (errorMessage.includes('validation error')) {
    return 'Erro de validação nos dados. Por favor, verifique as informações e tente novamente.';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'O serviço está demorando para responder. Por favor, tente novamente mais tarde.';
  }
  
  if (errorMessage.includes('database') || errorMessage.includes('sequelize')) {
    return 'Erro ao acessar o banco de dados. Por favor, tente novamente mais tarde.';
  }
  
  return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
}

module.exports = errorHandler;