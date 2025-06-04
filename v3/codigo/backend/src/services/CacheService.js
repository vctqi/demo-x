const NodeCache = require('node-cache');
const config = require('../config/config');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    // Inicializa o cache com TTL padrão de 24 horas
    this.cache = new NodeCache({ 
      stdTTL: config.cache.ttl,
      checkperiod: 120 // Verifica expiração a cada 2 minutos
    });
  }

  /**
   * Armazena um valor no cache
   * @param {string} key Chave do cache
   * @param {any} value Valor a ser armazenado
   * @param {number} ttl Tempo de vida em segundos (opcional)
   * @returns {boolean} True se armazenado com sucesso
   */
  set(key, value, ttl = config.cache.ttl) {
    try {
      const success = this.cache.set(key, value, ttl);
      if (success) {
        logger.debug(`Cache: Valor armazenado para chave ${key}`);
      } else {
        logger.warn(`Cache: Falha ao armazenar valor para chave ${key}`);
      }
      return success;
    } catch (error) {
      logger.error(`Cache: Erro ao armazenar valor para chave ${key}:`, error);
      return false;
    }
  }

  /**
   * Recupera um valor do cache
   * @param {string} key Chave do cache
   * @returns {any|undefined} Valor armazenado ou undefined se não encontrado
   */
  get(key) {
    try {
      const value = this.cache.get(key);
      if (value === undefined) {
        logger.debug(`Cache: Chave ${key} não encontrada`);
      } else {
        logger.debug(`Cache: Valor recuperado para chave ${key}`);
      }
      return value;
    } catch (error) {
      logger.error(`Cache: Erro ao recuperar valor para chave ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Remove um valor do cache
   * @param {string} key Chave do cache
   * @returns {number} Número de chaves removidas (0 ou 1)
   */
  del(key) {
    try {
      const count = this.cache.del(key);
      logger.debug(`Cache: ${count} chave(s) removida(s) para ${key}`);
      return count;
    } catch (error) {
      logger.error(`Cache: Erro ao remover chave ${key}:`, error);
      return 0;
    }
  }

  /**
   * Limpa todo o cache
   * @returns {void}
   */
  flush() {
    try {
      this.cache.flushAll();
      logger.info('Cache: Todo o cache foi limpo');
    } catch (error) {
      logger.error('Cache: Erro ao limpar todo o cache:', error);
    }
  }

  /**
   * Verifica se uma chave existe no cache
   * @param {string} key Chave do cache
   * @returns {boolean} True se a chave existir
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Retorna estatísticas do cache
   * @returns {Object} Estatísticas do cache
   */
  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheService();