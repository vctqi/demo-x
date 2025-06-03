const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoints da API
app.get('/api/cnpj/:cnpj', async (req, res) => {
    try {
        const cnpj = req.params.cnpj.replace(/[^\d]/g, '');
        
        // Utilizando a API pública do CNPJ.ws
        const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`);
        
        // Extrair os dados relevantes da resposta
        const data = response.data;
        
        // Mapear dados para o formato da nossa aplicação
        const companyData = {
            cnpj: data.cnpj || '',
            companyName: data.razao_social || '',
            tradeName: data.nome_fantasia || '',
            openingDate: data.data_inicio_atividade || null,
            status: data.situacao_cadastral?.descricao || 'Desconhecida',
            cnae: data.cnae_fiscal?.codigo || '',
            cnaeDescription: data.cnae_fiscal?.descricao || '',
            size: data.porte?.descricao || '',
            city: data.estabelecimento?.cidade?.nome || '',
            state: data.estabelecimento?.estado?.sigla || '',
        };
        
        res.json(companyData);
    } catch (error) {
        console.error('Erro ao consultar CNPJ:', error.message);
        
        // Verificar tipos específicos de erros
        if (error.response) {
            const { status } = error.response;
            
            if (status === 404) {
                return res.status(404).json({ error: 'CNPJ não encontrado na base de dados.' });
            } else if (status === 429) {
                return res.status(429).json({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' });
            }
        }
        
        res.status(500).json({ error: 'Erro ao consultar CNPJ. Tente novamente mais tarde.' });
    }
});

app.get('/api/risk/:cnpj', async (req, res) => {
    try {
        const cnpj = req.params.cnpj.replace(/[^\d]/g, '');
        
        // Primeiro obtém dados da empresa
        const companyResponse = await axios.get(`http://localhost:${PORT}/api/cnpj/${cnpj}`);
        const companyData = companyResponse.data;
        
        // Calcula o score de risco
        const riskAnalysis = analyzeRisk(companyData);
        
        res.json({
            cnpj: companyData.cnpj,
            score: riskAnalysis.score,
            riskLevel: riskAnalysis.riskLevel,
            scoreFactors: riskAnalysis.factors,
            analysisDate: new Date(),
            companyInfo: companyData
        });
    } catch (error) {
        console.error('Erro ao analisar risco:', error.message);
        res.status(500).json({ error: 'Erro ao analisar risco. Tente novamente mais tarde.' });
    }
});

// Validação de CNPJ
app.post('/api/cnpj/validate', (req, res) => {
    try {
        const { cnpj } = req.body;
        
        if (!cnpj) {
            return res.status(400).json({ error: 'CNPJ não fornecido' });
        }
        
        const isValid = isValidCnpj(cnpj);
        
        res.json({
            valid: isValid,
            formatted: isValid ? formatCnpj(cnpj) : null
        });
    } catch (error) {
        console.error('Erro ao validar CNPJ:', error.message);
        res.status(500).json({ error: 'Erro ao validar CNPJ' });
    }
});

// Função auxiliar para validar CNPJ
function isValidCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        return false;
    }
    
    // Validação dos dígitos verificadores
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    // Primeiro dígito
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0), 10)) {
        return false;
    }
    
    // Segundo dígito
    size += 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1), 10)) {
        return false;
    }
    
    return true;
}

// Função auxiliar para formatar CNPJ
function formatCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

// Função para analisar o risco
function analyzeRisk(companyData) {
    let score = 0;
    const factors = [];
    
    // 1. Verificar situação cadastral
    if (companyData.status && companyData.status.toLowerCase() === 'ativa') {
        score += 10;
        factors.push({
            factor: 'Situação cadastral ativa',
            impact: 10,
            description: 'Empresa com situação cadastral regular'
        });
    } else {
        score -= 20;
        factors.push({
            factor: 'Situação cadastral irregular',
            impact: -20,
            description: `Situação cadastral: ${companyData.status}`
        });
    }
    
    // 2. Verificar idade da empresa
    if (companyData.openingDate) {
        const openingDate = new Date(companyData.openingDate);
        const now = new Date();
        const ageInYears = (now - openingDate) / (1000 * 60 * 60 * 24 * 365.25);
        
        if (ageInYears >= 3) {
            score += 10;
            factors.push({
                factor: 'Tempo de operação',
                impact: 10,
                description: 'Empresa com mais de 3 anos de operação'
            });
        } else if (ageInYears < 0.5) {
            score -= 10;
            factors.push({
                factor: 'Empresa recente',
                impact: -10,
                description: 'Empresa aberta há menos de 6 meses'
            });
        }
    }
    
    // 3. Verificar CNAE de risco
    if (companyData.cnae) {
        const highRiskCnaes = ['6499-9/99', '6434-4/00', '4120-4/00', '9200-3/01', '9200-3/02', '9200-3/99'];
        const lowRiskCnaes = ['8599-6/04', '6201-5/01', '8610-1/01', '4751-2/01', '4761-0/03'];
        
        // Remover caracteres especiais para comparação
        const cnaeFormatted = companyData.cnae.replace(/[^\d]/g, '');
        
        if (highRiskCnaes.some(code => code.replace(/[^\d]/g, '') === cnaeFormatted)) {
            score -= 10;
            factors.push({
                factor: 'CNAE de alto risco',
                impact: -10,
                description: `CNAE ${companyData.cnae} (${companyData.cnaeDescription}) é considerado de alto risco`
            });
        } else if (lowRiskCnaes.some(code => code.replace(/[^\d]/g, '') === cnaeFormatted)) {
            score += 10;
            factors.push({
                factor: 'CNAE de baixo risco',
                impact: 10,
                description: `CNAE ${companyData.cnae} (${companyData.cnaeDescription}) é considerado de baixo risco`
            });
        }
    }
    
    // Determinar nível de risco
    let riskLevel;
    if (score >= 20) {
        riskLevel = 'Baixo';
    } else if (score >= 0) {
        riskLevel = 'Médio';
    } else {
        riskLevel = 'Alto';
    }
    
    return {
        score,
        riskLevel,
        factors
    };
}

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});