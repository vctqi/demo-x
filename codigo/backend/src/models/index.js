const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

// Import models
const Company = require('./company')(sequelize);
const RiskAnalysis = require('./riskAnalysis')(sequelize);
const ConsultationHistory = require('./consultationHistory')(sequelize);

// Define associations
Company.hasMany(RiskAnalysis, { foreignKey: 'cnpj' });
RiskAnalysis.belongsTo(Company, { foreignKey: 'cnpj' });

Company.hasMany(ConsultationHistory, { foreignKey: 'cnpj' });
ConsultationHistory.belongsTo(Company, { foreignKey: 'cnpj' });

module.exports = {
  sequelize,
  Company,
  RiskAnalysis,
  ConsultationHistory,
};