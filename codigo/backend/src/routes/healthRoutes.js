const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Verifica a saúde da aplicação
 * @access  Public
 */
router.get('/', healthController.checkHealth);

module.exports = router;