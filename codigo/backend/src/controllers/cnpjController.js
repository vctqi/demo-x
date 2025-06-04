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
      
      logger.info(`Recebida requisição para processar CNPJ: ${cnpjLimpo}`, { context: 'CnpjController' });
      
      // Processar o CNPJ
      const result = await cnpjService.processCnpj(cnpjLimpo);
      
      // Verificar se o CNPJ não foi encontrado
      if (result.notFound) {
        return res.status(404).json({
          status: 'error',
          message: 'CNPJ não encontrado na base de dados.'
        });
      }
      
      // Formatar o CNPJ na resposta
      if (result.company) {
        result.company.cnpjFormatado = cnpjValidator.format(result.company.cnpj);
      }
      
      // Retornar o resultado
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      logger.error(`Erro ao processar CNPJ: ${error.message}`, { context: 'CnpjController' });
      next(error);
    }
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