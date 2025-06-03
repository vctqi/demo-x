/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Default error response
  const errorResponse = {
    status: 'error',
    message: 'Ocorreu um erro no servidor'
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.message = err.message;
    return res.status(400).json(errorResponse);
  }
  
  if (err.name === 'AbortError' || err.message.includes('timeout')) {
    errorResponse.message = 'A consulta demorou muito tempo. Tente novamente mais tarde.';
    errorResponse.code = 'TIMEOUT';
    return res.status(504).json(errorResponse);
  }
  
  if (err.message.includes('CNPJ não encontrado')) {
    errorResponse.message = 'CNPJ não encontrado';
    errorResponse.code = 'NOT_FOUND';
    return res.status(404).json(errorResponse);
  }
  
  if (err.code === 'ECONNREFUSED' || err.name === 'FetchError') {
    errorResponse.message = 'Não foi possível conectar ao serviço externo. Tente novamente mais tarde.';
    errorResponse.code = 'EXTERNAL_SERVICE_ERROR';
    return res.status(503).json(errorResponse);
  }
  
  // For all other errors, return a generic server error
  return res.status(500).json(errorResponse);
}

module.exports = errorHandler;