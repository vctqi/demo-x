const express = require('express');
const cnpjRoutes = require('./cnpj.routes');

const router = express.Router();

// Apply route groups
router.use('/cnpj', cnpjRoutes);

// Catch-all route for undefined endpoints
router.use('*', (req, res) => {
  res.status(404).json({ error: { message: 'Endpoint not found', code: 'NOT_FOUND' } });
});

module.exports = router;