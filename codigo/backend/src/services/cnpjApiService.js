const axios = require('axios');
const logger = require('../config/logger');

// URL base da API pública de CNPJ
const API_BASE_URL = 'https://publica.cnpj.ws/cnpj';

// Configuração do timeout para 10 segundos (conforme requisitos)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

/**
 * Serviço para consulta de CNPJ na API pública
 */
class CnpjApiService {
  /**
   * Consulta um CNPJ na API pública
   * @param {string} cnpj - CNPJ a ser consultado (apenas números)
   * @returns {Promise<Object>} - Dados do CNPJ ou null em caso de erro
   */
  async consultarCnpj(cnpj) {
    try {
      // Remover formatação do CNPJ caso exista
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      logger.info(`Consultando CNPJ ${cnpjLimpo} na API externa`, { context: 'CnpjApiService' });
      
      // Fazer a requisição à API
      const response = await api.get(`/${cnpjLimpo}`);
      
      logger.info(`CNPJ ${cnpjLimpo} consultado com sucesso. Status: ${response.status}`, { context: 'CnpjApiService' });
      
      // Retornar os dados formatados
      return this.formatarResposta(response.data);
    } catch (error) {
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
        logger.error(`Erro ao consultar CNPJ: ${error.response.status} - ${error.response.statusText}`, { context: 'CnpjApiService' });
        
        if (error.response.status === 404) {
          return { notFound: true };
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        logger.error('Erro ao consultar CNPJ: Sem resposta da API', { context: 'CnpjApiService' });
      } else {
        // Erro na configuração da requisição
        logger.error(`Erro ao consultar CNPJ: ${error.message}`, { context: 'CnpjApiService' });
      }
      
      throw error;
    }
  }
  
  /**
   * Formata a resposta da API para o formato interno da aplicação
   * @param {Object} data - Dados retornados pela API
   * @returns {Object} - Dados formatados
   */
  formatarResposta(data) {
    // Verificar se os dados necessários estão presentes
    if (!data || !data.razao_social) {
      logger.warn('Dados incompletos retornados pela API', { context: 'CnpjApiService' });
      return null;
    }
    
    // Extrair a atividade principal (CNAE)
    const atividadePrincipal = data.estabelecimento && 
                              data.estabelecimento.atividade_principal ? 
                              data.estabelecimento.atividade_principal : null;
    
    // Extrair o código CNAE e a descrição corretamente
    const codigoCnae = atividadePrincipal ? atividadePrincipal.id : '';
    const descricaoCnae = atividadePrincipal ? atividadePrincipal.descricao : '';
    
    // Verificar a existência de campos obrigatórios e fornecer valores padrão se necessário
    const cnpjFormatado = data.estabelecimento ? data.estabelecimento.cnpj : '';
    const situacaoCadastral = data.estabelecimento ? data.estabelecimento.situacao_cadastral : 'Desconhecida';
    const dataAberturaFormatada = data.estabelecimento ? data.estabelecimento.data_inicio_atividade : '2000-01-01';
    
    // Log para depuração
    logger.debug(`CNAE extraído: ${codigoCnae}, Descrição: ${descricaoCnae}`, { context: 'CnpjApiService' });
    
    // Formatar os dados para o modelo interno
    return {
      cnpj: cnpjFormatado,
      razaoSocial: data.razao_social,
      nomeFantasia: data.estabelecimento && data.estabelecimento.nome_fantasia ? data.estabelecimento.nome_fantasia : '',
      situacao: situacaoCadastral,
      dataAbertura: dataAberturaFormatada,
      cnae: codigoCnae,  // Agora usando o campo 'id' ao invés de 'codigo'
      descricaoCnae: descricaoCnae,
      porte: data.porte ? data.porte.descricao : 'Não informado',
      municipio: data.estabelecimento && data.estabelecimento.cidade ? data.estabelecimento.cidade.nome : '',
      uf: data.estabelecimento && data.estabelecimento.estado ? data.estabelecimento.estado.sigla : ''
    };
  }
}

module.exports = new CnpjApiService();