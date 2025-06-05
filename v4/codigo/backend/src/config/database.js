const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

// Garantir que o diretório do banco de dados exista
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Caminho do arquivo do banco de dados
const dbPath = process.env.DB_PATH || path.join(dbDir, 'analisador.sqlite');

// Criar instância do Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: (msg) => logger.debug(msg),
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Conexão com o banco de dados estabelecida com sucesso.');
        return true;
    } catch (error) {
        logger.error(`Erro ao conectar com o banco de dados: ${error.message}`);
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
        logger.error(`Erro ao sincronizar modelos: ${error.message}`);
        return false;
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncModels
};