/**
 * Utility functions for CNPJ formatting
 */

/**
 * Formats a CNPJ with the standard mask
 * @param {string} cnpj - CNPJ to format
 * @returns {string} - Formatted CNPJ
 */
export const formatCnpj = (cnpj) => {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Apply mask
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

/**
 * Removes formatting from CNPJ
 * @param {string} cnpj - Formatted CNPJ
 * @returns {string} - CNPJ with only numbers
 */
export const unformatCnpj = (cnpj) => {
  return cnpj.replace(/[^\d]/g, '');
};

/**
 * Formats a CNPJ as the user types
 * @param {string} value - Current input value
 * @returns {string} - Formatted value
 */
export const formatCnpjInput = (value) => {
  if (!value) return '';
  
  // Remove non-numeric characters
  const numbers = value.replace(/[^\d]/g, '');
  
  // Apply mask as the user types
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  }
};