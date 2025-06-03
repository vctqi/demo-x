/**
 * Validates a CNPJ number
 * @param {string} cnpj - The CNPJ to validate
 * @returns {boolean} Whether the CNPJ is valid
 */
function validateCnpj(cnpj) {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]+/g, '');

  // Check if it has 14 digits
  if (cnpj.length !== 14) {
    return false;
  }

  // Check if all digits are the same (invalid CNPJ)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validate verification digits
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  // First verification digit
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) {
    return false;
  }

  // Second verification digit
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) {
    return false;
  }

  return true;
}

/**
 * Format a CNPJ with the standard mask
 * @param {string} cnpj - The CNPJ to format
 * @returns {string} The formatted CNPJ
 */
function formatCnpj(cnpj) {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]+/g, '');
  
  // Apply the mask XX.XXX.XXX/XXXX-XX
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Sanitize a CNPJ string by removing all non-numeric characters
 * @param {string} cnpj - The CNPJ to sanitize
 * @returns {string} The sanitized CNPJ
 */
function sanitizeCnpj(cnpj) {
  return cnpj.replace(/[^\d]+/g, '');
}

module.exports = {
  validateCnpj,
  formatCnpj,
  sanitizeCnpj
};