const { setupLogger } = require('../utils/logger');

// Initialize logger
const logger = setupLogger();

// CNAE codes considered high risk
const HIGH_RISK_CNAE = [
  '6491900', // Sociedades de fomento mercantil - factoring
  '4120400', // Construção de edifícios
  '4299599', // Outras obras de engenharia civil
  '6612603', // Corretoras de câmbio
  '6619302', // Correspondentes de instituições financeiras
  '9200301', // Casas de bingo
  '9200302', // Exploração de apostas em corridas de cavalos
  '9200399', // Exploração de jogos de azar e apostas
  '6613400', // Administração de cartões de crédito
  '4511101'  // Comércio a varejo de automóveis, camionetas e utilitários novos
];

// CNAE codes considered low risk
const LOW_RISK_CNAE = [
  '6202300', // Desenvolvimento e licenciamento de programas de computador customizáveis
  '6201501', // Desenvolvimento de programas de computador sob encomenda
  '8599604', // Treinamento em desenvolvimento profissional e gerencial
  '7020400', // Atividades de consultoria em gestão empresarial
  '8513900', // Ensino fundamental
  '8520100', // Ensino médio
  '8531700', // Educação superior - graduação
  '8610101', // Atividades de atendimento hospitalar
  '7210000', // Pesquisa e desenvolvimento experimental em ciências físicas e naturais
  '6204000'  // Consultoria em tecnologia da informação
];

/**
 * Calculate company operation time in months
 * @param {string} dataAbertura - Company foundation date (YYYY-MM-DD format)
 * @returns {number} Operation time in months
 */
function calculateOperationTime(dataAbertura) {
  if (!dataAbertura) return 0;
  
  try {
    const foundationDate = new Date(dataAbertura);
    const currentDate = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(currentDate - foundationDate);
    
    // Convert to months (approximate)
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    return diffMonths;
  } catch (error) {
    logger.error(`Error calculating operation time: ${error.message}`);
    return 0;
  }
}

/**
 * Check if CNAE is high risk
 * @param {string} cnae - CNAE code with description
 * @returns {boolean} Whether the CNAE is high risk
 */
function isHighRiskCnae(cnae) {
  if (!cnae) return false;
  
  // Extract CNAE code from the string (format: "XXXXXXX - Description")
  const cnaeCode = cnae.split(' ')[0];
  
  return HIGH_RISK_CNAE.includes(cnaeCode);
}

/**
 * Check if CNAE is low risk
 * @param {string} cnae - CNAE code with description
 * @returns {boolean} Whether the CNAE is low risk
 */
function isLowRiskCnae(cnae) {
  if (!cnae) return false;
  
  // Extract CNAE code from the string (format: "XXXXXXX - Description")
  const cnaeCode = cnae.split(' ')[0];
  
  return LOW_RISK_CNAE.includes(cnaeCode);
}

/**
 * Calculate risk score based on company data
 * @param {Object} cnpjData - Company data
 * @returns {Object} Risk score and details
 */
exports.calculateRiskScore = (cnpjData) => {
  try {
    logger.info(`Calculating risk score for CNPJ ${cnpjData.cnpj}`);
    
    const {
      situacao,
      data_abertura,
      cnae_principal
    } = cnpjData;
    
    let score = 0;
    const criteriosPositivos = [];
    const criteriosNegativos = [];
    const alertas = [];
    
    // Check company status
    if (situacao === 'Ativa') {
      score += 10;
      criteriosPositivos.push({
        criterio: 'Empresa ativa',
        pontuacao: 10,
        descricao: 'A empresa está com situação cadastral ativa'
      });
    } else {
      score -= 20;
      criteriosNegativos.push({
        criterio: 'Empresa inativa/suspensa',
        pontuacao: -20,
        descricao: `A empresa está com situação cadastral: ${situacao}`
      });
      alertas.push(`Situação cadastral irregular: ${situacao}`);
    }
    
    // Check operation time
    const operationTimeMonths = calculateOperationTime(data_abertura);
    
    if (operationTimeMonths >= 36) { // 3 years or more
      score += 10;
      criteriosPositivos.push({
        criterio: 'Mais de 3 anos de operação',
        pontuacao: 10,
        descricao: `A empresa está operando há ${Math.floor(operationTimeMonths / 12)} anos e ${operationTimeMonths % 12} meses`
      });
    } else if (operationTimeMonths <= 6) { // 6 months or less
      score -= 10;
      criteriosNegativos.push({
        criterio: 'Empresa aberta há menos de 6 meses',
        pontuacao: -10,
        descricao: `A empresa está operando há apenas ${operationTimeMonths} meses`
      });
      alertas.push('Empresa recém-aberta');
    }
    
    // Check CNAE risk
    if (isHighRiskCnae(cnae_principal)) {
      score -= 10;
      criteriosNegativos.push({
        criterio: 'CNAE de risco',
        pontuacao: -10,
        descricao: `A empresa atua em setor considerado de risco: ${cnae_principal}`
      });
      alertas.push('CNAE com risco associado');
    } else if (isLowRiskCnae(cnae_principal)) {
      score += 10;
      criteriosPositivos.push({
        criterio: 'CNAE de baixo risco',
        pontuacao: 10,
        descricao: `A empresa atua em setor considerado de baixo risco: ${cnae_principal}`
      });
    }
    
    // Determine risk classification
    let classificacao;
    if (score >= 20) {
      classificacao = 'Baixo';
    } else if (score >= 0) {
      classificacao = 'Médio';
    } else {
      classificacao = 'Alto';
    }
    
    logger.info(`Risk score calculated for CNPJ ${cnpjData.cnpj}: ${score} (${classificacao})`);
    
    return {
      score,
      classificacao,
      criterios_positivos: criteriosPositivos,
      criterios_negativos: criteriosNegativos,
      alertas
    };
  } catch (error) {
    logger.error(`Error calculating risk score: ${error.message}`, { stack: error.stack });
    throw new Error('Erro ao calcular score de risco');
  }
};