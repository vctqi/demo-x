const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { validateCnpj } = require('../utils/cnpjValidator');
const { fetchCnpjData } = require('../services/cnpjService');
const { analyzeCompanyRisk } = require('../services/riskAnalyzerService');
const { getCachedCnpj, cacheCnpjResult } = require('../config/db');

/**
 * Validate CNPJ endpoint
 */
router.post('/validate-cnpj', async (req, res, next) => {
  try {
    // Validate request
    const schema = Joi.object({
      cnpj: Joi.string().required()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        isValid: false,
        message: error.details[0].message
      });
    }
    
    // Validate CNPJ format
    const isValid = validateCnpj(value.cnpj);
    
    return res.json({
      status: isValid ? 'success' : 'error',
      isValid,
      message: isValid ? null : 'CNPJ inválido'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Analyze CNPJ endpoint
 */
router.post('/analyze', async (req, res, next) => {
  try {
    // Validate request
    const schema = Joi.object({
      cnpj: Joi.string().required()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    
    const cnpj = value.cnpj;
    
    // Validate CNPJ format
    if (!validateCnpj(cnpj)) {
      return res.status(400).json({
        status: 'error',
        message: 'CNPJ inválido',
        code: 'INVALID_CNPJ'
      });
    }
    
    // Check cache first
    const cachedResult = await getCachedCnpj(cnpj);
    if (cachedResult) {
      return res.json({
        status: 'success',
        data: cachedResult,
        source: 'cache'
      });
    }
    
    // Fetch company data from API
    const companyData = await fetchCnpjData(cnpj);
    
    // Analyze company risk
    const riskAnalysis = await analyzeCompanyRisk(companyData);
    
    // Cache the result
    await cacheCnpjResult(
      cnpj, 
      companyData, 
      riskAnalysis.score, 
      riskAnalysis.level, 
      riskAnalysis.factors
    );
    
    // Return the result
    return res.json({
      status: 'success',
      data: {
        company: companyData,
        risk_analysis: riskAnalysis
      },
      source: 'api'
    });
  } catch (err) {
    // Handle specific errors
    if (err.message === 'CNPJ não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: 'CNPJ não encontrado',
        code: 'NOT_FOUND'
      });
    }
    
    next(err);
  }
});

module.exports = router;