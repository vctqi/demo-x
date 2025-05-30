// Aplicação de demonstração simplificada do Analisador de Risco de CNPJ
const http = require('http');
const fs = require('fs');
const path = require('path');

// Função para validar CNPJ
function isCnpjValid(cnpj) {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let verificationDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (parseInt(cnpj.charAt(12)) !== verificationDigit) return false;
  
  // Calcula segundo dígito verificador
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  verificationDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  return parseInt(cnpj.charAt(13)) === verificationDigit;
}

// Função para formatar CNPJ
function formatCnpj(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

// Função para calcular score de risco
function calculateRiskScore(cnpjData) {
  let score = 0;
  const criteriosPositivos = [];
  const criteriosNegativos = [];
  const alertas = [];
  
  // Verifica situação cadastral
  if (cnpjData.situacao === 'Ativa') {
    score += 10;
    criteriosPositivos.push({
      criterio: 'Empresa ativa',
      pontuacao: 10,
      descricao: 'A empresa está com situação cadastral ativa'
    });
  } else {
    score -= 20;
    criteriosNegativos.push({
      criterio: 'Empresa inativa/suspensa',
      pontuacao: -20,
      descricao: `A empresa está com situação cadastral: ${cnpjData.situacao}`
    });
    alertas.push(`Situação cadastral irregular: ${cnpjData.situacao}`);
  }
  
  // Verifica tempo de operação
  const foundationDate = new Date(cnpjData.data_abertura);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - foundationDate);
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  if (diffMonths >= 36) { // 3 anos ou mais
    score += 10;
    criteriosPositivos.push({
      criterio: 'Mais de 3 anos de operação',
      pontuacao: 10,
      descricao: `A empresa está operando há ${Math.floor(diffMonths / 12)} anos e ${diffMonths % 12} meses`
    });
  } else if (diffMonths <= 6) { // 6 meses ou menos
    score -= 10;
    criteriosNegativos.push({
      criterio: 'Empresa aberta há menos de 6 meses',
      pontuacao: -10,
      descricao: `A empresa está operando há apenas ${diffMonths} meses`
    });
    alertas.push('Empresa recém-aberta');
  }
  
  // Classificação de risco
  let classificacao;
  if (score >= 20) {
    classificacao = 'Baixo';
  } else if (score >= 0) {
    classificacao = 'Médio';
  } else {
    classificacao = 'Alto';
  }
  
  return {
    score,
    classificacao,
    criterios_positivos: criteriosPositivos,
    criterios_negativos: criteriosNegativos,
    alertas
  };
}

// Banco de dados simulado de CNPJs
const cnpjDatabase = {
  '00000000000191': {
    cnpj: '00000000000191',
    razao_social: 'Banco do Brasil S.A.',
    nome_fantasia: 'Banco do Brasil',
    data_abertura: '1966-04-12',
    cnae_principal: '6422100 - Bancos múltiplos, com carteira comercial',
    situacao: 'Ativa',
    porte: 'Grande Porte',
    localizacao: 'Brasília/DF'
  },
  '33000167000101': {
    cnpj: '33000167000101',
    razao_social: 'Banco Nacional de Desenvolvimento Econômico e Social',
    nome_fantasia: 'BNDES',
    data_abertura: '1952-06-20',
    cnae_principal: '6422100 - Bancos de investimento',
    situacao: 'Ativa',
    porte: 'Grande Porte',
    localizacao: 'Rio de Janeiro/RJ'
  },
  '60746948000112': {
    cnpj: '60746948000112',
    razao_social: 'Empresa Fictícia de Factoring Ltda',
    nome_fantasia: 'Factoring Exemplo',
    data_abertura: '2024-03-01',
    cnae_principal: '6491900 - Sociedades de fomento mercantil - factoring',
    situacao: 'Suspensa',
    porte: 'Médio Porte',
    localizacao: 'São Paulo/SP'
  }
};

