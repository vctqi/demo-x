const Joi = require('joi');
const { ConsultationHistory, Company } = require('../models');
const cnpjValidator = require('../utils/cnpjValidator');

/**
 * Controller for consultation history endpoints
 */
const historyController = {
  /**
   * Adds a CNPJ consultation to history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addToHistory: async (req, res) => {
    try {
      // Validate request body
      const schema = Joi.object({
        cnpj: Joi.string().required(),
        userSession: Joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message });
      }

      const { cnpj, userSession } = value;
      
      // Validate CNPJ format
      if (!cnpjValidator.isValidCnpj(cnpj)) {
        return res.status(400).json({ error: true, message: 'CNPJ inválido' });
      }
      
      // Format CNPJ for consistency
      const unformattedCnpj = cnpjValidator.unformatCnpj(cnpj);
      
      // Check if the company exists in our database
      const company = await Company.findByPk(unformattedCnpj);
      
      if (!company) {
        return res.status(404).json({ error: true, message: 'Empresa não encontrada' });
      }
      
      // Add to history
      const historyEntry = await ConsultationHistory.create({
        cnpj: unformattedCnpj,
        userSession,
        consultationDate: new Date(),
      });
      
      res.status(201).json({
        id: historyEntry.id,
        cnpj: cnpjValidator.formatCnpj(unformattedCnpj),
        consultationDate: historyEntry.consultationDate,
      });
    } catch (error) {
      console.error('Error adding to history:', error);
      res.status(500).json({ error: true, message: 'Error adding consultation to history' });
    }
  },

  /**
   * Gets consultation history for a session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getHistory: async (req, res) => {
    try {
      // Get userSession from query params
      const { userSession } = req.query;
      
      if (!userSession) {
        return res.status(400).json({ error: true, message: 'userSession parameter is required' });
      }
      
      // Get history for this session, limited to the last 10 entries
      const history = await ConsultationHistory.findAll({
        where: { userSession },
        include: [{ model: Company }],
        order: [['consultationDate', 'DESC']],
        limit: 10,
      });
      
      // Format the response
      const formattedHistory = history.map(entry => ({
        id: entry.id,
        cnpj: cnpjValidator.formatCnpj(entry.cnpj),
        consultationDate: entry.consultationDate,
        companyName: entry.Company ? entry.Company.companyName : null,
      }));
      
      res.json(formattedHistory);
    } catch (error) {
      console.error('Error getting history:', error);
      res.status(500).json({ error: true, message: 'Error retrieving consultation history' });
    }
  },
};

module.exports = historyController;