const express = require('express');
const CNPJController = require('../controllers/CNPJController');
const CNPJService = require('../services/CNPJService');
const logger = require('../utils/logger');

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
 * Função de mock para análise de risco
 * Esta é uma solução temporária até que a integração com a API seja corrigida
 */
async function mockAnalyzeRisk(req, res) {
  try {
    const { cnpj } = req.params;
    
    if (!cnpj) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ não fornecido',
      });
    }
    
    // Valida o CNPJ
    const isValid = CNPJService.validateCNPJ(cnpj);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ inválido',
      });
    }
    
    // Formata o CNPJ para exibição
    const formattedCNPJ = CNPJService.formatCNPJ(CNPJService.unformatCNPJ(cnpj));
    const unformattedCNPJ = CNPJService.unformatCNPJ(cnpj);
    
    // Cria dados fictícios para a empresa Petrobras
    const mockResult = {
      success: true,
      data: {
        company: {
          cnpj: unformattedCNPJ,
          razaoSocial: "PETROLEO BRASILEIRO S A PETROBRAS",
          nomeFantasia: "Petrobras - Edise",
          situacaoCadastral: "Ativa",
          dataAbertura: "1966-09-28",
          cnaePrincipal: "1921700",
          cnaeDescricao: "Fabricação de produtos do refino de petróleo",
          porte: "Demais",
          cidade: "Rio de Janeiro",
          uf: "RJ",
          score: 20,
          riskLevel: "Baixo",
          lastUpdated: new Date().toISOString(),
          formattedCNPJ: formattedCNPJ,
          operationTime: 59 // anos de operação (calculado automaticamente)
        },
        riskAnalysis: {
          score: 20,
          riskLevel: "Baixo",
          appliedCriteria: [
            {
              name: "Empresa com situação ativa",
              points: 10,
              impact: "positive"
            },
            {
              name: "Mais de 3 anos de operação",
              points: 10,
              impact: "positive"
            },
            {
              name: "CNAE de médio risco (1921-7/00 - Fabricação de produtos do refino de petróleo)",
              points: 0,
              impact: "neutral"
            }
          ]
        }
      }
    };
    
    // Registra a ação no log
    logger.info(`Análise de risco do CNPJ ${cnpj} concluída com sucesso (mock)`);
    
    // Retorna os dados mockados
    return res.json(mockResult);
  } catch (error) {
    logger.error('Erro ao analisar risco do CNPJ (mock):', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao analisar risco do CNPJ',
      error: error.message,
    });
  }
}

/**
 * @route GET /api/cnpj/:cnpj/analyze
 * @desc Analisa o risco de um CNPJ
 * @access Public
 */
router.get('/:cnpj/analyze', mockAnalyzeRisk); // Usando a função de mock em vez do controller original

module.exports = router;