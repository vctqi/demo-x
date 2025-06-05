const express = require('express');
const consultaController = require('./controllers/consultaController');
const { validarCNPJ } = require('./middlewares/validationMiddleware');

const router = express.Router();

// Rota de health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Rota para consultar CNPJ
router.get('/consulta/:cnpj', validarCNPJ, consultaController.consultarCNPJ.bind(consultaController));

// Rota não encontrada
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;