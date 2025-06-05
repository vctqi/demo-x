/**
 * Formata um CNPJ com máscara
 * @param {string} cnpj - CNPJ (com ou sem formatação)
 * @returns {string} CNPJ formatado
 */
export const formatarCNPJ = (cnpj) => {
    // Remover caracteres não numéricos
    const apenasNumeros = cnpj.replace(/\D/g, '');
    
    // Verificar se tem 14 dígitos
    if (apenasNumeros.length !== 14) {
        return apenasNumeros; // Retornar como está se não tiver 14 dígitos
    }
    
    // Aplicar máscara XX.XXX.XXX/XXXX-XX
    return apenasNumeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

/**
 * Formata uma data para formato brasileiro
 * @param {string} data - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
export const formatarData = (data) => {
    if (!data) return 'Não disponível';
    
    try {
        const date = new Date(data);
        
        // Verificar se a data é válida
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }
        
        // Formatar a data
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
    }
};

/**
 * Formata uma data e hora para formato brasileiro
 * @param {string} dataHora - Data e hora no formato ISO
 * @returns {string} Data e hora formatadas (DD/MM/YYYY HH:MM)
 */
export const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Não disponível';
    
    try {
        const date = new Date(dataHora);
        
        // Verificar se a data é válida
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }
        
        // Formatar a data e hora
        return date.toLocaleString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data e hora:', error);
        return 'Data inválida';
    }
};

/**
 * Retorna a classe de cor baseada na classificação de risco
 * @param {string} classificacao - Classificação de risco (Baixo, Médio, Alto)
 * @returns {string} Classe de cor Bootstrap
 */
export const getClasseRisco = (classificacao) => {
    if (!classificacao) return 'secondary';
    
    switch (classificacao.toLowerCase()) {
        case 'baixo':
            return 'success';
        case 'médio':
        case 'medio':
            return 'warning';
        case 'alto':
            return 'danger';
        default:
            return 'secondary';
    }
};

/**
 * Formata um número com símbolo de positivo/negativo
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado com sinal
 */
export const formatarNumeroComSinal = (valor) => {
    if (valor > 0) {
        return `+${valor}`;
    }
    return valor.toString();
};