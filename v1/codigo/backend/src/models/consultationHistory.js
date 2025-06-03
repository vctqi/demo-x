const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConsultationHistory = sequelize.define(
    'ConsultationHistory',
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
      consultationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      userSession: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'consultation_history',
      timestamps: true,
    }
  );

  return ConsultationHistory;
};