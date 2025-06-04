const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para armazenar dados das empresas consultadas
const Company = sequelize.define('Company', {
  cnpj: {
    type: DataTypes.STRING(14),
    primaryKey: true,
    allowNull: false,
    validate: {
      is: /^[0-9]{14}$/,
    },
  },
  razaoSocial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nomeFantasia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  situacaoCadastral: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dataAbertura: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cnaePrincipal: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  cnaeDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  porte: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uf: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  riskLevel: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Baixo', 'Médio', 'Alto']],
    },
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'companies',
  timestamps: false,
  indexes: [
    {
      name: 'idx_companies_risk_level',
      fields: ['riskLevel'],
    },
  ],
});

module.exports = Company;