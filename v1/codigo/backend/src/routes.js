const express = require('express');
const cnpjController = require('./controllers/cnpjController');
const riskController = require('./controllers/riskController');
const historyController = require('./controllers/historyController');

const router = express.Router();

// CNPJ Routes
router.post('/cnpj/validate', cnpjController.validateCnpj);
router.get('/cnpj/:cnpj', cnpjController.getCompanyInfo);

// Risk Analysis Routes
router.get('/risk/:cnpj', riskController.analyzeRisk);

// History Routes
router.post('/history', historyController.addToHistory);
router.get('/history', historyController.getHistory);

module.exports = router;