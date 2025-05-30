const axios = require('axios');
const NodeCache = require('node-cache');
const { getDb } = require('../models/database');
const { setupLogger } = require('../utils/logger');
const riskService = require('./risk.service');

// Initialize logger
const logger = setupLogger();

// Initialize cache with TTL from env or default to 1 hour
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL, 10) || 3600,
  checkperiod: 120
});

// API URL from env
const CNPJ_API_URL = process.env.CNPJ_API_URL || 'https://publica.cnpj.ws/cnpj';

/**
 * Fetch CNPJ data from external API
 * @param {string} cnpj - CNPJ number (only digits)
 * @returns {Promise<Object>} CNPJ data
 */
async function fetchCnpjData(cnpj) {
  try {
    logger.info(`Fetching CNPJ data for ${cnpj} from external API`);
    
    const response = await axios.get(`${CNPJ_API_URL}/${cnpj}`, {
      timeout: 5000, // 5 seconds timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching CNPJ data: ${error.message}`);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      if (status === 404) {
        throw new Error('CNPJ não encontrado na base de dados');
      } else if (status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente mais tarde');
      } else {
        throw new Error(`Erro ao consultar API externa: ${error.response.statusText}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Não foi possível conectar com a API externa. Tente novamente mais tarde');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Erro ao processar a requisição: ${error.message}`);
    }
  }
}

/**
 * Extract relevant data from API response
 * @param {Object} data - Raw API response
 * @returns {Object} Extracted data
 */
function extractCnpjData(data) {
  try {
    // Extract basic company information
    const {
      razao_social,
      nome_fantasia,
      estabelecimento,
      natureza_juridica,
      porte
    } = data;
    
    // Extract establishment information
    const {
      cnpj,
      data_inicio_atividade,
      cnae_fiscal_principal,
      tipo_logradouro,
      logradouro,
      numero,
      complemento,
      bairro,
      cep,
      situacao_cadastral
    } = estabelecimento;
    
    // Build address
    const endereco = [
      tipo_logradouro,
      logradouro,
      numero,
      complemento,
      bairro,
      cep
    ].filter(Boolean).join(', ');
    
    // Extract city and state
    const cidade = estabelecimento.cidade ? estabelecimento.cidade.nome : '';
    const estado = estabelecimento.estado ? estabelecimento.estado.sigla : '';
    const localizacao = `${cidade}/${estado}`;
    
    // Format CNAE
    const cnae = cnae_fiscal_principal ? 
      `${cnae_fiscal_principal.codigo} - ${cnae_fiscal_principal.descricao}` : '';
    
    return {
      cnpj,
      razao_social,
      nome_fantasia: nome_fantasia || '',
      data_abertura: data_inicio_atividade,
      cnae_principal: cnae,
      natureza_juridica: natureza_juridica ? natureza_juridica.descricao : '',
      situacao: situacao_cadastral,
      porte: porte || '',
      endereco,
      localizacao
    };
  } catch (error) {
    logger.error(`Error extracting CNPJ data: ${error.message}`, { stack: error.stack });
    throw new Error('Erro ao processar dados do CNPJ');
  }
}

/**
 * Save CNPJ query to database
 * @param {Object} cnpjData - Extracted CNPJ data
 * @param {string} rawData - Raw API response as JSON string
 * @returns {Promise<number>} ID of the inserted record
 */
async function saveCnpjQuery(cnpjData, rawData) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    const {
      cnpj,
      razao_social,
      nome_fantasia,
      data_abertura,
      cnae_principal,
      situacao,
      porte,
      localizacao
    } = cnpjData;
    
    const sql = `
      INSERT INTO consultas (
        cnpj, razao_social, nome_fantasia, data_abertura,
        cnae_principal, situacao, porte, localizacao, dados_brutos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      sql,
      [
        cnpj,
        razao_social,
        nome_fantasia,
        data_abertura,
        cnae_principal,
        situacao,
        porte,
        localizacao,
        rawData
      ],
      function(err) {
        if (err) {
          logger.error(`Error saving CNPJ query: ${err.message}`);
          return reject(err);
        }
        
        logger.info(`CNPJ query saved with ID: ${this.lastID}`);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * Save risk analysis result to database
 * @param {number} consultaId - ID of the CNPJ query
 * @param {Object} riskResult - Risk analysis result
 * @returns {Promise<number>} ID of the inserted record
 */
async function saveRiskResult(consultaId, riskResult) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    const {
      score,
      classificacao,
      criterios_positivos,
      criterios_negativos,
      alertas
    } = riskResult;
    
    const sql = `
      INSERT INTO resultados_risco (
        consulta_id, score, classificacao,
        criterios_positivos, criterios_negativos, alertas
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      sql,
      [
        consultaId,
        score,
        classificacao,
        JSON.stringify(criterios_positivos),
        JSON.stringify(criterios_negativos),
        JSON.stringify(alertas)
      ],
      function(err) {
        if (err) {
          logger.error(`Error saving risk result: ${err.message}`);
          return reject(err);
        }
        
        logger.info(`Risk result saved with ID: ${this.lastID}`);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * Get CNPJ data and risk analysis
 * @param {string} cnpj - CNPJ number (only digits)
 * @returns {Promise<Object>} CNPJ data with risk analysis
 */
exports.getCnpjData = async (cnpj) => {
  // Check cache first
  const cacheKey = `cnpj_${cnpj}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    logger.info(`Using cached data for CNPJ ${cnpj}`);
    return cachedData;
  }
  
  try {
    // Fetch data from API
    const rawData = await fetchCnpjData(cnpj);
    
    // Extract relevant data
    const cnpjData = extractCnpjData(rawData);
    
    // Calculate risk score
    const riskResult = riskService.calculateRiskScore(cnpjData);
    
    // Save to database
    const consultaId = await saveCnpjQuery(cnpjData, JSON.stringify(rawData));
    await saveRiskResult(consultaId, riskResult);
    
    // Combine data
    const result = {
      ...cnpjData,
      risco: riskResult
    };
    
    // Save to cache
    cache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    logger.error(`Error processing CNPJ data: ${error.message}`);
    throw error;
  }
};

/**
 * Get risk details for a CNPJ
 * @param {string} cnpj - CNPJ number (only digits)
 * @returns {Promise<Object>} Detailed risk criteria
 */
exports.getRiskDetails = async (cnpj) => {
  try {
    // Try to get from cache first
    const cacheKey = `cnpj_${cnpj}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return {
        cnpj,
        razao_social: cachedData.razao_social,
        ...cachedData.risco
      };
    }
    
    // If not in cache, fetch complete data
    const result = await exports.getCnpjData(cnpj);
    
    return {
      cnpj,
      razao_social: result.razao_social,
      ...result.risco
    };
  } catch (error) {
    logger.error(`Error getting risk details: ${error.message}`);
    throw error;
  }
};