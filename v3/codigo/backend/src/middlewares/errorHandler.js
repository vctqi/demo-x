const logger = require('../utils/logger');

/**
 * Middleware para tratamento de erros da API
 */
const errorHandler = (err, req, res, next) => {
  // Gera um ID único para o erro
  const errorId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  
  // Registra o erro com detalhes
  logger.error(`Erro [${errorId}]:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    params: req.params,
    headers: req.headers,
  });

  // Determina o status HTTP com base no tipo de erro
  let statusCode = 500;
  let errorMessage = 'Erro interno do servidor';
  
  if (err.name === 'ValidationError' || err.message === 'CNPJ inválido') {
    statusCode = 400;
    errorMessage = err.message || 'Dados de entrada inválidos';
  } else if (err.message === 'Empresa não encontrada' || err.message === 'CNPJ não encontrado') {
    statusCode = 404;
    errorMessage = err.message;
  } else if (err.message.includes('Falha ao consultar CNPJ')) {
    statusCode = 503;
    errorMessage = 'Serviço de consulta de CNPJ temporariamente indisponível';
  }

  // Envia resposta de erro
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errorId, // Inclui o ID do erro para referência
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;