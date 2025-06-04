import axios from 'axios';

// URL base da API (configurável via variável de ambiente)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviço para comunicação com a API
 */
const apiService = {
  /**
   * Consulta um CNPJ na API
   * @param {string} cnpj - CNPJ a ser consultado
   * @returns {Promise<Object>} - Resultado da consulta
   */
  async consultarCnpj(cnpj) {
    try {
      // Remover caracteres não numéricos
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      const response = await api.get(`/cnpj/${cnpjLimpo}`);
      return response.data;
    } catch (error) {
      // Tratar erros da API
      if (error.response) {
        // Resposta do servidor com erro
        throw new Error(error.response.data.message || 'Erro ao consultar CNPJ');
      } else if (error.request) {
        // Sem resposta do servidor
        throw new Error('Servidor indisponível. Tente novamente mais tarde.');
      } else {
        // Erro na configuração da requisição
        throw new Error('Erro ao processar a requisição.');
      }
    }
  },
  
  /**
   * Verifica a saúde da API
   * @returns {Promise<Object>} - Status de saúde
   */
  async verificarSaude() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API indisponível');
    }
  },
  
  /**
   * Valida um CNPJ
   * @param {string} cnpj - CNPJ a ser validado
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validarCnpj(cnpj) {
    try {
      const response = await api.post('/cnpj/validate', { cnpj });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao validar CNPJ');
    }
  }
};

export default apiService;