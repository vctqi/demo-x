const fetch = require('node-fetch');
const { sanitizeCnpj, formatCnpj } = require('../utils/cnpjValidator');

/**
 * Fetch company data from the public CNPJ API
 * @param {string} cnpj - The CNPJ to fetch
 * @returns {Promise<Object>} The company data
 */
async function fetchCnpjData(cnpj) {
  // Sanitize the CNPJ
  const sanitizedCnpj = sanitizeCnpj(cnpj);

  // Define the API URL
  const apiUrl = `https://publica.cnpj.ws/cnpj/${sanitizedCnpj}`;

  // Configure the request with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

  try {
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    // Clear the timeout
    clearTimeout(timeout);

    // Handle unsuccessful responses
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado');
      } else if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
      } else {
        throw new Error(`Erro na consulta: ${response.status} ${response.statusText}`);
      }
    }

    // Parse the response
    const data = await response.json();
    
    // Process and return the data
    return processApiResponse(data, sanitizedCnpj);
  } catch (error) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeout);
    
    // Handle specific errors
    if (error.name === 'AbortError') {
      throw new Error('Timeout na consulta. Tente novamente mais tarde.');
    }
    
    // Re-throw the original error
    throw error;
  }
}

/**
 * Process the API response and extract relevant data
 * @param {Object} apiResponse - The raw API response
 * @param {string} cnpj - The original CNPJ
 * @returns {Object} The processed company data
 */
function processApiResponse(apiResponse, cnpj) {
  // Extract basic information
  const companyData = {
    cnpj: formatCnpj(cnpj),
    razao_social: apiResponse.razao_social || 'Não informado',
    nome_fantasia: apiResponse.estabelecimento?.nome_fantasia || 'Não informado',
    situacao_cadastral: apiResponse.estabelecimento?.situacao_cadastral || 'Não informado',
    data_abertura: apiResponse.estabelecimento?.data_inicio_atividade || 'Não informado',
    cnae_principal: {
      codigo: apiResponse.estabelecimento?.atividade_principal?.subclasse || 'Não informado',
      descricao: apiResponse.estabelecimento?.atividade_principal?.descricao || 'Não informado'
    },
    porte: getCompanySize(apiResponse.porte?.descricao) || 'Não informado',
    endereco: {
      logradouro: apiResponse.estabelecimento?.logradouro || 'Não informado',
      numero: apiResponse.estabelecimento?.numero || 'S/N',
      complemento: apiResponse.estabelecimento?.complemento || '',
      bairro: apiResponse.estabelecimento?.bairro || 'Não informado',
      municipio: apiResponse.estabelecimento?.cidade?.nome || 'Não informado',
      uf: apiResponse.estabelecimento?.estado?.sigla || 'Não informado',
      cep: formatCep(apiResponse.estabelecimento?.cep) || 'Não informado'
    }
  };

  return companyData;
}

/**
 * Map the company size description to a standardized format
 * @param {string} porteDescricao - The company size description from the API
 * @returns {string} The standardized company size
 */
function getCompanySize(porteDescricao) {
  if (!porteDescricao) return 'NÃO INFORMADO';
  
  const porteMappings = {
    'MICRO EMPRESA': 'MICRO EMPRESA',
    'EMPRESA DE PEQUENO PORTE': 'EMPRESA DE PEQUENO PORTE',
    'DEMAIS': 'MÉDIO/GRANDE PORTE'
  };
  
  // Convert to uppercase for case-insensitive comparison
  const upperDescricao = porteDescricao.toUpperCase();
  
  // Try to find an exact match
  for (const [key, value] of Object.entries(porteMappings)) {
    if (upperDescricao === key) {
      return value;
    }
  }
  
  // If no exact match, try to find a partial match
  for (const [key, value] of Object.entries(porteMappings)) {
    if (upperDescricao.includes(key)) {
      return value;
    }
  }
  
  // Default case
  return porteDescricao.toUpperCase();
}

/**
 * Format a CEP with the standard mask
 * @param {string} cep - The CEP to format
 * @returns {string} The formatted CEP
 */
function formatCep(cep) {
  if (!cep) return null;
  
  // Remove non-numeric characters
  cep = cep.replace(/[^\d]+/g, '');
  
  // Apply the mask XXXXX-XXX
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

module.exports = {
  fetchCnpjData
};