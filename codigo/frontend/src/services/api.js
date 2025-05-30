import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Get CNPJ data with risk analysis
 * @param {string} cnpj - CNPJ number (only digits)
 * @returns {Promise<Object>} CNPJ data with risk analysis
 */
export const getCnpjData = async (cnpj) => {
  try {
    const response = await api.get(`/cnpj/${cnpj}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CNPJ data:', error);
    throw error;
  }
};

/**
 * Get detailed risk criteria for a CNPJ
 * @param {string} cnpj - CNPJ number (only digits)
 * @returns {Promise<Object>} Detailed risk criteria
 */
export const getRiskDetails = async (cnpj) => {
  try {
    const response = await api.get(`/cnpj/${cnpj}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching risk details:', error);
    throw error;
  }
};

/**
 * Export CNPJ risk analysis as PDF
 * @param {string} cnpj - CNPJ number (only digits)
 */
export const exportPdf = (cnpj) => {
  // Create a download link and trigger it
  const link = document.createElement('a');
  link.href = `/api/cnpj/${cnpj}/export`;
  link.target = '_blank';
  link.download = `Analise_Risco_${cnpj}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};