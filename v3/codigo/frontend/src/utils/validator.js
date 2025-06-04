/**
 * Valida o formato e dígitos verificadores de um CNPJ
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean} True se o CNPJ for válido
 */
export const validateCNPJ = (cnpj) => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica o comprimento
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Validação dos dígitos verificadores
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  // Primeiro dígito verificador
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  // Segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

  return true;
};