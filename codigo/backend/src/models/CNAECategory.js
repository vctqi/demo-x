const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para categorias de CNAE (para análise de risco)
const CNAECategory = sequelize.define('CNAECategory', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  riskLevel: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'risk_level',
    validate: {
      isIn: [['HIGH', 'LOW', 'NEUTRAL']]
    }
  }
}, {
  tableName: 'cnae_categories',
  timestamps: false
});

module.exports = CNAECategory;