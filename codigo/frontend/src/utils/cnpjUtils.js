/**
 * Utilitários para manipulação de CNPJ
 */
const cnpjUtils = {
  /**
   * Formata um CNPJ para o padrão XX.XXX.XXX/XXXX-XX
   * @param {string} cnpj - CNPJ sem formatação (apenas números)
   * @returns {string} - CNPJ formatado
   */
  formatarCnpj(cnpj) {
    // Remover caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    // Verificar se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return cnpj;
    }
    
    // Aplicar máscara
    return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  },
  
  /**
   * Valida um número de CNPJ
   * @param {string} cnpj - CNPJ a ser validado (com ou sem formatação)
   * @returns {boolean} - true se válido, false caso contrário
   */
  validarCnpj(cnpj) {
    // Remover caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    // Verificar se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }
    
    // Verificar se todos os dígitos são iguais (ex: 00000000000000)
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false;
    }
    
    // Validação dos dígitos verificadores
    let tamanho = cnpjLimpo.length - 2;
    let numeros = cnpjLimpo.substring(0, tamanho);
    const digitos = cnpjLimpo.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    // Cálculo do primeiro dígito verificador
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
      return false;
    }
    
    // Cálculo do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpjLimpo.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {string} - Data formatada
   */
  formatarData(date) {
    if (!date) return '';
    
    try {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return date;
    }
  }
};

export default cnpjUtils;