const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Company = require('./Company');

// Modelo para análise de risco
const RiskAnalysis = sequelize.define('RiskAnalysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Company,
      key: 'cnpj'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  riskLevel: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'risk_level',
    validate: {
      isIn: [['BAIXO', 'MÉDIO', 'ALTO']]
    }
  },
  factors: {
    type: DataTypes.TEXT, // JSON string com fatores que impactaram o score
    allowNull: false,
    get() {
      const value = this.getDataValue('factors');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('factors', JSON.stringify(value));
    }
  }
}, {
  tableName: 'risk_analyses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Estabelecer relação com Company
RiskAnalysis.belongsTo(Company, { foreignKey: 'cnpj' });
Company.hasMany(RiskAnalysis, { foreignKey: 'cnpj' });

module.exports = RiskAnalysis;