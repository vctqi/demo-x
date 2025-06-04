const { Company } = require('../models');
const logger = require('../utils/logger');

class CompanyRepository {
  /**
   * Busca uma empresa pelo CNPJ
   * @param {string} cnpj CNPJ sem formatação
   * @returns {Promise<Object|null>} Dados da empresa ou null se não encontrada
   */
  async findByCNPJ(cnpj) {
    try {
      const company = await Company.findByPk(cnpj);
      return company ? company.toJSON() : null;
    } catch (error) {
      logger.error(`Erro ao buscar empresa pelo CNPJ ${cnpj}:`, error);
      throw error;
    }
  }

  /**
   * Salva ou atualiza os dados de uma empresa
   * @param {Object} companyData Dados da empresa
   * @returns {Promise<Object>} Empresa salva
   */
  async saveCompany(companyData) {
    try {
      // Verificação adicional antes de salvar
      if (!companyData.cnpj || companyData.cnpj.length !== 14) {
        logger.error(`CNPJ inválido ao tentar salvar empresa. CNPJ: ${companyData.cnpj}`);
        throw new Error('CNPJ inválido ao tentar salvar empresa');
      }
      
      // Log detalhado para depuração
      logger.info(`Tentando salvar empresa com os dados: ${JSON.stringify(companyData, null, 2)}`);
      
      const [company, created] = await Company.upsert(companyData);
      logger.info(`Empresa ${companyData.cnpj} ${created ? 'criada' : 'atualizada'}`);
      return company.toJSON();
    } catch (error) {
      logger.error(`Erro ao salvar empresa ${companyData?.cnpj || 'sem CNPJ'}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se os dados da empresa estão expirados (mais de 24h)
   * @param {Object} company Dados da empresa
   * @returns {boolean} True se os dados estiverem expirados
   */
  isExpired(company) {
    if (!company || !company.lastUpdated) return true;
    
    const lastUpdated = new Date(company.lastUpdated);
    const now = new Date();
    const diffHours = Math.abs(now - lastUpdated) / 36e5; // Diferença em horas
    
    return diffHours > 24;
  }
}

module.exports = new CompanyRepository();