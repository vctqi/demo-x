const cnpjApiService = require('./cnpjApiService');
const riskAnalysisService = require('./riskAnalysisService');
const { Company, RiskAnalysis } = require('../models');
const logger = require('../config/logger');

/**
 * Serviço para processamento de CNPJ
 */
class CnpjService {
  /**
   * Processa um CNPJ: consulta, analisa risco e salva os dados
   * @param {string} cnpj - CNPJ a ser processado (com ou sem formatação)
   * @returns {Promise<Object>} - Resultado do processamento
   */
  async processCnpj(cnpj) {
    try {
      // Remover formatação do CNPJ
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      logger.info(`Iniciando processamento do CNPJ ${cnpjLimpo}`, { context: 'CnpjService' });
      
      // Verificar se já existe no banco de dados
      const existingCompany = await this.getExistingCompany(cnpjLimpo);
      
      if (existingCompany) {
        logger.info(`CNPJ ${cnpjLimpo} encontrado no banco de dados`, { context: 'CnpjService' });
        
        // Realizar nova análise de risco para garantir dados atualizados
        const riskAnalysis = await this.createRiskAnalysis(existingCompany);
        
        return {
          company: existingCompany,
          riskAnalysis
        };
      }
      
      // Consultar CNPJ na API externa
      const apiResponse = await cnpjApiService.consultarCnpj(cnpjLimpo);
      
      // Verificar se o CNPJ não foi encontrado
      if (apiResponse && apiResponse.notFound) {
        logger.warn(`CNPJ ${cnpjLimpo} não encontrado na API`, { context: 'CnpjService' });
        return { notFound: true };
      }
      
      // Verificar se a resposta é válida
      if (!apiResponse || !apiResponse.razaoSocial) {
        logger.error(`Dados inválidos ou incompletos para o CNPJ ${cnpjLimpo}`, { context: 'CnpjService' });
        throw new Error('Dados inválidos ou incompletos retornados pela API');
      }
      
      // Salvar dados da empresa no banco
      const company = await this.saveCompany(apiResponse);
      
      // Realizar análise de risco
      const riskAnalysis = await this.createRiskAnalysis(company);
      
      logger.info(`Processamento do CNPJ ${cnpjLimpo} concluído com sucesso`, { context: 'CnpjService' });
      
      return {
        company,
        riskAnalysis
      };
    } catch (error) {
      logger.error(`Erro ao processar CNPJ: ${error.message}`, { context: 'CnpjService' });
      throw error;
    }
  }
  
  /**
   * Busca uma empresa no banco de dados pelo CNPJ
   * @param {string} cnpj - CNPJ da empresa (apenas números)
   * @returns {Promise<Object|null>} - Dados da empresa ou null se não encontrada
   */
  async getExistingCompany(cnpj) {
    try {
      return await Company.findByPk(cnpj);
    } catch (error) {
      logger.error(`Erro ao buscar empresa no banco: ${error.message}`, { context: 'CnpjService' });
      return null;
    }
  }
  
  /**
   * Salva os dados da empresa no banco de dados
   * @param {Object} companyData - Dados da empresa
   * @returns {Promise<Object>} - Empresa salva
   */
  async saveCompany(companyData) {
    try {
      // Log detalhado dos dados antes de salvar para depuração
      logger.debug(`Tentando salvar empresa. CNPJ: ${companyData.cnpj}, CNAE: ${companyData.cnae}`, 
        { context: 'CnpjService' });
      
      // Verificar e corrigir dados obrigatórios antes de salvar
      const validatedData = this.validateCompanyData(companyData);
      
      // Criar ou atualizar registro da empresa
      const [company, created] = await Company.upsert(validatedData, {
        returning: true
      });
      
      const action = created ? 'criada' : 'atualizada';
      logger.info(`Empresa ${validatedData.cnpj} ${action} no banco de dados`, { context: 'CnpjService' });
      
      return company;
    } catch (error) {
      logger.error(`Erro ao salvar empresa: ${error.message}`, { context: 'CnpjService' });
      throw error;
    }
  }
  
  /**
   * Valida e corrige os dados da empresa antes de salvar
   * @param {Object} data - Dados da empresa
   * @returns {Object} - Dados validados
   */
  validateCompanyData(data) {
    // Clonar o objeto para não modificar o original
    const validated = { ...data };
    
    // Verificar campos obrigatórios e fornecer valores padrão se necessário
    if (!validated.cnpj || validated.cnpj === '') {
      logger.warn('CNPJ não informado. Usando valor padrão.', { context: 'CnpjService' });
      validated.cnpj = '00000000000000';
    }
    
    if (!validated.razaoSocial || validated.razaoSocial === '') {
      logger.warn('Razão Social não informada. Usando valor padrão.', { context: 'CnpjService' });
      validated.razaoSocial = 'Empresa não identificada';
    }
    
    if (!validated.situacao || validated.situacao === '') {
      logger.warn('Situação não informada. Usando valor padrão.', { context: 'CnpjService' });
      validated.situacao = 'Desconhecida';
    }
    
    if (!validated.dataAbertura || validated.dataAbertura === '') {
      logger.warn('Data de Abertura não informada. Usando valor padrão.', { context: 'CnpjService' });
      validated.dataAbertura = '2000-01-01';
    }
    
    if (!validated.cnae || validated.cnae === '') {
      logger.warn('CNAE não informado. Usando valor padrão.', { context: 'CnpjService' });
      validated.cnae = '0000000';
    }
    
    // Garantir que o CNPJ tenha 14 dígitos
    validated.cnpj = validated.cnpj.replace(/[^\d]/g, '').padEnd(14, '0');
    
    return validated;
  }
  
  /**
   * Cria uma análise de risco para uma empresa
   * @param {Object} company - Dados da empresa
   * @returns {Promise<Object>} - Análise de risco
   */
  async createRiskAnalysis(company) {
    try {
      // Calcular o score e nível de risco
      const analysisResult = await riskAnalysisService.analyzeRisk(company);
      
      // Salvar a análise no banco de dados
      const riskAnalysis = await RiskAnalysis.create({
        cnpj: company.cnpj,
        score: analysisResult.score,
        riskLevel: analysisResult.riskLevel,
        factors: analysisResult.factors
      });
      
      logger.info(`Análise de risco criada para CNPJ ${company.cnpj}. Score: ${analysisResult.score}, Risco: ${analysisResult.riskLevel}`, 
        { context: 'CnpjService' });
      
      return riskAnalysis;
    } catch (error) {
      logger.error(`Erro ao criar análise de risco: ${error.message}`, { context: 'CnpjService' });
      throw error;
    }
  }
}

module.exports = new CnpjService();