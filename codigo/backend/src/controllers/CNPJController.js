const CNPJService = require('../services/CNPJService');
const RiskAnalysisService = require('../services/RiskAnalysisService');
const logger = require('../utils/logger');

class CNPJController {
  /**
   * Valida um CNPJ
   * @param {Object} req Requisição Express
   * @param {Object} res Resposta Express
   */
  async validateCNPJ(req, res) {
    try {
      const { cnpj } = req.body;
      
      if (!cnpj) {
        return res.status(400).json({
          success: false,
          message: 'CNPJ não fornecido',
        });
      }
      
      const isValid = CNPJService.validateCNPJ(cnpj);
      
      return res.json({
        success: true,
        data: {
          cnpj,
          isValid,
          formatted: isValid ? CNPJService.formatCNPJ(cnpj) : null,
        },
      });
    } catch (error) {
      logger.error('Erro ao validar CNPJ:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao validar CNPJ',
        error: error.message,
      });
    }
  }

  /**
   * Consulta dados de um CNPJ
   * @param {Object} req Requisição Express
   * @param {Object} res Resposta Express
   */
  async getCNPJData(req, res) {
    try {
      const { cnpj } = req.params;
      
      if (!cnpj) {
        return res.status(400).json({
          success: false,
          message: 'CNPJ não fornecido',
        });
      }
      
      // Valida o CNPJ
      const isValid = CNPJService.validateCNPJ(cnpj);
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'CNPJ inválido',
        });
      }
      
      // Consulta os dados
      const companyData = await CNPJService.getCNPJData(cnpj);
      
      if (!companyData) {
        return res.status(404).json({
          success: false,
          message: 'CNPJ não encontrado',
        });
      }
      
      // Adiciona o CNPJ formatado e tempo de operação
      const formattedData = {
        ...companyData,
        formattedCNPJ: CNPJService.formatCNPJ(companyData.cnpj),
        operationTime: CNPJService.calculateOperationTime(companyData.dataAbertura),
      };
      
      return res.json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      logger.error('Erro ao consultar CNPJ:', error);
      
      if (error.message === 'CNPJ inválido') {
        return res.status(400).json({
          success: false,
          message: 'CNPJ inválido',
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao consultar CNPJ',
        error: error.message,
      });
    }
  }

  /**
   * Analisa o risco de um CNPJ
   * @param {Object} req Requisição Express
   * @param {Object} res Resposta Express
   */
  async analyzeRisk(req, res) {
    try {
      const { cnpj } = req.params;
      
      if (!cnpj) {
        return res.status(400).json({
          success: false,
          message: 'CNPJ não fornecido',
        });
      }
      
      // Valida o CNPJ
      const isValid = CNPJService.validateCNPJ(cnpj);
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'CNPJ inválido',
        });
      }
      
      // Analisa o risco
      const riskAnalysis = await RiskAnalysisService.analyzeRisk(cnpj);
      
      return res.json({
        success: true,
        data: riskAnalysis,
      });
    } catch (error) {
      logger.error('Erro ao analisar risco do CNPJ:', error);
      
      if (error.message === 'CNPJ inválido') {
        return res.status(400).json({
          success: false,
          message: 'CNPJ inválido',
        });
      }
      
      if (error.message === 'Empresa não encontrada') {
        return res.status(404).json({
          success: false,
          message: 'CNPJ não encontrado',
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao analisar risco do CNPJ',
        error: error.message,
      });
    }
  }
}

module.exports = new CNPJController();