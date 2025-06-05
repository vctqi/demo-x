const express = require('express');
const cnpjController = require('../controllers/cnpjController');
const { validateCnpj } = require('../middlewares/cnpjValidator');

const router = express.Router();

/**
 * @route   GET /api/cnpj/:cnpj
 * @desc    Processa um CNPJ e retorna análise de risco
 * @access  Public
 */
router.get('/:cnpj', validateCnpj, cnpjController.processCnpj);

/**
 * @route   POST /api/cnpj/validate
 * @desc    Verifica se um CNPJ é válido
 * @access  Public
 */
router.post('/validate', cnpjController.validateCnpj);

module.exports = router;