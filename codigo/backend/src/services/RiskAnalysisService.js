const config = require('../config/config');
const logger = require('../utils/logger');
const CNAERepository = require('../repositories/CNAERepository');
const CNPJService = require('./CNPJService');
const CompanyRepository = require('../repositories/CompanyRepository');

class RiskAnalysisService {
  constructor() {
    this.criteria = config.riskScoring.criteria;
    this.thresholds = config.riskScoring.thresholds;
  }

  /**
   * Calcula o score de risco para uma empresa
   * @param {Object} companyData Dados da empresa
   * @returns {Promise<Object>} Score e nível de risco
   */
  async calculateRiskScore(companyData) {
    if (!companyData) {
      throw new Error('Dados da empresa não fornecidos');
    }

    logger.info(`Calculando score de risco para CNPJ ${companyData.cnpj}`);
    
    // Inicializa array para armazenar os critérios aplicados
    const appliedCriteria = [];
    let totalScore = 0;

    // 1. Critério: Situação cadastral
    if (companyData.situacaoCadastral && companyData.situacaoCadastral.toLowerCase() === 'ativa') {
      totalScore += this.criteria.activeStatus;
      appliedCriteria.push({
        name: 'Empresa com situação ativa',
        points: this.criteria.activeStatus,
        impact: 'positive'
      });
    } else {
      totalScore += this.criteria.inactiveStatus;
      appliedCriteria.push({
        name: 'Empresa inativa/suspensa/baixada',
        points: this.criteria.inactiveStatus,
        impact: 'negative'
      });
    }

    // 2. Critério: Tempo de operação
    if (companyData.dataAbertura) {
      const operationYears = CNPJService.calculateOperationTime(companyData.dataAbertura);
      
      if (operationYears >= 3) {
        totalScore += this.criteria.moreThan3Years;
        appliedCriteria.push({
          name: 'Mais de 3 anos de operação',
          points: this.criteria.moreThan3Years,
          impact: 'positive'
        });
      } else if (operationYears < 0.5) { // Menos de 6 meses
        totalScore += this.criteria.lessThan6Months;
        appliedCriteria.push({
          name: 'Empresa aberta há menos de 6 meses',
          points: this.criteria.lessThan6Months,
          impact: 'negative'
        });
      } else if (operationYears < 1) { // Entre 6 meses e 1 ano
        totalScore += this.criteria.between6MonthsAnd1Year;
        appliedCriteria.push({
          name: 'Empresa aberta entre 6 meses e 1 ano',
          points: this.criteria.between6MonthsAnd1Year,
          impact: 'negative'
        });
      }
    }

    // 3. Critério: Classificação do CNAE
    if (companyData.cnaePrincipal) {
      // Busca a classificação do CNAE no banco de dados
      const cnae = await CNAERepository.findByCodigo(companyData.cnaePrincipal);
      
      if (cnae) {
        totalScore += cnae.pontuacao;
        
        let impact = 'neutral';
        if (cnae.pontuacao > 0) impact = 'positive';
        if (cnae.pontuacao < 0) impact = 'negative';
        
        appliedCriteria.push({
          name: `CNAE de ${cnae.nivelRisco.toLowerCase()} risco (${companyData.cnaePrincipal} - ${companyData.cnaeDescricao})`,
          points: cnae.pontuacao,
          impact
        });
      } else {
        // Se não encontrou o CNAE, usa a pontuação padrão para risco médio
        totalScore += this.criteria.mediumRiskCnae;
        appliedCriteria.push({
          name: `CNAE não classificado (${companyData.cnaePrincipal} - ${companyData.cnaeDescricao})`,
          points: this.criteria.mediumRiskCnae,
          impact: 'neutral'
        });
      }
    }

    // Determina o nível de risco com base no score total
    let riskLevel;
    if (totalScore >= this.thresholds.lowRisk) {
      riskLevel = 'Baixo';
    } else if (totalScore >= this.thresholds.mediumRisk) {
      riskLevel = 'Médio';
    } else {
      riskLevel = 'Alto';
    }

    logger.info(`Score calculado para CNPJ ${companyData.cnpj}: ${totalScore} (${riskLevel})`);

    // Atualiza o score e o nível de risco no banco de dados
    await CompanyRepository.saveCompany({
      ...companyData,
      score: totalScore,
      riskLevel
    });

    return {
      score: totalScore,
      riskLevel,
      appliedCriteria
    };
  }

  /**
   * Analisa o risco de uma empresa com base no CNPJ
   * @param {string} cnpj CNPJ com ou sem formatação
   * @returns {Promise<Object>} Dados da empresa com análise de risco
   */
  async analyzeRisk(cnpj) {
    // Obtém os dados da empresa
    const companyData = await CNPJService.getCNPJData(cnpj);
    
    if (!companyData) {
      throw new Error('Empresa não encontrada');
    }
    
    // Calcula o score de risco
    const riskAnalysis = await this.calculateRiskScore(companyData);
    
    // Retorna os dados completos
    return {
      company: {
        ...companyData,
        score: riskAnalysis.score,
        riskLevel: riskAnalysis.riskLevel,
        formattedCNPJ: CNPJService.formatCNPJ(companyData.cnpj),
        operationTime: CNPJService.calculateOperationTime(companyData.dataAbertura)
      },
      riskAnalysis: {
        score: riskAnalysis.score,
        riskLevel: riskAnalysis.riskLevel,
        appliedCriteria: riskAnalysis.appliedCriteria
      }
    };
  }
}

module.exports = new RiskAnalysisService();