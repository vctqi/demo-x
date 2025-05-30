/**
 * Validates a Brazilian CNPJ number using the verification algorithm
 * @param {string} cnpj - CNPJ number (only digits, no special characters)
 * @returns {boolean} - Whether the CNPJ is valid
 */
exports.isCnpjValid = (cnpj) => {
  // Eliminate known invalid patterns
  if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Calculate first verification digit
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let verificationDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (parseInt(cnpj.charAt(12)) !== verificationDigit) {
    return false;
  }
  
  // Calculate second verification digit
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  verificationDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  return parseInt(cnpj.charAt(13)) === verificationDigit;
};

/**
 * Formats a CNPJ number to the standard format XX.XXX.XXX/XXXX-XX
 * @param {string} cnpj - CNPJ number (only digits, no special characters)
 * @returns {string} - Formatted CNPJ
 */
exports.formatCnpj = (cnpj) => {
  const cleanCnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCnpj.length !== 14) {
    return cnpj; // Return original if not 14 digits
  }
  
  return cleanCnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};