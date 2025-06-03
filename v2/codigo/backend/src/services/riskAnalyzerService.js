const { getAllSettings } = require('../config/db');

/**
 * Analyzes the risk of a company based on its data
 * @param {Object} companyData - The company data from the CNPJ API
 * @returns {Promise<Object>} The risk analysis results
 */
async function analyzeCompanyRisk(companyData) {
  try {
    // Get all settings for risk analysis
    const settings = await getAllSettings();
    
    // Initialize score and factors
    let score = 0;
    const factors = [];
    const alerts = [];
    
    // Calculate score based on situacao_cadastral (active status)
    if (companyData.situacao_cadastral && companyData.situacao_cadastral.toUpperCase() === 'ATIVA') {
      const points = parseInt(settings.score_active, 10);
      score += points;
      factors.push({
        description: 'Empresa ativa',
        impact: points
      });
    } else {
      const points = parseInt(settings.score_inactive, 10);
      score += points;
      factors.push({
        description: 'Empresa não ativa',
        impact: points
      });
      alerts.push('Situação cadastral irregular');
    }
    
    // Calculate score based on company age
    if (companyData.data_abertura && companyData.data_abertura !== 'Não informado') {
      const openingDate = new Date(companyData.data_abertura);
      const today = new Date();
      const diffTime = Math.abs(today - openingDate);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      
      if (diffYears >= 3) {
        const points = parseInt(settings.score_over_3_years, 10);
        score += points;
        factors.push({
          description: 'Mais de 3 anos de operação',
          impact: points
        });
      } else if (diffYears < 0.5) {
        const points = parseInt(settings.score_under_6_months, 10);
        score += points;
        factors.push({
          description: 'Empresa aberta há menos de 6 meses',
          impact: points
        });
        alerts.push('Empresa recém-aberta');
      }
    }
    
    // Calculate score based on CNAE (high risk or not)
    if (companyData.cnae_principal && companyData.cnae_principal.codigo !== 'Não informado') {
      const highRiskCnaes = settings.high_risk_cnae.split(',');
      const cnaeCode = companyData.cnae_principal.codigo;
      
      if (highRiskCnaes.includes(cnaeCode)) {
        const points = parseInt(settings.score_high_risk_cnae, 10);
        score += points;
        factors.push({
          description: 'CNAE de alto risco',
          impact: points
        });
        alerts.push('CNAE com risco associado');
      } else {
        const points = parseInt(settings.score_low_risk_cnae, 10);
        score += points;
        factors.push({
          description: 'CNAE de baixo risco',
          impact: points
        });
      }
    }
    
    // Determine risk level based on score
    let riskLevel;
    if (score >= parseInt(settings.threshold_low_risk, 10)) {
      riskLevel = 'BAIXO';
    } else if (score >= parseInt(settings.threshold_medium_risk, 10)) {
      riskLevel = 'MÉDIO';
    } else {
      riskLevel = 'ALTO';
    }
    
    return {
      score,
      level: riskLevel,
      factors,
      alerts
    };
  } catch (error) {
    console.error('Error in risk analysis:', error);
    throw new Error('Falha ao analisar risco da empresa');
  }
}

module.exports = {
  analyzeCompanyRisk
};