const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para armazenar classificação de CNAEs por nível de risco
const CNAE = sequelize.define('CNAE', {
  codigo: {
    type: DataTypes.STRING(7),
    primaryKey: true,
    allowNull: false,
    validate: {
      is: /^[0-9]{4}-[0-9]\/[0-9]{2}$|^[0-9]{7}$/,
    },
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivelRisco: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Baixo', 'Médio', 'Alto']],
    },
  },
  pontuacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'cnaes',
  timestamps: false,
  indexes: [
    {
      name: 'idx_cnaes_nivel_risco',
      fields: ['nivelRisco'],
    },
  ],
});

module.exports = CNAE;