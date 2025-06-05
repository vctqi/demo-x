const logger = require('../config/logger');
const moment = require('moment');

class AnaliseRiscoService {
    /**
     * Calcula o score de risco baseado nos dados da empresa
     * @param {Object} dadosEmpresa - Dados da empresa obtidos da API
     * @returns {Object} Score calculado, classificação e critérios aplicados
     */
    calcularRisco(dadosEmpresa) {
        logger.info(`Calculando risco para empresa: ${dadosEmpresa.razao_social || dadosEmpresa.cnpj}`);
        
        let score = 0;
        const criterios = [];
        
        // Verificar situação cadastral
        if (this._verificarEmpresaAtiva(dadosEmpresa)) {
            score += 10;
            criterios.push({ nome: 'Empresa ativa', pontuacao: 10 });
        } else {
            score -= 20;
            criterios.push({ nome: 'Empresa inativa/suspensa', pontuacao: -20 });
        }
        
        // Verificar tempo de operação
        const tempoOperacao = this._calcularTempoOperacao(dadosEmpresa);
        
        if (tempoOperacao >= 3) { // Mais de 3 anos
            score += 10;
            criterios.push({ nome: 'Mais de 3 anos de operação', pontuacao: 10 });
        } else if (tempoOperacao < 0.5) { // Menos de 6 meses
            score -= 10;
            criterios.push({ nome: 'Empresa aberta há menos de 6 meses', pontuacao: -10 });
        }
        
        // Verificar CNAE de risco
        const riscoAtividade = this._avaliarRiscoCNAE(dadosEmpresa);
        
        if (riscoAtividade === 'baixo') {
            score += 10;
            criterios.push({ nome: 'CNAE de baixo risco', pontuacao: 10 });
        } else if (riscoAtividade === 'alto') {
            score -= 10;
            criterios.push({ nome: 'CNAE de risco', pontuacao: -10 });
        }
        
        // Determinar classificação baseada no score
        let classificacao;
        if (score >= 20) {
            classificacao = 'Baixo';
        } else if (score >= 0) {
            classificacao = 'Médio';
        } else {
            classificacao = 'Alto';
        }
        
        logger.info(`Score calculado: ${score}, Classificação: ${classificacao}`);
        
        return {
            score,
            classificacao,
            criterios
        };
    }
    
    /**
     * Verifica se a empresa está ativa
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {boolean} True se a empresa estiver ativa
     */
    _verificarEmpresaAtiva(dadosEmpresa) {
        // Verificar se a situação cadastral existe e é ativa
        if (dadosEmpresa.situacao_cadastral) {
            if (typeof dadosEmpresa.situacao_cadastral === 'object') {
                // API retorna um objeto com descrição
                return dadosEmpresa.situacao_cadastral.descricao?.toLowerCase() === 'ativa';
            } else {
                // Pode ser uma string direta
                return dadosEmpresa.situacao_cadastral.toLowerCase() === 'ativa';
            }
        }
        
        // Se não tiver informação, considerar como não ativa
        return false;
    }
    
    /**
     * Calcula o tempo de operação da empresa em anos
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {number} Tempo de operação em anos (ou -1 se não for possível calcular)
     */
    _calcularTempoOperacao(dadosEmpresa) {
        // Verificar se há data de início de atividade
        let dataAbertura = null;
        if (dadosEmpresa.estabelecimento && dadosEmpresa.estabelecimento.data_inicio_atividade) {
            dataAbertura = dadosEmpresa.estabelecimento.data_inicio_atividade;
        } else if (dadosEmpresa.inicio_atividade) { // Fallback for older/different structures if any
            dataAbertura = dadosEmpresa.inicio_atividade;
        } else if (dadosEmpresa.data_abertura) { // Another fallback
            dataAbertura = dadosEmpresa.data_abertura;
        }
        
        if (!dataAbertura) {
            logger.warn('Data de abertura não encontrada nos dados da empresa. Verificados: dadosEmpresa.estabelecimento.data_inicio_atividade, dadosEmpresa.inicio_atividade, dadosEmpresa.data_abertura');
            return -1;
        }
        
        // Calcular a diferença entre hoje e a data de abertura
        const hoje = moment();
        const abertura = moment(dataAbertura);
        
        // Verificar se a data é válida
        if (!abertura.isValid()) {
            logger.warn(`Data de abertura inválida: ${dataAbertura}`);
            return -1;
        }
        
        // Calcular a diferença em anos
        const anos = hoje.diff(abertura, 'years', true);
        
        logger.debug(`Tempo de operação calculado: ${anos.toFixed(1)} anos`);
        
        return anos;
    }
    
    /**
     * Avalia o risco do CNAE da empresa
     * @private
     * @param {Object} dadosEmpresa - Dados da empresa
     * @returns {string} Nível de risco ('baixo', 'medio', 'alto')
     */
    _avaliarRiscoCNAE(dadosEmpresa) {
        // Obter o CNAE principal
        let cnae = '';
        
        if (dadosEmpresa.atividade_principal) {
            if (typeof dadosEmpresa.atividade_principal === 'object') {
                cnae = dadosEmpresa.atividade_principal.codigo || '';
            } else {
                // Pode ser uma string
                cnae = dadosEmpresa.atividade_principal;
            }
        }
        
        if (!cnae) {
            logger.warn('CNAE principal não encontrado nos dados da empresa');
            return 'medio'; // Se não encontrar, considerar risco médio
        }
        
        // Remover pontuação se houver
        cnae = cnae.replace(/\D/g, '');
        
        // Lista de CNAEs de alto risco (exemplos)
        const cnaesAltoRisco = [
            '6491300', // Sociedades de Fomento Mercantil - Factoring
            '6493000', // Administração de consórcios
            '6619302', // Correspondentes de instituições financeiras
            '9200300', // Exploração de jogos de azar e apostas
            '4711300', // Comércio varejista de mercadorias em geral (alto índice de fraudes)
            '4120400', // Construção de edifícios
            '4399199'  // Serviços especializados para construção
        ];
        
        // Lista de CNAEs de baixo risco (exemplos)
        const cnaesBaixoRisco = [
            '6201501', // Desenvolvimento de programas de computador sob encomenda
            '6202300', // Desenvolvimento e licenciamento de programas de computador customizáveis
            '8599604', // Treinamento em desenvolvimento profissional e gerencial
            '7020400', // Atividades de consultoria em gestão empresarial
            '6203100', // Desenvolvimento e licenciamento de programas de computador não-customizáveis
            '8211300', // Serviços combinados de escritório e apoio administrativo
            '6209100'  // Suporte técnico, manutenção e outros serviços em tecnologia da informação
        ];
        
        // Verificar se o CNAE está nas listas
        if (cnaesAltoRisco.some(c => cnae.startsWith(c.substring(0, 4)))) {
            logger.debug(`CNAE ${cnae} classificado como alto risco`);
            return 'alto';
        } else if (cnaesBaixoRisco.some(c => cnae.startsWith(c.substring(0, 4)))) {
            logger.debug(`CNAE ${cnae} classificado como baixo risco`);
            return 'baixo';
        } else {
            logger.debug(`CNAE ${cnae} classificado como risco médio (não encontrado nas listas)`);
            return 'medio';
        }
    }
}

module.exports = new AnaliseRiscoService();
