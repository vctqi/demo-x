const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('./logger');

// Configuração do banco de dados SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: (msg) => logger.debug(msg, { context: 'Database' }),
});

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados estabelecida com sucesso', { context: 'Database' });
    return true;
  } catch (error) {
    logger.error(`Erro ao conectar ao banco de dados: ${error.message}`, { context: 'Database' });
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};