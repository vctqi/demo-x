import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Validate if a CNPJ is valid
 * @param {string} cnpj - The CNPJ to validate
 * @returns {Promise<Object>} The validation result
 */
export const validateCnpj = async (cnpj) => {
  try {
    const response = await api.post('/validate-cnpj', { cnpj });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Analyze a CNPJ
 * @param {string} cnpj - The CNPJ to analyze
 * @returns {Promise<Object>} The analysis result
 */
export const analyzeCnpj = async (cnpj) => {
  try {
    const response = await api.post('/analyze', { cnpj });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};