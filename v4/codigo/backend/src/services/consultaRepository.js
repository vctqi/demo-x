const Consulta = require('../models/Consulta');
const logger = require('../config/logger');
const moment = require('moment');

class ConsultaRepository {
    /**
     * Salva uma nova consulta no banco de dados
     * @param {string} cnpj - CNPJ consultado
     * @param {Object} dadosEmpresa - Dados da empresa obtidos da API
     * @param {number} score - Score calculado
     * @param {string} classificacaoRisco - Classificação de risco (Baixo, Médio, Alto)
     * @param {Array} criterios - Critérios aplicados no cálculo do score
     * @returns {Promise<Object>} Consulta salva
     */
    async salvarConsulta(cnpj, dadosEmpresa, score, classificacaoRisco, criterios) {
        try {
            logger.info(`Salvando consulta para CNPJ: ${cnpj}`);
            
            const consulta = await Consulta.create({
                cnpj: cnpj.replace(/\D/g, ''),
                data_consulta: new Date(),
                dados_empresa: dadosEmpresa,
                score,
                classificacao_risco: classificacaoRisco,
                criterios_aplicados: criterios
            });
            
            logger.info(`Consulta salva com sucesso. ID: ${consulta.id}`);
            
            return consulta;
        } catch (error) {
            logger.error(`Erro ao salvar consulta: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Busca uma consulta recente (menos de 24h) pelo CNPJ
     * @param {string} cnpj - CNPJ a ser buscado
     * @returns {Promise<Object|null>} Consulta encontrada ou null
     */
    async buscarConsultaRecente(cnpj) {
        try {
            const cnpjNumeros = cnpj.replace(/\D/g, '');
            logger.info(`Buscando consulta recente para CNPJ: ${cnpjNumeros}`);
            
            // Calcular a data limite (24 horas atrás)
            const horasCache = process.env.CACHE_DURATION_HOURS || 24;
            const dataLimite = moment().subtract(horasCache, 'hours').toDate();
            
            // Buscar consulta
            const { Op } = require('sequelize');
            const consulta = await Consulta.findOne({
                where: {
                    cnpj: cnpjNumeros,
                    data_consulta: {
                        [Op.gte]: dataLimite
                    }
                },
                order: [['data_consulta', 'DESC']]
            });
            
            if (consulta) {
                logger.info(`Consulta recente encontrada. ID: ${consulta.id}, Data: ${consulta.data_consulta}`);
            } else {
                logger.info(`Nenhuma consulta recente encontrada para CNPJ: ${cnpjNumeros}`);
            }
            
            return consulta;
        } catch (error) {
            logger.error(`Erro ao buscar consulta recente: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Lista todas as consultas de um CNPJ ordenadas por data
     * @param {string} cnpj - CNPJ a ser buscado
     * @returns {Promise<Array>} Lista de consultas
     */
    async listarConsultasPorCNPJ(cnpj) {
        try {
            const cnpjNumeros = cnpj.replace(/\D/g, '');
            logger.info(`Listando consultas para CNPJ: ${cnpjNumeros}`);
            
            const consultas = await Consulta.findAll({
                where: {
                    cnpj: cnpjNumeros
                },
                order: [['data_consulta', 'DESC']]
            });
            
            logger.info(`${consultas.length} consultas encontradas para CNPJ: ${cnpjNumeros}`);
            
            return consultas;
        } catch (error) {
            logger.error(`Erro ao listar consultas: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ConsultaRepository();