// HTML para a página inicial
const indexHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analisador de Risco de CNPJ - Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1976d2;
      margin-top: 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input[type="text"] {
      width: 300px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #1565c0;
    }
    .result {
      margin-top: 20px;
      display: none;
    }
    .company-info, .risk-analysis {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .info-item {
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      display: inline-block;
      width: 150px;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      color: white;
    }
    .badge-success {
      background-color: #2e7d32;
    }
    .badge-warning {
      background-color: #ed6c02;
    }
    .badge-error {
      background-color: #d32f2f;
    }
    .alert {
      background-color: #ffebee;
      border-left: 4px solid #d32f2f;
      padding: 10px;
      margin-top: 10px;
    }
    .criteria-list {
      list-style-type: none;
      padding: 0;
    }
    .criteria-item {
      padding: 5px 0;
    }
    .positive {
      color: #2e7d32;
    }
    .negative {
      color: #d32f2f;
    }
    #error-message {
      color: #d32f2f;
      margin-top: 10px;
      font-weight: bold;
    }
    .demo-note {
      background-color: #e8f4fd;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #1976d2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Analisador de Risco de Cliente PJ via CNPJ</h1>
    
    <div class="demo-note">
      <strong>Nota:</strong> Esta é uma demonstração simplificada. Para fins de teste, use um dos seguintes CNPJs:
      <ul>
        <li>00.000.000/0001-91 (Banco do Brasil - Baixo Risco)</li>
        <li>33.000.167/0001-01 (BNDES - Baixo Risco)</li>
        <li>60.746.948/0001-12 (Empresa Fictícia - Alto Risco)</li>
      </ul>
    </div>
    
    <div class="form-group">
      <label for="cnpj">CNPJ da Empresa:</label>
      <input type="text" id="cnpj" placeholder="00.000.000/0000-00">
      <button id="analyze-btn">Analisar Risco</button>
      <div id="error-message"></div>
    </div>
    
    <div id="result" class="result">
      <h2>Resultado da Análise</h2>
      
      <div class="company-info">
        <h3>Dados Cadastrais</h3>
        <div class="info-item"><span class="info-label">CNPJ:</span> <span id="result-cnpj"></span></div>
        <div class="info-item"><span class="info-label">Razão Social:</span> <span id="result-razao-social"></span></div>
        <div class="info-item"><span class="info-label">Nome Fantasia:</span> <span id="result-nome-fantasia"></span></div>
        <div class="info-item"><span class="info-label">Data de Abertura:</span> <span id="result-data-abertura"></span></div>
        <div class="info-item"><span class="info-label">Tempo de Operação:</span> <span id="result-tempo-operacao"></span></div>
        <div class="info-item"><span class="info-label">CNAE Principal:</span> <span id="result-cnae"></span></div>
        <div class="info-item"><span class="info-label">Situação Cadastral:</span> <span id="result-situacao"></span></div>
        <div class="info-item"><span class="info-label">Porte:</span> <span id="result-porte"></span></div>
        <div class="info-item"><span class="info-label">Localização:</span> <span id="result-localizacao"></span></div>
      </div>
      
      <div class="risk-analysis">
        <h3>Análise de Risco</h3>
        <div class="info-item"><span class="info-label">Score:</span> <span id="result-score"></span> pontos</div>
        <div class="info-item">
          <span class="info-label">Classificação:</span> 
          <span id="result-risk-badge" class="badge"></span>
        </div>
        
        <div id="alerts-container" style="display: none;">
          <h4>Sinais de Alerta</h4>
          <div id="alerts-list" class="alert"></div>
        </div>
        
        <h4>Critérios Positivos</h4>
        <ul id="positive-criteria" class="criteria-list"></ul>
        
        <h4>Critérios Negativos</h4>
        <ul id="negative-criteria" class="criteria-list"></ul>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const cnpjInput = document.getElementById('cnpj');
      const analyzeBtn = document.getElementById('analyze-btn');
      const resultDiv = document.getElementById('result');
      const errorMessage = document.getElementById('error-message');
      
      // Máscara para o CNPJ
      cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\\D/g, '');
        if (value.length <= 14) {
          value = value.replace(/^(\\d{2})(\\d)/g, '$1.$2');
          value = value.replace(/^(\\d{2})\\.(\\d{3})(\\d)/g, '$1.$2.$3');
          value = value.replace(/\\.(\\d{3})(\\d)/g, '.$1/$2');
          value = value.replace(/(\\d{4})(\\d)/g, '$1-$2');
        }
        e.target.value = value;
      });
      
      // Analisar CNPJ
      analyzeBtn.addEventListener('click', function() {
        const cnpj = cnpjInput.value.replace(/\\D/g, '');
        errorMessage.textContent = '';
        
        if (!cnpj) {
          errorMessage.textContent = 'Por favor, insira um CNPJ.';
          return;
        }
        
        if (cnpj.length !== 14) {
          errorMessage.textContent = 'CNPJ deve conter 14 dígitos.';
          return;
        }
        
        // Requisição AJAX para análise do CNPJ
        fetch('/api/cnpj/' + cnpj)
          .then(response => {
            if (!response.ok) {
              throw new Error('CNPJ não encontrado ou inválido');
            }
            return response.json();
          })
          .then(data => {
            displayResult(data);
          })
          .catch(error => {
            errorMessage.textContent = error.message;
          });
      });
      
      // Exibir resultado
      function displayResult(data) {
        // Exibir dados da empresa
        document.getElementById('result-cnpj').textContent = formatCnpj(data.cnpj);
        document.getElementById('result-razao-social').textContent = data.razao_social;
        document.getElementById('result-nome-fantasia').textContent = data.nome_fantasia || 'Não informado';
        document.getElementById('result-data-abertura').textContent = formatDate(data.data_abertura);
        document.getElementById('result-tempo-operacao').textContent = calculateOperationTime(data.data_abertura);
        document.getElementById('result-cnae').textContent = data.cnae_principal;
        document.getElementById('result-situacao').textContent = data.situacao;
        document.getElementById('result-porte').textContent = data.porte;
        document.getElementById('result-localizacao').textContent = data.localizacao;
        
        // Exibir análise de risco
        document.getElementById('result-score').textContent = data.risco.score;
        
        const riskBadge = document.getElementById('result-risk-badge');
        riskBadge.textContent = 'Risco ' + data.risco.classificacao;
        
        if (data.risco.classificacao === 'Baixo') {
          riskBadge.className = 'badge badge-success';
        } else if (data.risco.classificacao === 'Médio') {
          riskBadge.className = 'badge badge-warning';
        } else {
          riskBadge.className = 'badge badge-error';
        }
        
        // Exibir alertas
        const alertsContainer = document.getElementById('alerts-container');
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = '';
        
        if (data.risco.alertas && data.risco.alertas.length > 0) {
          alertsContainer.style.display = 'block';
          data.risco.alertas.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.textContent = alert;
            alertsList.appendChild(alertItem);
          });
        } else {
          alertsContainer.style.display = 'none';
        }
        
        // Exibir critérios positivos
        const positiveCriteria = document.getElementById('positive-criteria');
        positiveCriteria.innerHTML = '';
        
        if (data.risco.criterios_positivos && data.risco.criterios_positivos.length > 0) {
          data.risco.criterios_positivos.forEach(criterio => {
            const item = document.createElement('li');
            item.className = 'criteria-item positive';
            item.innerHTML = '<strong>' + criterio.criterio + ' (+' + criterio.pontuacao + 
                             ')</strong>: ' + criterio.descricao;
            positiveCriteria.appendChild(item);
          });
        } else {
          const item = document.createElement('li');
          item.textContent = 'Nenhum critério positivo identificado';
          positiveCriteria.appendChild(item);
        }
        
        // Exibir critérios negativos
        const negativeCriteria = document.getElementById('negative-criteria');
        negativeCriteria.innerHTML = '';
        
        if (data.risco.criterios_negativos && data.risco.criterios_negativos.length > 0) {
          data.risco.criterios_negativos.forEach(criterio => {
            const item = document.createElement('li');
            item.className = 'criteria-item negative';
            item.innerHTML = '<strong>' + criterio.criterio + ' (' + criterio.pontuacao + 
                             ')</strong>: ' + criterio.descricao;
            negativeCriteria.appendChild(item);
          });
        } else {
          const item = document.createElement('li');
          item.textContent = 'Nenhum critério negativo identificado';
          negativeCriteria.appendChild(item);
        }
        
        // Exibir resultado
        resultDiv.style.display = 'block';
      }
      
      // Funções auxiliares
      function formatCnpj(cnpj) {
        return cnpj.replace(/^(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})$/, '$1.$2.$3/$4-$5');
      }
      
      function formatDate(dateString) {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
      }
      
      function calculateOperationTime(dateString) {
        if (!dateString) return 'Não disponível';
        
        const foundationDate = new Date(dateString);
        const currentDate = new Date();
        
        const diffTime = Math.abs(currentDate - foundationDate);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / 
                                      (1000 * 60 * 60 * 24 * 30.44));
        
        return diffYears + ' anos e ' + diffMonths + ' meses';
      }
    });
  </script>
