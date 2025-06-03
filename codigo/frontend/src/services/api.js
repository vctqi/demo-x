import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Erro na comunicação com o servidor';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export const cnpjService = {
  /**
   * Valida um CNPJ
   * @param {string} cnpj - CNPJ a ser validado
   * @returns {Promise} Resposta da API
   */
  validateCNPJ: async (cnpj) => {
    const response = await api.post('/cnpj/validate', { cnpj });
    return response.data;
  },

  /**
   * Obtém os dados de um CNPJ
   * @param {string} cnpj - CNPJ a ser consultado
   * @returns {Promise} Resposta da API
   */
  getCNPJData: async (cnpj) => {
    const formattedCNPJ = cnpj.replace(/[^\d]/g, '');
    const response = await api.get(`/cnpj/${formattedCNPJ}`);
    return response.data;
  },

  /**
   * Analisa o risco de um CNPJ
   * @param {string} cnpj - CNPJ a ser analisado
   * @returns {Promise} Resposta da API
   */
  analyzeRisk: async (cnpj) => {
    const formattedCNPJ = cnpj.replace(/[^\d]/g, '');
    const response = await api.get(`/cnpj/${formattedCNPJ}/analyze`);
    return response.data;
  },
};

export default api;