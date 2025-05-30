const express = require('express');
const cnpjController = require('../controllers/cnpj.controller');
const { validateCnpj } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/cnpj/validate/:cnpj
 * @desc    Validate CNPJ format
 * @access  Public
 */
router.get('/validate/:cnpj', validateCnpj, cnpjController.validateCnpj);

/**
 * @route   GET /api/cnpj/:cnpj
 * @desc    Get CNPJ data and risk analysis
 * @access  Public
 */
router.get('/:cnpj', validateCnpj, cnpjController.getCnpjData);

/**
 * @route   GET /api/cnpj/:cnpj/details
 * @desc    Get detailed risk criteria for a CNPJ
 * @access  Public
 */
router.get('/:cnpj/details', validateCnpj, cnpjController.getRiskDetails);

/**
 * @route   GET /api/cnpj/:cnpj/export
 * @desc    Export CNPJ risk analysis as PDF
 * @access  Public
 */
router.get('/:cnpj/export', validateCnpj, cnpjController.exportPdf);

module.exports = router;