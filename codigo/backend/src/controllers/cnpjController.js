const cnpjService = require('../services/cnpjService');
const logger = require('../config/logger');
const cnpjValidator = require('../utils/cnpjValidator');

/**
 * Controller para operações relacionadas a CNPJ
 */
class CnpjController {
  /**
   * Processa um CNPJ e retorna análise de risco
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async processCnpj(req, res, next) {
    try {
      const { cnpj } = req.params;
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      // Validar formato do CNPJ antes de continuar
      if (!cnpjValidator.validate(cnpjLimpo)) {
        logger.warn(`CNPJ inválido fornecido: ${cnpjLimpo}`, { context: 'CnpjController' });
        return res.status(400).json({
          status: 'error',
          message: 'O CNPJ fornecido é inválido. Verifique os dígitos e tente novamente.'
        });
      }
      
      logger.info(`Recebida requisição para processar CNPJ: ${cnpjLimpo}`, { context: 'CnpjController' });
      
      // Processar o CNPJ
      const result = await cnpjService.processCnpj(cnpjLimpo);
      
      // Verificar se o CNPJ não foi encontrado
      if (result.notFound) {
        return res.status(404).json({
          status: 'error',
          message: 'CNPJ não encontrado na base de dados.',
          cnpj: cnpjLimpo,
          cnpjFormatado: cnpjValidator.format(cnpjLimpo)
        });
      }
      
      // Formatar o CNPJ na resposta
      if (result.company) {
        result.company.cnpjFormatado = cnpjValidator.format(result.company.cnpj);
      }
      
      // Adicionar timestamp para caching
      const timestamp = new Date().toISOString();
      
      // Retornar o resultado
      res.status(200).json({
        status: 'success',
        timestamp,
        data: result
      });
    } catch (error) {
      logger.error(`Erro ao processar CNPJ: ${error.message}`, { context: 'CnpjController' });
      
      // Fornecer mensagem de erro mais amigável ao usuário
      const userMessage = this.getUserFriendlyErrorMessage(error);
      
      res.status(500).json({
        status: 'error',
        message: userMessage,
        error: process.env.NODE_ENV === 'production' ? undefined : error.message
      });
    }
  }
  
  /**
   * Traduz erros técnicos para mensagens amigáveis ao usuário
   * @param {Error} error - Objeto de erro
   * @returns {string} - Mensagem amigável
   */
  getUserFriendlyErrorMessage(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('validation error')) {
      return 'Erro de validação dos dados. Por favor, tente novamente.';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'A consulta à API externa demorou muito para responder. Por favor, tente novamente.';
    }
    
    if (errorMessage.includes('network error') || errorMessage.includes('econnrefused')) {
      return 'Erro de conexão com a API externa. Por favor, verifique sua conexão e tente novamente.';
    }
    
    return 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.';
  }
  
  /**
   * Verifica se um CNPJ é válido
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  validateCnpj(req, res) {
    try {
      const { cnpj } = req.body;
      
      if (!cnpj) {
        return res.status(400).json({
          status: 'error',
          message: 'CNPJ não fornecido.'
        });
      }
      
      const isValid = cnpjValidator.validate(cnpj);
      
      res.status(200).json({
        status: 'success',
        data: {
          cnpj,
          isValid
        }
      });
    } catch (error) {
      logger.error(`Erro ao validar CNPJ: ${error.message}`, { context: 'CnpjController' });
      res.status(500).json({
        status: 'error',
        message: 'Erro ao validar CNPJ.'
      });
    }
  }
}

module.exports = new CnpjController();