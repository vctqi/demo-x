const { sequelize } = require('../config/database');
const Company = require('./Company');
const RiskAnalysis = require('./RiskAnalysis');
const CNAECategory = require('./CNAECategory');
const logger = require('../config/logger');

// Função para inicializar o banco de dados
const initializeDatabase = async () => {
  try {
    // Sincronizar todos os modelos com o banco de dados
    await sequelize.sync();
    logger.info('Modelos sincronizados com o banco de dados', { context: 'Database' });
    
    // Inicializar dados de categorias de CNAE
    await initializeCnaeCategories();
    
    return true;
  } catch (error) {
    logger.error(`Erro ao inicializar banco de dados: ${error.message}`, { context: 'Database' });
    return false;
  }
};

// Função para inicializar as categorias de CNAE
const initializeCnaeCategories = async () => {
  try {
    // Verificar se já existem dados
    const count = await CNAECategory.count();
    
    if (count === 0) {
      // Dados iniciais para categorias de CNAE conforme regras de negócio
      const initialCnaeData = [
        { code: '6491-3/00', description: 'Sociedades de fomento mercantil - factoring', riskLevel: 'HIGH' },
        { code: '4120-4/00', description: 'Construção de edifícios', riskLevel: 'HIGH' },
        { code: '4399-1/99', description: 'Serviços especializados para construção', riskLevel: 'HIGH' },
        { code: '9609-2/07', description: 'Alojamento de animais domésticos', riskLevel: 'HIGH' },
        { code: '9200-3/99', description: 'Exploração de jogos de azar e apostas', riskLevel: 'HIGH' },
        { code: '4711-3/01', description: 'Comércio varejista de mercadorias em geral', riskLevel: 'HIGH' },
        
        { code: '6201-5/01', description: 'Desenvolvimento de software', riskLevel: 'LOW' },
        { code: '8550-3/02', description: 'Atividades de apoio à educação', riskLevel: 'LOW' },
        { code: '7210-0/00', description: 'Pesquisa e desenvolvimento', riskLevel: 'LOW' },
        { code: '8621-6/01', description: 'UTI móvel', riskLevel: 'LOW' },
        { code: '8630-5/03', description: 'Laboratório clínico', riskLevel: 'LOW' }
      ];
      
      // Inserir dados
      await CNAECategory.bulkCreate(initialCnaeData);
      logger.info('Categorias de CNAE inicializadas com sucesso', { context: 'Database' });
    }
  } catch (error) {
    logger.error(`Erro ao inicializar categorias de CNAE: ${error.message}`, { context: 'Database' });
    throw error;
  }
};

module.exports = {
  sequelize,
  Company,
  RiskAnalysis,
  CNAECategory,
  initializeDatabase
};