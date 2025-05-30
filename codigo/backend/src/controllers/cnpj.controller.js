const { formatCnpj } = require('../utils/validators');
const cnpjService = require('../services/cnpj.service');
const pdfService = require('../services/pdf.service');
const { setupLogger } = require('../utils/logger');

// Initialize logger
const logger = setupLogger();

/**
 * Validate CNPJ format
 * @route GET /api/cnpj/validate/:cnpj
 */
exports.validateCnpj = (req, res) => {
  try {
    const { cleanCnpj } = req;
    
    // If we reach here, the CNPJ passed the validation middleware
    res.status(200).json({
      cnpj: cleanCnpj,
      formatted: formatCnpj(cleanCnpj),
      valid: true
    });
  } catch (error) {
    logger.error(`Error validating CNPJ: ${error.message}`);
    
    res.status(500).json({
      error: {
        message: 'Erro ao validar CNPJ',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Get CNPJ data and risk analysis
 * @route GET /api/cnpj/:cnpj
 */
exports.getCnpjData = async (req, res) => {
  try {
    const { cleanCnpj } = req;
    
    logger.info(`Getting data for CNPJ: ${cleanCnpj}`);
    
    const result = await cnpjService.getCnpjData(cleanCnpj);
    
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error getting CNPJ data: ${error.message}`);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    // Map specific errors to status codes
    if (error.message.includes('não encontrado')) {
      statusCode = 404;
      errorCode = 'CNPJ_NOT_FOUND';
    } else if (error.message.includes('Limite de requisições')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message.includes('conectar com a API')) {
      statusCode = 503;
      errorCode = 'EXTERNAL_API_UNAVAILABLE';
    }
    
    res.status(statusCode).json({
      error: {
        message: error.message,
        code: errorCode
      }
    });
  }
};

/**
 * Get detailed risk criteria for a CNPJ
 * @route GET /api/cnpj/:cnpj/details
 */
exports.getRiskDetails = async (req, res) => {
  try {
    const { cleanCnpj } = req;
    
    logger.info(`Getting risk details for CNPJ: ${cleanCnpj}`);
    
    const result = await cnpjService.getRiskDetails(cleanCnpj);
    
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error getting risk details: ${error.message}`);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    // Map specific errors to status codes
    if (error.message.includes('não encontrado')) {
      statusCode = 404;
      errorCode = 'CNPJ_NOT_FOUND';
    }
    
    res.status(statusCode).json({
      error: {
        message: error.message,
        code: errorCode
      }
    });
  }
};

/**
 * Export CNPJ risk analysis as PDF
 * @route GET /api/cnpj/:cnpj/export
 */
exports.exportPdf = async (req, res) => {
  try {
    const { cleanCnpj } = req;
    
    logger.info(`Exporting PDF for CNPJ: ${cleanCnpj}`);
    
    // Get CNPJ data with risk analysis
    const data = await cnpjService.getCnpjData(cleanCnpj);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Analise_Risco_${cleanCnpj}_${new Date().toISOString().split('T')[0]}.pdf"`
    );
    
    // Generate PDF and pipe directly to response
    await pdfService.generatePdf(data, res);
    
    // Note: No need to call res.end() as the PDF service will handle it
  } catch (error) {
    logger.error(`Error exporting PDF: ${error.message}`);
    
    // If headers were not sent yet, send error response
    if (!res.headersSent) {
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      
      // Map specific errors to status codes
      if (error.message.includes('não encontrado')) {
        statusCode = 404;
        errorCode = 'CNPJ_NOT_FOUND';
      }
      
      res.status(statusCode).json({
        error: {
          message: `Erro ao gerar PDF: ${error.message}`,
          code: errorCode
        }
      });
    } else {
      // If headers were already sent, we can only end the response
      res.end();
    }
  }
};