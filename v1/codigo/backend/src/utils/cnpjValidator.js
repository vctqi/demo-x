/**
 * Utility for CNPJ validation
 */

/**
 * Validates a CNPJ number
 * @param {string} cnpj - CNPJ to validate
 * @returns {boolean} - Whether the CNPJ is valid
 */
function isValidCnpj(cnpj) {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Check if it has 14 digits
  if (cnpj.length !== 14) {
    return false;
  }

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validate check digits
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  // First check digit
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) {
    return false;
  }

  // Second check digit
  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1), 10)) {
    return false;
  }

  return true;
}

/**
 * Formats a CNPJ with the standard mask
 * @param {string} cnpj - CNPJ to format
 * @returns {string} - Formatted CNPJ
 */
function formatCnpj(cnpj) {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Apply mask
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Removes formatting from CNPJ
 * @param {string} cnpj - Formatted CNPJ
 * @returns {string} - CNPJ with only numbers
 */
function unformatCnpj(cnpj) {
  return cnpj.replace(/[^\d]/g, '');
}

module.exports = {
  isValidCnpj,
  formatCnpj,
  unformatCnpj,
};