const Joi = require('joi');
const { Company } = require('../models');
const cnpjValidator = require('../utils/cnpjValidator');
const cnpjApiService = require('../services/cnpjApiService');

/**
 * Controller for CNPJ-related endpoints
 */
const cnpjController = {
  /**
   * Validates a CNPJ
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  validateCnpj: async (req, res) => {
    try {
      // Validate request body
      const schema = Joi.object({
        cnpj: Joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message });
      }

      const { cnpj } = value;
      const isValid = cnpjValidator.isValidCnpj(cnpj);

      res.json({
        valid: isValid,
        formatted: isValid ? cnpjValidator.formatCnpj(cnpj) : null,
      });
    } catch (error) {
      console.error('Error validating CNPJ:', error);
      res.status(500).json({ error: true, message: 'Error validating CNPJ' });
    }
  },

  /**
   * Gets company information by CNPJ
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getCompanyInfo: async (req, res) => {
    try {
      const { cnpj } = req.params;
      
      // Validate CNPJ format
      if (!cnpjValidator.isValidCnpj(cnpj)) {
        return res.status(400).json({ error: true, message: 'CNPJ inválido' });
      }
      
      // Format CNPJ for consistency
      const formattedCnpj = cnpjValidator.formatCnpj(cnpj);
      const unformattedCnpj = cnpjValidator.unformatCnpj(cnpj);
      
      // Check if we already have this company in the database
      let company = await Company.findByPk(unformattedCnpj);
      
      if (!company) {
        // Fetch from API if not in database
        try {
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
      } else {
        // Update last consultation date
        await company.update({ lastConsultation: new Date() });
      }
      
      res.json({
        cnpj: formattedCnpj,
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
    } catch (error) {
      console.error('Error getting company info:', error);
      res.status(500).json({ error: true, message: 'Error retrieving company information' });
    }
  },
};

module.exports = cnpjController;