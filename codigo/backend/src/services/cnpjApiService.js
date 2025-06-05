const axios = require('axios');
const logger = require('../config/logger');

class CNPJApiService {
    constructor() {
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

        // Tentar consultar a API com retry em caso de falha
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
                    timeout: 10000, // 10 segundos
                };
                
                // Fazer a requisição
                const startTime = Date.now();
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
                    } else {
                        logger.error(`Erro ao consultar CNPJ ${cnpj}: ${error.response.status} - ${error.response.statusText}`);
                    }
                } else if (error.request) {
                    // A requisição foi feita mas não houve resposta
                    logger.error(`Sem resposta ao consultar CNPJ ${cnpj}: ${error.message}`);
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
        throw lastError || new Error('Falha ao consultar CNPJ após várias tentativas');
    }
}

module.exports = new CNPJApiService();