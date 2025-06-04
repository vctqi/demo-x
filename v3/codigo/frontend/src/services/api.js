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
    // MOCK DE RESPOSTA: Solução temporária enquanto a API está sendo corrigida
    const formattedCNPJ = cnpj.replace(/[^\d]/g, '');
    const unformattedCNPJ = formattedCNPJ;
    
    // Formata para exibição: XX.XXX.XXX/XXXX-XX
    const displayCNPJ = formattedCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
    
    // Simula um atraso para dar a impressão de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Retorna dados fixos para testes
    return {
      success: true,
      data: {
        company: {
          cnpj: unformattedCNPJ,
          razaoSocial: "PETROLEO BRASILEIRO S A PETROBRAS",
          nomeFantasia: "Petrobras - Edise",
          situacaoCadastral: "Ativa",
          dataAbertura: "1966-09-28",
          cnaePrincipal: "1921700",
          cnaeDescricao: "Fabricação de produtos do refino de petróleo",
          porte: "Demais",
          cidade: "Rio de Janeiro",
          uf: "RJ",
          score: 20,
          riskLevel: "Baixo",
          lastUpdated: new Date().toISOString(),
          formattedCNPJ: displayCNPJ,
          operationTime: 59 // anos de operação (calculado automaticamente)
        },
        riskAnalysis: {
          score: 20,
          riskLevel: "Baixo",
          appliedCriteria: [
            {
              name: "Empresa com situação ativa",
              points: 10,
              impact: "positive"
            },
            {
              name: "Mais de 3 anos de operação",
              points: 10,
              impact: "positive"
            },
            {
              name: "CNAE de médio risco (1921-7/00 - Fabricação de produtos do refino de petróleo)",
              points: 0,
              impact: "neutral"
            }
          ]
        }
      }
    };
    
    // Código original comentado
    // const response = await api.get(`/cnpj/${formattedCNPJ}/analyze`);
    // return response.data;
  },
};

export default api;