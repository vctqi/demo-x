const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RiskAnalysis = sequelize.define(
    'RiskAnalysis',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'cnpj',
        },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      riskLevel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['Baixo', 'Médio', 'Alto']],
        },
      },
      scoreFactors: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      analysisDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'risk_analyses',
      timestamps: true,
    }
  );

  return RiskAnalysis;
};