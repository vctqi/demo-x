# Analisador de Risco de Cliente PJ via CNPJ - Desenvolvimento

## Descrição da Solução
Uma ferramenta onde o usuário insere o CNPJ de um cliente e recebe uma avaliação de risco com base nos dados públicos da empresa.

## Requisitos Específicos da Tarefa
Revise todas as tarefas criadas pelo Team Leader e seus Critérios de Aceitação detalhados no backlog. Consulte também o documento de requisitos criado pelo PO.

## Detalhes da Arquitetura
Consulte o documento de arquitetura para orientações técnicas.

## Padrões de Código
Siga aos padrões de codificação e boas práticas definidos em no documento de arquitetura.

## Implementação da Interface de Consulta CNPJ

### Objetivo
Desenvolver a interface de entrada de CNPJ e exibição de resultados de análise de risco conforme especificado nos requisitos.

### Implementação Frontend

Crie um componente React para o formulário de entrada:

```jsx
// components/CNPJForm.jsx
import React, { useState } from 'react';
import { maskCNPJ, validateCNPJ } from '../utils/validators';

const CNPJForm = ({ onSubmit, isLoading }) => {
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = maskCNPJ(e.target.value);
    setCnpj(value);
    
    if (value.length === 18) {
      if (!validateCNPJ(value)) {
        setError('CNPJ inválido. Verifique os números digitados.');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateCNPJ(cnpj)) {
      setError('CNPJ inválido. Verifique os números digitados.');
      return;
    }
    
    const cnpjClean = cnpj.replace(/[^\d]/g, '');
    onSubmit(cnpjClean);
  };

  return (
    <div className="cnpj-form-container">
      <h2>Análise de Risco por CNPJ</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cnpj">CNPJ da Empresa</label>
          <input
            id="cnpj"
            type="text"
            value={cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            maxLength="18"
            disabled={isLoading}
            className={error ? 'input-error' : ''}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !cnpj || error}
          className="analyze-button"
        >
          {isLoading ? 'Analisando...' : 'Analisar Risco'}
        </button>
      </form>
    </div>
  );
};

export default CNPJForm;
```

Crie o componente de exibição de resultados:

```jsx
// components/RiskResult.jsx
import React from 'react';

const RiskResult = ({ result }) => {
  if (!result) return null;
  
  const { 
    dadosEmpresa, 
    scoreRisco, 
    nivelRisco, 
    criteriosImpacto 
  } = result;
  
  const getBadgeColor = () => {
    switch (nivelRisco) {
      case 'BAIXO': return 'badge-success';
      case 'MÉDIO': return 'badge-warning';
      case 'ALTO': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };
  
  return (
    <div className="risk-result-container">
      <h2>Resultado da Análise</h2>
      
      <div className="company-info">
        <h3>Dados da Empresa</h3>
        <div className="info-group">
          <label>Razão Social:</label>
          <span>{dadosEmpresa.razaoSocial}</span>
        </div>
        <div className="info-group">
          <label>CNPJ:</label>
          <span>{dadosEmpresa.cnpjFormatado}</span>
        </div>
        <div className="info-group">
          <label>Data de Abertura:</label>
          <span>{dadosEmpresa.dataAbertura}</span>
        </div>
        <div className="info-group">
          <label>Situação Cadastral:</label>
          <span>{dadosEmpresa.situacaoCadastral}</span>
        </div>
        <div className="info-group">
          <label>Atividade Principal:</label>
          <span>{dadosEmpresa.atividadePrincipal}</span>
        </div>
      </div>
      
      <div className="risk-assessment">
        <h3>Avaliação de Risco</h3>
        <div className="risk-score">
          <span>Score de Risco: {scoreRisco}</span>
          <div className={`risk-badge ${getBadgeColor()}`}>
            {nivelRisco}
          </div>
        </div>
        
        <div className="impact-criteria">
          <h4>Critérios de Impacto:</h4>
          <ul>
            {criteriosImpacto.map((criterio, index) => (
              <li key={index} className={criterio.impacto > 0 ? 'positive' : 'negative'}>
                {criterio.descricao}: {criterio.impacto > 0 ? '+' : ''}{criterio.impacto}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskResult;
```

### Implementação Backend

Crie o endpoint para análise de risco:

```javascript
// controllers/riskAnalysisController.js
const { fetchCompanyData } = require('../services/cnpjService');
const { calculateRiskScore } = require('../services/riskService');
const { saveAnalysisResult } = require('../repositories/analysisRepository');

const analyzeRisk = async (req, res) => {
  try {
    const { cnpj } = req.body;
    
    if (!cnpj || !/^\d{14}$/.test(cnpj)) {
      return res.status(400).json({ error: 'CNPJ inválido' });
    }
    
    // Buscar dados da empresa
    const companyData = await fetchCompanyData(cnpj);
    
    if (!companyData) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    // Calcular score de risco
    const riskAnalysis = calculateRiskScore(companyData);
    
    // Salvar resultado no banco
    await saveAnalysisResult({
      cnpj,
      dataConsulta: new Date(),
      resultados: riskAnalysis
    });
    
    return res.status(200).json(riskAnalysis);
  } catch (error) {
    console.error('Erro na análise de risco:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar a análise de risco',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  analyzeRisk
};
```

Crie o serviço de cálculo de risco:

```javascript
// services/riskService.js
const calculateRiskScore = (companyData) => {
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
  
  // Critério: CNAE de risco
  const highRiskCnae = ['6491-3/00', '6613-4/00', '4399-1/99']; // Exemplos: factoring, corretoras, construção
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
};

module.exports = {
  calculateRiskScore
};
```

### Testes Unitários

Crie testes para o serviço de cálculo de risco:

```javascript
// tests/services/riskService.test.js
const { calculateRiskScore } = require('../../services/riskService');

describe('Risk Service', () => {
  test('should calculate low risk for active company with more than 3 years and low risk CNAE', () => {
    const mockCompany = {
      razaoSocial: 'Empresa Teste LTDA',
      cnpjFormatado: '00.000.000/0001-00',
      dataAbertura: '2018-01-01',
      situacaoCadastral: 'ATIVA',
      atividadePrincipal: {
        codigo: '6202-3/00',
        descricao: 'Desenvolvimento de software'
      }
    };
    
    const result = calculateRiskScore(mockCompany);
    
    expect(result.nivelRisco).toBe('BAIXO');
    expect(result.scoreRisco).toBeGreaterThanOrEqual(20);
  });
  
  test('should calculate high risk for inactive company with high risk CNAE', () => {
    const mockCompany = {
      razaoSocial: 'Empresa Teste LTDA',
      cnpjFormatado: '00.000.000/0001-00',
      dataAbertura: '2022-01-01',
      situacaoCadastral: 'SUSPENSA',
      atividadePrincipal: {
        codigo: '6491-3/00',
        descricao: 'Factoring'
      }
    };
    
    const result = calculateRiskScore(mockCompany);
    
    expect(result.nivelRisco).toBe('ALTO');
    expect(result.scoreRisco).toBeLessThan(0);
  });
});
```

## Entregáveis
- Código do sistema na pasta "codigo"
- Documentação sobre como executar o sistema em "documentacao/execucao.md"