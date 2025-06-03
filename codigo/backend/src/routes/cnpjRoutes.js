const express = require('express');
const CNPJController = require('../controllers/CNPJController');

const router = express.Router();

/**
 * @route POST /api/cnpj/validate
 * @desc Valida um CNPJ
 * @access Public
 */
router.post('/validate', CNPJController.validateCNPJ);

/**
 * @route GET /api/cnpj/:cnpj
 * @desc Retorna os dados cadastrais de um CNPJ
 * @access Public
 */
router.get('/:cnpj', CNPJController.getCNPJData);

/**
 * @route GET /api/cnpj/:cnpj/analyze
 * @desc Analisa o risco de um CNPJ
 * @access Public
 */
router.get('/:cnpj/analyze', CNPJController.analyzeRisk);

module.exports = router;