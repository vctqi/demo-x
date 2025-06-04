const { testConnection } = require('../config/database');
const logger = require('../config/logger');

/**
 * Controller para verificação de saúde da aplicação
 */
class HealthController {
  /**
   * Verifica a saúde básica da aplicação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async checkHealth(req, res) {
    try {
      logger.info('Verificação de saúde iniciada', { context: 'HealthController' });
      
      // Verificar conexão com o banco de dados
      const dbStatus = await testConnection();
      
      // Montar resposta
      const health = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        components: {
          database: {
            status: dbStatus ? 'UP' : 'DOWN'
          }
        }
      };
      
      // Definir status HTTP com base no estado dos componentes
      const httpStatus = health.components.database.status === 'UP' ? 200 : 503;
      
      // Definir status geral
      health.status = httpStatus === 200 ? 'UP' : 'DOWN';
      
      logger.info(`Verificação de saúde concluída: ${health.status}`, { context: 'HealthController' });
      
      res.status(httpStatus).json(health);
    } catch (error) {
      logger.error(`Erro na verificação de saúde: ${error.message}`, { context: 'HealthController' });
      
      res.status(500).json({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        error: 'Erro ao verificar saúde da aplicação'
      });
    }
  }
}

module.exports = new HealthController();