const Joi = require('joi');
const { isCnpjValid } = require('../utils/validators');

/**
 * Middleware to validate CNPJ format
 */
exports.validateCnpj = (req, res, next) => {
  const cnpj = req.params.cnpj;
  
  // Remove special characters for validation
  const cleanCnpj = cnpj.replace(/[^\d]/g, '');
  
  // Basic format validation
  if (cleanCnpj.length !== 14) {
    return res.status(400).json({
      error: {
        message: 'CNPJ deve conter 14 dígitos',
        code: 'INVALID_CNPJ_FORMAT'
      }
    });
  }
  
  // Algorithm validation
  if (!isCnpjValid(cleanCnpj)) {
    return res.status(400).json({
      error: {
        message: 'CNPJ inválido',
        code: 'INVALID_CNPJ'
      }
    });
  }
  
  // Add cleaned CNPJ to request for controllers
  req.cleanCnpj = cleanCnpj;
  next();
};

/**
 * Validate query parameters for pagination
 */
exports.validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });
  
  const { error, value } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        code: 'INVALID_QUERY_PARAMS'
      }
    });
  }
  
  // Add validated query params to request
  req.pagination = value;
  next();
};