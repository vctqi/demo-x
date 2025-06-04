const express = require('express');
const cnpjRoutes = require('./cnpjRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Rotas de saúde
router.use('/health', healthRoutes);

// Rotas de CNPJ
router.use('/cnpj', cnpjRoutes);

module.exports = router;