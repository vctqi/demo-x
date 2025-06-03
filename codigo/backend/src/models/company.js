const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define(
    'Company',
    {
      cnpj: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          len: [14, 18], // CNPJ with or without formatting
        },
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tradeName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      openingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cnae: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cnaeDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastConsultation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'companies',
      timestamps: true,
    }
  );

  return Company;
};