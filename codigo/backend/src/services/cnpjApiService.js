const axios = require('axios');
const NodeCache = require('node-cache');
const { unformatCnpj } = require('../utils/cnpjValidator');

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Base URL for the public CNPJ API
const CNPJ_API_BASE_URL = 'https://publica.cnpj.ws/cnpj';

/**
 * Service for interacting with the public CNPJ API
 */
class CnpjApiService {
  /**
   * Fetches company data from the CNPJ API
   * @param {string} cnpj - CNPJ to fetch data for
   * @returns {Promise<Object>} - Company data
   */
  async fetchCompanyData(cnpj) {
    // Remove formatting and validate
    const cleanCnpj = unformatCnpj(cnpj);
    
    // Check cache first
    const cacheKey = `company_${cleanCnpj}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for CNPJ ${cleanCnpj}`);
      return cachedData;
    }
    
    try {
      console.log(`Fetching data for CNPJ ${cleanCnpj} from API`);
      const response = await axios.get(`${CNPJ_API_BASE_URL}/${cleanCnpj}`);
      
      // Extract relevant data from API response
      const companyData = this._mapApiResponseToCompanyData(response.data);
      
      // Store in cache
      cache.set(cacheKey, companyData);
      
      return companyData;
    } catch (error) {
      console.error(`Error fetching CNPJ data: ${error.message}`);
      
      // Handle API-specific errors
      if (error.response) {
        const { status } = error.response;
        
        if (status === 404) {
          throw new Error('CNPJ não encontrado na base de dados.');
        } else if (status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
        }
      }
      
      throw new Error('Erro ao consultar dados do CNPJ. Tente novamente mais tarde.');
    }
  }
  
  /**
   * Maps the API response to our internal company data format
   * @param {Object} apiResponse - Response from the CNPJ API
   * @returns {Object} - Mapped company data
   * @private
   */
  _mapApiResponseToCompanyData(apiResponse) {
    // Basic mapping - in a real app we would handle all possible fields
    return {
      cnpj: apiResponse.cnpj || '',
      companyName: apiResponse.razao_social || '',
      tradeName: apiResponse.nome_fantasia || '',
      openingDate: apiResponse.data_inicio_atividade || null,
      status: apiResponse.situacao_cadastral?.descricao || 'Desconhecida',
      cnae: apiResponse.cnae_fiscal?.codigo || '',
      cnaeDescription: apiResponse.cnae_fiscal?.descricao || '',
      size: apiResponse.porte?.descricao || '',
      city: apiResponse.estabelecimento?.cidade?.nome || '',
      state: apiResponse.estabelecimento?.estado?.sigla || '',
      lastConsultation: new Date(),
    };
  }
}

module.exports = new CnpjApiService();