// Exemplo simples de aplicação para Analisador de Risco CNPJ

// Configuração básica de Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Simulação da API de análise de risco
app.post('/api/analise-risco', (req, res) => {
  const { cnpj } = req.body;
  
  if (!cnpj || !/^\d{14}$/.test(cnpj)) {
    return res.status(400).json({ error: 'CNPJ inválido' });
  }
  
  // Simulação de dados de empresa para demonstração
  const companyData = {
    razaoSocial: 'EMPRESA DEMONSTRATIVA LTDA',
    cnpjFormatado: formatCNPJ(cnpj),
    dataAbertura: '2018-01-15',
    situacaoCadastral: 'ATIVA',
    atividadePrincipal: {
      codigo: '6202-3/00',
      descricao: 'Desenvolvimento de software'
    }
  };
  
  // Calcular score de risco
  const result = calculateRiskScore(companyData);
  
  // Retornar resultado
  return res.status(200).json(result);
});

// Função para calcular score de risco
function calculateRiskScore(companyData) {
  let score = 0;
  const criteriosImpacto = [];
  
  // Critério: Situação cadastral
  if (companyData.situacaoCadastral === 'ATIVA') {
    score += 10;
    criteriosImpacto.push({
      descricao: 'Empresa ativa',
      impacto: 10
    });
  } else {
    score -= 20;
    criteriosImpacto.push({
      descricao: 'Empresa inativa/suspensa',
      impacto: -20
    });
  }
  
  // Critério: Tempo de operação
  const today = new Date();
  const openingDate = new Date(companyData.dataAbertura);
  const operatingYears = Math.floor((today - openingDate) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (operatingYears >= 3) {
    score += 10;
    criteriosImpacto.push({
      descricao: 'Mais de 3 anos de operação',
      impacto: 10
    });
  } else if (operatingYears < 0.5) {
    score -= 10;
    criteriosImpacto.push({
      descricao: 'Empresa aberta há menos de 6 meses',
      impacto: -10
    });
  }
  
  // Critério: CNAE de risco (simplificado para demo)
  const highRiskCnae = ['6491-3/00', '6613-4/00', '4399-1/99'];
  const cnaePrincipal = companyData.atividadePrincipal.codigo;
  
  if (highRiskCnae.includes(cnaePrincipal)) {
    score -= 10;
    criteriosImpacto.push({
      descricao: 'CNAE de risco associado',
      impacto: -10
    });
  } else {
    score += 10;
    criteriosImpacto.push({
      descricao: 'CNAE de baixo risco',
      impacto: 10
    });
  }
  
  // Determinar nível de risco
  let nivelRisco;
  if (score >= 20) {
    nivelRisco = 'BAIXO';
  } else if (score >= 0) {
    nivelRisco = 'MÉDIO';
  } else {
    nivelRisco = 'ALTO';
  }
  
  return {
    dadosEmpresa: {
      razaoSocial: companyData.razaoSocial,
      cnpjFormatado: companyData.cnpjFormatado,
      dataAbertura: companyData.dataAbertura,
      situacaoCadastral: companyData.situacaoCadastral,
      atividadePrincipal: `${companyData.atividadePrincipal.codigo} - ${companyData.atividadePrincipal.descricao}`
    },
    scoreRisco: score,
    nivelRisco,
    criteriosImpacto
  };
}

// Função para formatar CNPJ
function formatCNPJ(cnpj) {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

// Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app; // Para testes