</body>
</html>
`;

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  // Log das requisições
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Rota principal - página HTML
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
    return;
  }
  
  // API para consulta de CNPJ
  if (req.url.startsWith('/api/cnpj/')) {
    const cnpj = req.url.split('/')[3];
    
    // Remover caracteres não numéricos
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // Validar formato do CNPJ
    if (cleanCnpj.length !== 14) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: {
          message: 'CNPJ deve conter 14 dígitos',
          code: 'INVALID_CNPJ_FORMAT'
        }
      }));
      return;
    }
    
    // Validar CNPJ com algoritmo
    if (!isCnpjValid(cleanCnpj)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: {
          message: 'CNPJ inválido',
          code: 'INVALID_CNPJ'
        }
      }));
      return;
    }
    
    // Verificar se o CNPJ existe no banco de dados simulado
    if (!cnpjDatabase[cleanCnpj]) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: {
          message: 'CNPJ não encontrado na base de dados',
          code: 'CNPJ_NOT_FOUND'
        }
      }));
      return;
    }
    
    // Obter dados do CNPJ
    const cnpjData = cnpjDatabase[cleanCnpj];
    
    // Calcular score de risco
    const riskResult = calculateRiskScore(cnpjData);
    
    // Retornar dados com análise de risco
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ...cnpjData,
      risco: riskResult
    }));
    return;
  }
  
  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Página não encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});