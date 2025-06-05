import axios from 'axios';

// URL base da API (configurável via variável de ambiente)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

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
      
      // Adicionar retentativas para falhas de rede
      let retries = 2;
      let lastError = null;
      
      while (retries >= 0) {
        try {
          const response = await api.get(`/cnpj/${cnpjLimpo}`);
          return response.data;
        } catch (err) {
          // Salvar o erro para usar se todas as tentativas falharem
          lastError = err;
          
          // Se for erro de rede ou timeout, tenta novamente
          if (!err.response && retries > 0) {
            retries--;
            // Espera 1 segundo antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          // Para outros erros ou última tentativa, propaga o erro
          throw err;
        }
      }
      
      // Se chegou aqui, todas as tentativas falharam
      throw lastError;
    } catch (error) {
      // Tratar erros da API
      if (error.response) {
        // Resposta do servidor com erro (formata a mensagem de erro do servidor se possível)
        const errorMessage = error.response.data && error.response.data.message 
          ? error.response.data.message 
          : 'Erro ao consultar CNPJ';
        
        // Para erro 404, mensagem específica
        if (error.response.status === 404) {
          throw new Error(`CNPJ não encontrado na base de dados. Verifique se o número está correto.`);
        }
        
        throw new Error(errorMessage);
      } else if (error.request) {
        // Sem resposta do servidor
        throw new Error('Servidor indisponível. Verifique sua conexão ou tente novamente mais tarde.');
      } else {
        // Erro na configuração da requisição
        throw new Error('Erro ao processar a requisição. Tente novamente.');
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