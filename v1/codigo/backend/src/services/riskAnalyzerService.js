/**
 * Service for analyzing company risk based on CNPJ data
 */
class RiskAnalyzerService {
  /**
   * Calculates risk score for a company based on its data
   * @param {Object} companyData - Company data from the API
   * @returns {Object} - Risk analysis result
   */
  analyzeRisk(companyData) {
    // Initialize score and factors
    let score = 0;
    const factors = [];
    
    // 1. Check company status
    if (companyData.status.toLowerCase() === 'ativa') {
      score += 10;
      factors.push({
        factor: 'Situação cadastral ativa',
        impact: 10,
        description: 'Empresa com situação cadastral regular',
      });
    } else {
      score -= 20;
      factors.push({
        factor: 'Situação cadastral irregular',
        impact: -20,
        description: `Situação cadastral: ${companyData.status}`,
      });
    }
    
    // 2. Check company age
    const openingDate = new Date(companyData.openingDate);
    const now = new Date();
    const ageInYears = (now - openingDate) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (ageInYears >= 3) {
      score += 10;
      factors.push({
        factor: 'Tempo de operação',
        impact: 10,
        description: 'Empresa com mais de 3 anos de operação',
      });
    } else if (ageInYears < 0.5) {
      score -= 10;
      factors.push({
        factor: 'Empresa recente',
        impact: -10,
        description: 'Empresa aberta há menos de 6 meses',
      });
    }
    
    // 3. Check CNAE risk
    const riskyCnaes = this._getHighRiskCnaes();
    const lowRiskCnaes = this._getLowRiskCnaes();
    
    if (riskyCnaes.includes(companyData.cnae)) {
      score -= 10;
      factors.push({
        factor: 'CNAE de alto risco',
        impact: -10,
        description: `CNAE ${companyData.cnae} (${companyData.cnaeDescription}) é considerado de alto risco`,
      });
    } else if (lowRiskCnaes.includes(companyData.cnae)) {
      score += 10;
      factors.push({
        factor: 'CNAE de baixo risco',
        impact: 10,
        description: `CNAE ${companyData.cnae} (${companyData.cnaeDescription}) é considerado de baixo risco`,
      });
    }
    
    // Determine risk level based on score
    let riskLevel;
    if (score >= 20) {
      riskLevel = 'Baixo';
    } else if (score >= 0) {
      riskLevel = 'Médio';
    } else {
      riskLevel = 'Alto';
    }
    
    return {
      cnpj: companyData.cnpj,
      score,
      riskLevel,
      scoreFactors: factors,
      analysisDate: new Date(),
    };
  }
  
  /**
   * Returns a list of CNAEs considered high risk
   * @returns {string[]} - List of high risk CNAE codes
   * @private
   */
  _getHighRiskCnaes() {
    // This is a simplified list - in a real app this would be more comprehensive
    return [
      '6499999', // Factoring
      '6434400', // Sociedades de crédito
      '4120400', // Construção de edifícios
      '9200301', // Casas de bingo
      '9200302', // Cassinos
      '9200399', // Exploração de jogos de azar
    ];
  }
  
  /**
   * Returns a list of CNAEs considered low risk
   * @returns {string[]} - List of low risk CNAE codes
   * @private
   */
  _getLowRiskCnaes() {
    // This is a simplified list - in a real app this would be more comprehensive
    return [
      '8599604', // Educação
      '6201501', // Desenvolvimento de software
      '8610101', // Atividades de atendimento hospitalar
      '4751201', // Comércio varejista de produtos de informática
      '4761003', // Comércio varejista de artigos de papelaria
    ];
  }
}

module.exports = new RiskAnalyzerService();