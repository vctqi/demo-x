/**
 * Utilitário para validação de CNPJ
 */
class CnpjValidator {
  /**
   * Valida um número de CNPJ
   * @param {string} cnpj - CNPJ a ser validado (com ou sem formatação)
   * @returns {boolean} - true se válido, false caso contrário
   */
  validate(cnpj) {
    // Remover caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verificar se tem 14 dígitos
    if (cnpj.length !== 14) {
      return false;
    }
    
    // Verificar se todos os dígitos são iguais (ex: 00000000000000)
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }
    
    // Validação dos dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
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
    numeros = cnpj.substring(0, tamanho);
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
  }
  
  /**
   * Formata um CNPJ para o padrão XX.XXX.XXX/XXXX-XX
   * @param {string} cnpj - CNPJ sem formatação (apenas números)
   * @returns {string} - CNPJ formatado
   */
  format(cnpj) {
    // Remover caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Aplicar máscara
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
}

module.exports = new CnpjValidator();