const express = require('express');
const cnpjRoutes = require('./cnpjRoutes');

const router = express.Router();

// Rota padrão da API
router.get('/', (req, res) => {
  res.json({
    message: 'API do Analisador de Risco de Cliente PJ via CNPJ',
    version: '1.0.0',
    endpoints: {
      cnpj: {
        validate: 'POST /api/cnpj/validate',
        getData: 'GET /api/cnpj/:cnpj',
        analyze: 'GET /api/cnpj/:cnpj/analyze',
      },
    },
  });
});

// Rotas específicas
router.use('/cnpj', cnpjRoutes);

module.exports = router;