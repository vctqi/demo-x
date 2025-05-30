const PDFDocument = require('pdfkit');
const { formatCnpj } = require('../utils/validators');
const { setupLogger } = require('../utils/logger');

// Initialize logger
const logger = setupLogger();

/**
 * Generate PDF report for CNPJ risk analysis
 * @param {Object} data - CNPJ data with risk analysis
 * @param {stream.Writable} outputStream - Stream to write the PDF to
 * @returns {Promise<void>}
 */
exports.generatePdf = (data, outputStream) => {
  return new Promise((resolve, reject) => {
    try {
      logger.info(`Generating PDF for CNPJ ${data.cnpj}`);
      
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Análise de Risco - ${data.razao_social}`,
          Author: 'Analisador de Risco de Cliente PJ via CNPJ',
          Subject: `Análise de risco para o CNPJ ${formatCnpj(data.cnpj)}`,
          Keywords: 'CNPJ, análise de risco, due diligence'
        }
      });
      
      // Pipe to output stream
      doc.pipe(outputStream);
      
      // Add content
      addHeader(doc, data);
      addCompanyData(doc, data);
      addRiskAnalysis(doc, data.risco);
      addDetailedCriteria(doc, data.risco);
      addFooter(doc);
      
      // Finalize PDF
      doc.end();
      
      // Handle stream events
      outputStream.on('finish', () => {
        logger.info(`PDF generated successfully for CNPJ ${data.cnpj}`);
        resolve();
      });
      
      outputStream.on('error', (error) => {
        logger.error(`Error generating PDF: ${error.message}`);
        reject(error);
      });
    } catch (error) {
      logger.error(`Error generating PDF: ${error.message}`, { stack: error.stack });
      reject(error);
    }
  });
};

/**
 * Add header to PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} data - CNPJ data
 */
function addHeader(doc, data) {
  doc.fontSize(22)
     .font('Helvetica-Bold')
     .text('Relatório de Análise de Risco', { align: 'center' })
     .moveDown(0.5);
  
  doc.fontSize(16)
     .font('Helvetica')
     .text(`CNPJ: ${formatCnpj(data.cnpj)}`, { align: 'center' })
     .moveDown(1);
  
  // Add date
  const date = new Date();
  doc.fontSize(10)
     .text(`Data de geração: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`, { align: 'right' })
     .moveDown(1);
  
  // Add horizontal line
  doc.moveTo(50, doc.y)
     .lineTo(doc.page.width - 50, doc.y)
     .stroke()
     .moveDown(1);
}

/**
 * Add company data to PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} data - CNPJ data
 */
function addCompanyData(doc, data) {
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Dados Cadastrais', { underline: true })
     .moveDown(0.5);
  
  const fields = [
    { label: 'Razão Social', value: data.razao_social },
    { label: 'Nome Fantasia', value: data.nome_fantasia || 'Não informado' },
    { label: 'Data de Abertura', value: formatDate(data.data_abertura) },
    { label: 'CNAE Principal', value: data.cnae_principal || 'Não informado' },
    { label: 'Situação Cadastral', value: data.situacao },
    { label: 'Porte da Empresa', value: data.porte || 'Não informado' },
    { label: 'Localização', value: data.localizacao }
  ];
  
  doc.fontSize(12).font('Helvetica');
  
  fields.forEach(field => {
    doc.font('Helvetica-Bold')
       .text(`${field.label}: `, { continued: true })
       .font('Helvetica')
       .text(field.value)
       .moveDown(0.3);
  });
  
  doc.moveDown(1);
}

/**
 * Add risk analysis to PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} risco - Risk analysis data
 */
function addRiskAnalysis(doc, risco) {
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Análise de Risco', { underline: true })
     .moveDown(0.5);
  
  // Add score
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text(`Score: ${risco.score} pontos`, { continued: true })
     .moveDown(0.5);
  
  // Add classification with color
  doc.fontSize(14)
     .text('Classificação: ', { continued: true });
  
  let color;
  switch (risco.classificacao) {
    case 'Baixo':
      color = '#2e7d32'; // Green
      break;
    case 'Médio':
      color = '#f57f17'; // Amber
      break;
    case 'Alto':
      color = '#c62828'; // Red
      break;
    default:
      color = '#000000'; // Black
  }
  
  doc.fillColor(color)
     .text(risco.classificacao)
     .fillColor('#000000') // Reset to black
     .moveDown(1);
  
  // Add alerts
  if (risco.alertas && risco.alertas.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Sinais de Alerta:')
       .moveDown(0.3);
    
    doc.fontSize(12)
       .font('Helvetica');
    
    risco.alertas.forEach(alerta => {
      doc.fillColor('#c62828') // Red for alerts
         .text(`• ${alerta}`)
         .fillColor('#000000') // Reset to black
         .moveDown(0.3);
    });
  }
  
  doc.moveDown(1);
}

/**
 * Add detailed criteria to PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} risco - Risk analysis data
 */
function addDetailedCriteria(doc, risco) {
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Detalhamento dos Critérios', { underline: true })
     .moveDown(0.5);
  
  // Add positive criteria
  if (risco.criterios_positivos && risco.criterios_positivos.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Critérios Positivos:')
       .moveDown(0.3);
    
    doc.fontSize(12)
       .font('Helvetica');
    
    risco.criterios_positivos.forEach(criterio => {
      doc.font('Helvetica-Bold')
         .fillColor('#2e7d32') // Green for positive
         .text(`• ${criterio.criterio} (${criterio.pontuacao > 0 ? '+' : ''}${criterio.pontuacao})`, { continued: false })
         .font('Helvetica')
         .fillColor('#000000') // Reset to black
         .text(`  ${criterio.descricao}`)
         .moveDown(0.3);
    });
    
    doc.moveDown(0.5);
  }
  
  // Add negative criteria
  if (risco.criterios_negativos && risco.criterios_negativos.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Critérios Negativos:')
       .moveDown(0.3);
    
    doc.fontSize(12)
       .font('Helvetica');
    
    risco.criterios_negativos.forEach(criterio => {
      doc.font('Helvetica-Bold')
         .fillColor('#c62828') // Red for negative
         .text(`• ${criterio.criterio} (${criterio.pontuacao})`, { continued: false })
         .font('Helvetica')
         .fillColor('#000000') // Reset to black
         .text(`  ${criterio.descricao}`)
         .moveDown(0.3);
    });
  }
  
  doc.moveDown(1);
}

/**
 * Add footer to PDF
 * @param {PDFDocument} doc - PDF document
 */
function addFooter(doc) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  
  // Add horizontal line
  doc.moveTo(50, pageHeight - 70)
     .lineTo(pageWidth - 50, pageHeight - 70)
     .stroke();
  
  // Add footer text
  doc.fontSize(10)
     .font('Helvetica')
     .text(
       'Este relatório tem caráter informativo e baseia-se em dados públicos. ' +
       'A análise de risco apresentada utiliza critérios simplificados e não substitui uma avaliação completa de due diligence.',
       50,
       pageHeight - 60,
       { width: pageWidth - 100, align: 'center' }
     );
  
  // Add page number
  doc.text(
    `Página ${doc.page.pageNumber}`,
    50,
    pageHeight - 30,
    { width: pageWidth - 100, align: 'center' }
  );
}

/**
 * Format date to Brazilian format
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date (DD/MM/YYYY)
 */
function formatDate(dateString) {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString; // Return original if can't format
  }
}