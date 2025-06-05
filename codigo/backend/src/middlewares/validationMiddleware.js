const Joi = require('joi');
const logger = require('../config/logger');

/**
 * Middleware para validação de CNPJ
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
const validarCNPJ = (req, res, next) => {
    const schema = Joi.object({
        cnpj: Joi.string()
            .pattern(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'CNPJ deve estar no formato 00000000000000 ou 00.000.000/0000-00',
                'string.empty': 'CNPJ é obrigatório',
                'any.required': 'CNPJ é obrigatório'
            })
    });
    
    const { error } = schema.validate({ cnpj: req.params.cnpj });
    
    if (error) {
        logger.warn(`Validação de CNPJ falhou: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
    
    next();
};

/**
 * Middleware de log para requisições HTTP
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log no início da requisição
    logger.info(`${req.method} ${req.originalUrl} iniciado`);
    
    // Interceptar o final da requisição
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} concluído em ${duration}ms`;
        
        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });
    
    next();
};

/**
 * Middleware de tratamento de erros
 * @param {Error} err - Erro ocorrido
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
const errorHandler = (err, req, res, next) => {
    logger.error(`Erro não tratado: ${err.message}`);
    logger.error(err.stack);
    
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro ao processar sua solicitação'
    });
};

module.exports = {
    validarCNPJ,
    requestLogger,
    errorHandler
};