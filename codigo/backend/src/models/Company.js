const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para os dados da empresa
const Company = sequelize.define('Company', {
  cnpj: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      // Validação para garantir que o CNPJ tenha o formato correto
      is: /^\d{14}$/
    }
  },
  razaoSocial: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'razao_social'
  },
  nomeFantasia: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nome_fantasia'
  },
  situacao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataAbertura: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_abertura'
  },
  cnae: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricaoCnae: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'descricao_cnae'
  },
  porte: {
    type: DataTypes.STRING,
    allowNull: true
  },
  municipio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  uf: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'companies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Company;