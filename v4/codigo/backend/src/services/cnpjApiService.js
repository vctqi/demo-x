const axios = require('axios');
const logger = require('../config/logger');

class CNPJApiService {
    constructor() {
        // URL base da API conforme especificado: https://publica.cnpj.ws/cnpj/CNPJ_NUMBER_WITHOUT_SPECIAL_CHARACTERS
        this.baseURL = 'https://publica.cnpj.ws/cnpj/';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 segundo
    }

    /**
     * Consulta um CNPJ na API pública
     * @param {string} cnpj - CNPJ sem formatação (apenas números)
     * @returns {Promise<Object>} Dados da empresa ou null em caso de erro
     */
    async consultarCNPJ(cnpj) {
        // Remover caracteres não numéricos
        const cnpjNumeros = cnpj.replace(/\D/g, '');

        // Validar formato do CNPJ
        if (cnpjNumeros.length !== 14) {
            logger.warn(`CNPJ inválido: ${cnpj} (deve conter 14 dígitos)`);
            throw new Error('CNPJ inválido: deve conter 14 dígitos');
        }

        logger.info(`Consultando CNPJ: ${cnpjNumeros}`);
        
        // Consultar a API real
        return this._consultarComRetry(cnpjNumeros);
    }

    /**
     * Consulta um CNPJ com mecanismo de retry
     * @private
     * @param {string} cnpj - CNPJ (apenas números)
     * @returns {Promise<Object>} Dados da empresa ou null em caso de erro
     */
    async _consultarComRetry(cnpj) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                logger.debug(`Tentativa ${attempt} de consulta do CNPJ ${cnpj}`);
                
                // Configuração da requisição
                const config = {
                    timeout: 15000, // Aumentado para 15 segundos
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Analisador-Risco-CNPJ/1.0'
                    }
                };
                
                // Fazer a requisição
                const startTime = Date.now();
                
                // Teste de conectividade antes da requisição real
                if (attempt === 1) {
                    try {
                        await axios.head('https://publica.cnpj.ws', { timeout: 5000 });
                    } catch (headError) {
                        logger.error(`Falha no teste de conectividade com a API: ${headError.message}`);
                        // Continua para tentar a requisição real
                    }
                }
                
                const response = await axios.get(`${this.baseURL}${cnpj}`, config);
                const duration = Date.now() - startTime;
                
                logger.info(`CNPJ ${cnpj} consultado com sucesso em ${duration}ms`);
                
                return response.data;
            } catch (error) {
                lastError = error;
                
                // Tratar erros específicos
                if (error.response) {
                    // A requisição foi feita e o servidor respondeu com código de status diferente de 2xx
                    if (error.response.status === 404) {
                        logger.warn(`CNPJ ${cnpj} não encontrado (404)`);
                        throw new Error('CNPJ não encontrado');
                    } else if (error.response.status === 429) {
                        logger.warn(`Limite de requisições excedido (429). Aguardando antes de tentar novamente.`);
                        // Tenta novamente após um tempo maior
                        await new Promise(resolve => setTimeout(resolve, 5000)); 
                    } else {
                        logger.error(`Erro ao consultar CNPJ ${cnpj}: ${error.response.status} - ${error.response.statusText}`);
                        
                        // Para erros 5xx (servidor), tentamos novamente
                        if (error.response.status >= 500 && error.response.status < 600) {
                            logger.warn(`Erro do servidor da API (${error.response.status}). Tentando novamente...`);
                        } else {
                            // Para outros erros HTTP, lançamos uma exceção mais específica
                            throw new Error(`Erro na API externa: Status ${error.response.status} - ${error.response.statusText || 'Erro não especificado'}`);
                        }
                    }
                } else if (error.request) {
                    // A requisição foi feita mas não houve resposta
                    logger.error(`Sem resposta ao consultar CNPJ ${cnpj}: ${error.message}`);
                    
                    // Se for timeout, fornecemos uma mensagem mais clara
                    if (error.code === 'ECONNABORTED') {
                        if (attempt === this.maxRetries) {
                            throw new Error('Timeout ao consultar a API. O servidor está demorando muito para responder.');
                        }
                    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                        if (attempt === this.maxRetries) {
                            throw new Error('Não foi possível conectar ao servidor da API. Verifique sua conexão com a internet.');
                        }
                    }
                } else {
                    // Algo aconteceu na configuração da requisição
                    logger.error(`Erro na configuração da requisição: ${error.message}`);
                }
                
                // Se não for a última tentativa, aguardar antes de tentar novamente
                if (attempt < this.maxRetries) {
                    const delay = this.retryDelay * Math.pow(2, attempt - 1); // Backoff exponencial
                    logger.debug(`Aguardando ${delay}ms antes da próxima tentativa...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        // Se chegou aqui, todas as tentativas falharam
        logger.error(`Todas as ${this.maxRetries} tentativas de consulta do CNPJ ${cnpj} falharam`);
        
        // Criamos uma mensagem de erro mais descritiva
        const errorMessage = lastError && lastError.message 
            ? `Falha ao consultar CNPJ após ${this.maxRetries} tentativas: ${lastError.message}`
            : `Falha ao consultar CNPJ após ${this.maxRetries} tentativas`;
            
        throw new Error(errorMessage);
    }
}

module.exports = new CNPJApiService();