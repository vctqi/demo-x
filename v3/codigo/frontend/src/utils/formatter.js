/**
 * Formata um CNPJ no padrão XX.XXX.XXX/XXXX-XX
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Aplica a formatação
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

/**
 * Remove a formatação de um CNPJ
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {string} CNPJ sem formatação
 */
export const unformatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  return cnpj.replace(/[^\d]/g, '');
};

/**
 * Formata uma data no padrão DD/MM/YYYY
 * @param {string} date - Data em formato ISO ou string
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return date;
  }
};

/**
 * Calcula o tempo de operação em anos e meses
 * @param {string} date - Data de abertura
 * @returns {string} Tempo de operação formatado
 */
export const calculateOperationTime = (date) => {
  if (!date) return '';
  
  try {
    const openingDate = new Date(date);
    const now = new Date();
    
    // Verifica se a data é válida
    if (isNaN(openingDate.getTime())) return '';
    
    // Calcula a diferença em anos
    let years = now.getFullYear() - openingDate.getFullYear();
    const months = now.getMonth() - openingDate.getMonth();
    
    // Ajusta os anos se o mês atual for anterior ao mês de abertura
    if (months < 0 || (months === 0 && now.getDate() < openingDate.getDate())) {
      years--;
    }
    
    // Calcula meses ajustados
    let adjustedMonths = months < 0 ? 12 + months : months;
    
    // Formata a saída
    if (years > 0 && adjustedMonths > 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${adjustedMonths} ${adjustedMonths === 1 ? 'mês' : 'meses'}`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${adjustedMonths} ${adjustedMonths === 1 ? 'mês' : 'meses'}`;
    }
  } catch (error) {
    console.error('Erro ao calcular tempo de operação:', error);
    return '';
  }
};