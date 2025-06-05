const cnpjValidator = require('../utils/cnpjValidator');
const logger = require('../config/logger');

/**
 * Middleware para validação de CNPJ em requisições
 */
const validateCnpj = (req, res, next) => {
  try {
    const { cnpj } = req.params;
    
    // Validar formato do CNPJ
    if (!cnpj || !cnpjValidator.validate(cnpj)) {
      logger.warn(`CNPJ inválido: ${cnpj}`, { context: 'CnpjValidator' });
      
      return res.status(400).json({
        status: 'error',
        message: 'CNPJ inválido. Verifique o formato e os dígitos verificadores.'
      });
    }
    
    // Se válido, continuar
    next();
  } catch (error) {
    logger.error(`Erro ao validar CNPJ: ${error.message}`, { context: 'CnpjValidator' });
    next(error);
  }
};

module.exports = {
  validateCnpj
};