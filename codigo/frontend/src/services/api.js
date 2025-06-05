import axios from 'axios';

// Configurar a URL base da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor de requisição para logging
api.interceptors.request.use(
    (config) => {
        console.log(`Requisição para: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Extrair mensagem de erro da resposta da API, se disponível
        let errorMessage = 'Ocorreu um erro na comunicação com o servidor';
        
        if (error.response) {
            // O servidor retornou uma resposta com código de erro
            errorMessage = error.response.data.error || `Erro ${error.response.status}: ${error.response.statusText}`;
            console.error('Erro na resposta:', error.response.data);
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            errorMessage = 'Servidor não respondeu. Verifique sua conexão com a internet.';
            console.error('Sem resposta:', error.request);
        } else {
            // Erro na configuração da requisição
            errorMessage = error.message;
            console.error('Erro na configuração:', error.message);
        }
        
        // Adicionar mensagem amigável ao erro
        error.friendlyMessage = errorMessage;
        
        return Promise.reject(error);
    }
);

// Serviço de consulta de CNPJ
const consultarCNPJ = async (cnpj) => {
    // Remover caracteres não numéricos
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    
    try {
        const response = await api.get(`/consulta/${cnpjNumeros}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Verificar saúde da API
const verificarSaude = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    consultarCNPJ,
    verificarSaude
};
