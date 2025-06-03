const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../utils/logger');

// Inicializa a conexão com o banco de dados SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.database.path,
  logging: (msg) => logger.debug(msg),
});

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    logger.error('Não foi possível conectar ao banco de dados:', error);
    return false;
  }
};

// Função para sincronizar os modelos com o banco de dados
const syncModels = async () => {
  try {
    await sequelize.sync();
    logger.info('Modelos sincronizados com o banco de dados.');
    return true;
  } catch (error) {
    logger.error('Erro ao sincronizar modelos com o banco de dados:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels,
};