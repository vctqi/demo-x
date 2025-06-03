const { CNAE } = require('../models');
const logger = require('../utils/logger');

class CNAERepository {
  /**
   * Busca um CNAE pelo código
   * @param {string} codigo Código do CNAE
   * @returns {Promise<Object|null>} Dados do CNAE ou null se não encontrado
   */
  async findByCodigo(codigo) {
    try {
      const cnae = await CNAE.findByPk(codigo);
      return cnae ? cnae.toJSON() : null;
    } catch (error) {
      logger.error(`Erro ao buscar CNAE pelo código ${codigo}:`, error);
      throw error;
    }
  }

  /**
   * Retorna a pontuação de risco para um CNAE
   * @param {string} codigo Código do CNAE
   * @returns {Promise<number>} Pontuação de risco (padrão: 0 para CNAEs não classificados)
   */
  async getRiskScore(codigo) {
    try {
      const cnae = await this.findByCodigo(codigo);
      return cnae ? cnae.pontuacao : 0; // Retorna 0 para CNAEs não classificados
    } catch (error) {
      logger.error(`Erro ao obter pontuação de risco para CNAE ${codigo}:`, error);
      return 0; // Em caso de erro, retorna 0 (risco neutro)
    }
  }

  /**
   * Busca todos os CNAEs por nível de risco
   * @param {string} nivelRisco Nível de risco (Baixo, Médio, Alto)
   * @returns {Promise<Array>} Lista de CNAEs
   */
  async findByRiskLevel(nivelRisco) {
    try {
      const cnaes = await CNAE.findAll({
        where: { nivelRisco },
      });
      return cnaes.map(cnae => cnae.toJSON());
    } catch (error) {
      logger.error(`Erro ao buscar CNAEs por nível de risco ${nivelRisco}:`, error);
      throw error;
    }
  }

  /**
   * Inicializa a tabela de CNAEs com dados padrão
   * @param {Array} cnaesData Lista de dados de CNAEs para seed
   * @returns {Promise<void>}
   */
  async seedInitialData(cnaesData) {
    try {
      // Verifica se já existem dados
      const count = await CNAE.count();
      
      // Se não houver dados, insere os dados iniciais
      if (count === 0 && Array.isArray(cnaesData) && cnaesData.length > 0) {
        await CNAE.bulkCreate(cnaesData);
        logger.info(`Inseridos ${cnaesData.length} CNAEs no banco de dados`);
      }
    } catch (error) {
      logger.error('Erro ao inserir dados iniciais de CNAEs:', error);
      throw error;
    }
  }
}

module.exports = new CNAERepository();