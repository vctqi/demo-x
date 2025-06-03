const { Company, RiskAnalysis } = require('../models');
const cnpjValidator = require('../utils/cnpjValidator');
const cnpjApiService = require('../services/cnpjApiService');
const riskAnalyzerService = require('../services/riskAnalyzerService');

/**
 * Controller for risk analysis endpoints
 */
const riskController = {
  /**
   * Analyzes risk for a company by CNPJ
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  analyzeRisk: async (req, res) => {
    try {
      const { cnpj } = req.params;
      
      // Validate CNPJ format
      if (!cnpjValidator.isValidCnpj(cnpj)) {
        return res.status(400).json({ error: true, message: 'CNPJ inválido' });
      }
      
      // Format CNPJ for consistency
      const unformattedCnpj = cnpjValidator.unformatCnpj(cnpj);
      
      // Get company data (from database or API)
      let company = await Company.findByPk(unformattedCnpj);
      
      if (!company) {
        try {
          // Fetch from API if not in database
          const companyData = await cnpjApiService.fetchCompanyData(unformattedCnpj);
          
          // Save to database
          company = await Company.create({
            cnpj: unformattedCnpj,
            ...companyData,
          });
        } catch (apiError) {
          return res.status(404).json({ 
            error: true, 
            message: apiError.message || 'Erro ao consultar CNPJ'
          });
        }
      }
      
      // Check if we already have a recent risk analysis
      const ONE_HOUR = 60 * 60 * 1000;
      const latestAnalysis = await RiskAnalysis.findOne({
        where: { cnpj: unformattedCnpj },
        order: [['analysisDate', 'DESC']],
      });
      
      let riskAnalysis;
      
      if (latestAnalysis && (new Date() - new Date(latestAnalysis.analysisDate) < ONE_HOUR)) {
        // Use the existing analysis if it's recent
        riskAnalysis = latestAnalysis;
      } else {
        // Perform a new risk analysis
        const analysisResult = riskAnalyzerService.analyzeRisk({
          cnpj: unformattedCnpj,
          companyName: company.companyName,
          tradeName: company.tradeName,
          openingDate: company.openingDate,
          status: company.status,
          cnae: company.cnae,
          cnaeDescription: company.cnaeDescription,
          size: company.size,
          city: company.city,
          state: company.state,
        });
        
        // Save to database
        riskAnalysis = await RiskAnalysis.create(analysisResult);
      }
      
      // Return the analysis result
      res.json({
        cnpj: cnpjValidator.formatCnpj(unformattedCnpj),
        score: riskAnalysis.score,
        riskLevel: riskAnalysis.riskLevel,
        scoreFactors: riskAnalysis.scoreFactors,
        analysisDate: riskAnalysis.analysisDate,
        companyInfo: {
          companyName: company.companyName,
          tradeName: company.tradeName,
          openingDate: company.openingDate,
          status: company.status,
          cnae: company.cnae,
          cnaeDescription: company.cnaeDescription,
          size: company.size,
          city: company.city,
          state: company.state,
        },
      });
    } catch (error) {
      console.error('Error analyzing risk:', error);
      res.status(500).json({ error: true, message: 'Error analyzing company risk' });
    }
  },
};

module.exports = riskController;