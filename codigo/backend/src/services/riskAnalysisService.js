const { CNAECategory } = require('../models');
const logger = require('../config/logger');

/**
 * Serviço para análise de risco de empresas
 */
class RiskAnalysisService {
  /**
   * Calcula o score de risco com base nos dados da empresa
   * @param {Object} companyData - Dados da empresa
   * @returns {Promise<Object>} - Resultado da análise de risco
   */
  async analyzeRisk(companyData) {
    logger.info(`Iniciando análise de risco para CNPJ ${companyData.cnpj}`, { context: 'RiskAnalysisService' });
    
    try {
      let score = 0;
      const factors = {
        positive: [],
        negative: []
      };
      
      // Verificar situação cadastral
      if (this.isActive(companyData.situacao)) {
        score += 10;
        factors.positive.push('Empresa com situação cadastral ativa (+10)');
      } else {
        score -= 20;
        factors.negative.push('Empresa com situação cadastral não ativa (-20)');
      }
      
      // Verificar tempo de operação
      const operationTime = this.calculateOperationTime(companyData.dataAbertura);
      
      if (operationTime >= 3) {
        score += 10;
        factors.positive.push('Empresa com mais de 3 anos de operação (+10)');
      } else if (operationTime < 0.5) {
        score -= 10;
        factors.negative.push('Empresa com menos de 6 meses de operação (-10)');
      }
      
      // Verificar categoria de risco do CNAE
      const cnaeRisk = await this.getCnaeRiskLevel(companyData.cnae);
      
      if (cnaeRisk === 'HIGH') {
        score -= 10;
        factors.negative.push(`CNAE ${companyData.cnae} classificado como alto risco (-10)`);
      } else if (cnaeRisk === 'LOW') {
        score += 10;
        factors.positive.push(`CNAE ${companyData.cnae} classificado como baixo risco (+10)`);
      }
      
      // Determinar nível de risco com base no score
      const riskLevel = this.determineRiskLevel(score);
      
      logger.info(`Análise de risco concluída para CNPJ ${companyData.cnpj}. Score: ${score}, Risco: ${riskLevel}`, 
        { context: 'RiskAnalysisService' });
      
      return {
        score,
        riskLevel,
        factors
      };
    } catch (error) {
      logger.error(`Erro ao analisar risco: ${error.message}`, { context: 'RiskAnalysisService' });
      throw error;
    }
  }
  
  /**
   * Verifica se a situação cadastral da empresa é ativa
   * @param {string} situacao - Situação cadastral da empresa
   * @returns {boolean} - True se ativa, false caso contrário
   */
  isActive(situacao) {
    // Verificar se a situação é "ativa" (ignorando case e acentos)
    return situacao && situacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 'ativa';
  }
  
  /**
   * Calcula o tempo de operação da empresa em anos
   * @param {string} dataAbertura - Data de abertura da empresa (YYYY-MM-DD)
   * @returns {number} - Tempo de operação em anos
   */
  calculateOperationTime(dataAbertura) {
    if (!dataAbertura) return 0;
    
    try {
      const today = new Date();
      const openingDate = new Date(dataAbertura);
      
      // Calcular a diferença em anos
      const diffTime = today - openingDate;
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      
      return diffYears;
    } catch (error) {
      logger.error(`Erro ao calcular tempo de operação: ${error.message}`, { context: 'RiskAnalysisService' });
      return 0;
    }
  }
  
  /**
   * Obtém o nível de risco associado a um CNAE
   * @param {string} cnaeCode - Código do CNAE
   * @returns {Promise<string>} - Nível de risco ('HIGH', 'LOW' ou 'NEUTRAL')
   */
  async getCnaeRiskLevel(cnaeCode) {
    try {
      if (!cnaeCode) return 'NEUTRAL';
      
      // Formatar o código para garantir o padrão esperado (XXXX-X/XX)
      const formattedCode = this.formatCnaeCode(cnaeCode);
      
      // Buscar na base de dados
      const cnaeCategory = await CNAECategory.findByPk(formattedCode);
      
      if (cnaeCategory) {
        return cnaeCategory.riskLevel;
      }
      
      // Se não encontrar, considerar como risco neutro
      return 'NEUTRAL';
    } catch (error) {
      logger.error(`Erro ao verificar risco do CNAE: ${error.message}`, { context: 'RiskAnalysisService' });
      return 'NEUTRAL';
    }
  }
  
  /**
   * Formata o código CNAE para o padrão XXXX-X/XX
   * @param {string} cnaeCode - Código CNAE em qualquer formato
   * @returns {string} - Código CNAE formatado
   */
  formatCnaeCode(cnaeCode) {
    // Remover todos os caracteres não numéricos
    const cleaned = cnaeCode.replace(/[^\d]/g, '');
    
    // Se o código limpo tiver 7 dígitos, formatar como XXXX-X/XX
    if (cleaned.length === 7) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 5)}/${cleaned.slice(5)}`;
    }
    
    // Retornar o código original se não conseguir formatar
    return cnaeCode;
  }
  
  /**
   * Determina o nível de risco com base no score
   * @param {number} score - Score calculado
   * @returns {string} - Nível de risco ('BAIXO', 'MÉDIO' ou 'ALTO')
   */
  determineRiskLevel(score) {
    if (score >= 20) {
      return 'BAIXO';
    } else if (score >= 0) {
      return 'MÉDIO';
    } else {
      return 'ALTO';
    }
  }
}

module.exports = new RiskAnalysisService();