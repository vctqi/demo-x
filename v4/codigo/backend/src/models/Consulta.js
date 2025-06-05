const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Definição do modelo Consulta
const Consulta = sequelize.define('Consulta', {
    // ID único da consulta
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // CNPJ consultado (sem formatação)
    cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        validate: {
            len: [14, 14],
            isNumeric: true
        }
    },
    
    // Data e hora da consulta
    data_consulta: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
    // Dados completos da empresa obtidos da API
    dados_empresa: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('dados_empresa');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('dados_empresa', JSON.stringify(value));
        }
    },
    
    // Score calculado
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
    // Classificação de risco (Baixo, Médio, Alto)
    classificacao_risco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Baixo', 'Médio', 'Alto']]
        }
    },
    
    // Critérios aplicados no cálculo do score
    criterios_aplicados: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('criterios_aplicados');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('criterios_aplicados', JSON.stringify(value));
        }
    }
});

module.exports = Consulta;