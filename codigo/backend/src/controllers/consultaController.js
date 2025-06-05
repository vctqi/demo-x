const logger = require('../config/logger');
const cnpjApiService = require('../services/cnpjApiService');
const analiseRiscoService = require('../services/analiseRiscoService');
const consultaRepository = require('../services/consultaRepository');

class ConsultaController {
    /**
     * Consulta um CNPJ e retorna os dados e análise de risco
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async consultarCNPJ(req, res) {
        try {
            const { cnpj } = req.params;
            
            // Remover caracteres não numéricos
            const cnpjNumeros = cnpj.replace(/\D/g, '');
            
            // Validar formato do CNPJ
            if (cnpjNumeros.length !== 14) {
                logger.warn(`CNPJ inválido recebido: ${cnpj}`);
                return res.status(400).json({ error: 'CNPJ inválido. Deve conter 14 dígitos.' });
            }
            
            logger.info(`Iniciando consulta de CNPJ: ${cnpjNumeros}`);
            
            // Verificar se existe uma consulta recente no cache (menos de 24h)
            const consultaCache = await consultaRepository.buscarConsultaRecente(cnpjNumeros);
            
            if (consultaCache) {
                logger.info(`Retornando dados do cache para CNPJ: ${cnpjNumeros}`);
                
                // Formatar a resposta a partir do cache
                return res.json({
                    cnpj: this._formatarCNPJ(cnpjNumeros),
                    razao_social: consultaCache.dados_empresa.razao_social,
                    data_abertura: consultaCache.dados_empresa.inicio_atividade || consultaCache.dados_empresa.data_abertura,
                    situacao_cadastral: this._obterSituacaoCadastral(consultaCache.dados_empresa),
                    cnae_principal: this._obterCNAEPrincipal(consultaCache.dados_empresa),
                    porte: this._obterPorte(consultaCache.dados_empresa),
                    municipio: this._obterMunicipio(consultaCache.dados_empresa),
                    uf: this._obterUF(consultaCache.dados_empresa),
                    score: consultaCache.score,
                    classificacao_risco: consultaCache.classificacao_risco,
                    criterios: consultaCache.criterios_aplicados,
                    data_consulta: consultaCache.data_consulta,
                    cache: true
                });
            }
            
            // Se não estiver em cache, consultar a API
            const dadosEmpresa = await cnpjApiService.consultarCNPJ(cnpjNumeros);
            
            // Calcular o risco
            const { score, classificacao, criterios } = analiseRiscoService.calcularRisco(dadosEmpresa);
            
            // Salvar a consulta no banco de dados
            await consultaRepository.salvarConsulta(
                cnpjNumeros,
                dadosEmpresa,
                score,
                classificacao,
                criterios
            );
            
            // Formatar e retornar a resposta
            return res.json({
                cnpj: this._formatarCNPJ(cnpjNumeros),
                razao_social: dadosEmpresa.razao_social,
                data_abertura: dadosEmpresa.inicio_atividade || dadosEmpresa.data_abertura,
                situacao_cadastral: this._obterSituacaoCadastral(dadosEmpresa),
                cnae_principal: this._obterCNAEPrincipal(dadosEmpresa),
                porte: this._obterPorte(dadosEmpresa),
                municipio: this._obterMunicipio(dadosEmpresa),
                uf: this._obterUF(dadosEmpresa),
                score,
                classificacao_risco: classificacao,
                criterios,
                data_consulta: new Date(),
                cache: false
            });
            
        } catch (error) {
            logger.error(`Erro ao processar consulta: ${error.message}`);
            
            // Tratar erros específicos
            if (error.message.includes('CNPJ inválido')) {
                return res.status(400).json({ error: error.message });
            } else if (error.message.includes('CNPJ não encontrado')) {
                return res.status(404).json({ error: 'CNPJ não encontrado na base de dados.' });
            } else if (error.response && error.response.status) {
                return res.status(error.response.status).json({ error: `Erro na API externa: ${error.message}` });
            }
            
            // Erro genérico
            return res.status(500).json({ error: 'Erro ao processar a consulta. Tente novamente mais tarde.' });
        }
    }
    
    /**
     * Formata um CNPJ com máscara
     * @private
     * @param {string} cnpj - CNPJ sem formatação
     * @returns {string} CNPJ formatado
     */
    _formatarCNPJ(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    
    /**
     * Obtém a situação cadastral formatada
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} Situação cadastral
     */
    _obterSituacaoCadastral(dadosEmpresa) {
        if (!dadosEmpresa.situacao_cadastral) return 'Não disponível';
        
        if (typeof dadosEmpresa.situacao_cadastral === 'object') {
            return dadosEmpresa.situacao_cadastral.descricao || 'Não disponível';
        }
        
        return dadosEmpresa.situacao_cadastral;
    }
    
    /**
     * Obtém o CNAE principal formatado
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} CNAE principal
     */
    _obterCNAEPrincipal(dadosEmpresa) {
        if (!dadosEmpresa.atividade_principal) return 'Não disponível';
        
        if (typeof dadosEmpresa.atividade_principal === 'object') {
            const { codigo, descricao } = dadosEmpresa.atividade_principal;
            if (codigo && descricao) {
                return `${codigo} - ${descricao}`;
            } else if (codigo) {
                return codigo;
            } else if (descricao) {
                return descricao;
            }
        }
        
        return dadosEmpresa.atividade_principal;
    }
    
    /**
     * Obtém o porte da empresa
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} Porte da empresa
     */
    _obterPorte(dadosEmpresa) {
        if (!dadosEmpresa.porte) return 'Não disponível';
        
        if (typeof dadosEmpresa.porte === 'object') {
            return dadosEmpresa.porte.descricao || 'Não disponível';
        }
        
        return dadosEmpresa.porte;
    }
    
    /**
     * Obtém o município da empresa
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} Município
     */
    _obterMunicipio(dadosEmpresa) {
        if (!dadosEmpresa.endereco) return 'Não disponível';
        
        if (dadosEmpresa.endereco.municipio) {
            if (typeof dadosEmpresa.endereco.municipio === 'object') {
                return dadosEmpresa.endereco.municipio.descricao || 'Não disponível';
            }
            return dadosEmpresa.endereco.municipio;
        }
        
        return 'Não disponível';
    }
    
    /**
     * Obtém a UF da empresa
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} UF
     */
    _obterUF(dadosEmpresa) {
        if (!dadosEmpresa.endereco) return 'Não disponível';
        
        return dadosEmpresa.endereco.uf || 'Não disponível';
    }
}

module.exports = new ConsultaController();