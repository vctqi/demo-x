import api from './api';

/**
 * Service for CNPJ-related API calls
 */
const cnpjService = {
  /**
   * Validates a CNPJ
   * @param {string} cnpj - CNPJ to validate
   * @returns {Promise<Object>} - Validation result
   */
  validateCnpj: async (cnpj) => {
    const response = await api.post('/cnpj/validate', { cnpj });
    return response.data;
  },
  
  /**
   * Gets company information by CNPJ
   * @param {string} cnpj - CNPJ to get information for
   * @returns {Promise<Object>} - Company information
   */
  getCompanyInfo: async (cnpj) => {
    const response = await api.get(`/cnpj/${cnpj}`);
    return response.data;
  },
  
  /**
   * Gets risk analysis for a CNPJ
   * @param {string} cnpj - CNPJ to analyze
   * @returns {Promise<Object>} - Risk analysis result
   */
  getRiskAnalysis: async (cnpj) => {
    const response = await api.get(`/risk/${cnpj}`);
    return response.data;
  },
  
  /**
   * Adds a CNPJ consultation to history
   * @param {string} cnpj - CNPJ that was consulted
   * @param {string} userSession - User session ID
   * @returns {Promise<Object>} - Result of the operation
   */
  addToHistory: async (cnpj, userSession) => {
    const response = await api.post('/history', { cnpj, userSession });
    return response.data;
  },
  
  /**
   * Gets consultation history for a session
   * @param {string} userSession - User session ID
   * @returns {Promise<Array>} - Consultation history
   */
  getHistory: async (userSession) => {
    const response = await api.get(`/history?userSession=${userSession}`);
    return response.data;
  },
};

export default cnpjService;