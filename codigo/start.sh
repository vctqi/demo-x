#!/bin/bash

# Script de inicialização para o Analisador de Risco de Cliente PJ via CNPJ
# Este script verifica os requisitos, instala dependências e inicia a aplicação

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
LOGS_DIR="$SCRIPT_DIR/logs"

# Flags
INSTALL_ONLY=false
DEV_MODE=true
OPEN_BROWSER=true

# Processar argumentos
for arg in "$@"
do
    case $arg in
        --install-only)
        INSTALL_ONLY=true
        shift
        ;;
        --no-browser)
        OPEN_BROWSER=false
        shift
        ;;
        --prod)
        DEV_MODE=false
        shift
        ;;
    esac
done

# Função para exibir mensagens
log() {
    local level=$1
    local message=$2
    local color=$NC
    
    case $level in
        "INFO")
            color=$BLUE
            ;;
        "SUCCESS")
            color=$GREEN
            ;;
        "WARNING")
            color=$YELLOW
            ;;
        "ERROR")
            color=$RED
            ;;
    esac
    
    echo -e "${color}[$level] $message${NC}"
}

# Função para verificar se um comando está disponível
check_command() {
    local cmd=$1
    local install_instructions=$2
    
    if ! command -v $cmd &> /dev/null; then
        log "ERROR" "O comando '$cmd' não foi encontrado."
        log "INFO" "Instruções de instalação: $install_instructions"
        return 1
    else
        log "INFO" "✓ $cmd encontrado: $(command -v $cmd)"
        return 0
    fi
}

# Função para criar diretórios se não existirem
create_directories() {
    log "INFO" "Verificando e criando diretórios necessários..."
    
    # Criar diretório de backend se não existir
    if [ ! -d "$BACKEND_DIR" ]; then
        log "INFO" "Criando diretório backend..."
        mkdir -p "$BACKEND_DIR"
        mkdir -p "$BACKEND_DIR/src"
        mkdir -p "$BACKEND_DIR/src/controllers"
        mkdir -p "$BACKEND_DIR/src/services"
        mkdir -p "$BACKEND_DIR/src/models"
        mkdir -p "$BACKEND_DIR/src/middlewares"
        mkdir -p "$BACKEND_DIR/src/utils"
        mkdir -p "$BACKEND_DIR/src/config"
        mkdir -p "$BACKEND_DIR/logs"
        mkdir -p "$BACKEND_DIR/database"
    fi
    
    # Criar diretório de frontend se não existir
    if [ ! -d "$FRONTEND_DIR" ]; then
        log "INFO" "Criando diretório frontend..."
        mkdir -p "$FRONTEND_DIR"
        mkdir -p "$FRONTEND_DIR/public"
        mkdir -p "$FRONTEND_DIR/src"
        mkdir -p "$FRONTEND_DIR/src/components"
        mkdir -p "$FRONTEND_DIR/src/services"
        mkdir -p "$FRONTEND_DIR/src/utils"
    fi
    
    # Criar diretório de logs se não existir
    if [ ! -d "$LOGS_DIR" ]; then
        log "INFO" "Criando diretório de logs..."
        mkdir -p "$LOGS_DIR"
    fi
    
    log "SUCCESS" "Diretórios verificados e criados."
}

# Verificar requisitos do sistema
check_requirements() {
    log "INFO" "Verificando requisitos do sistema..."
    
    # Verificar Node.js
    check_command "node" "Visite https://nodejs.org para instruções de instalação"
    NODE_INSTALLED=$?
    
    if [ $NODE_INSTALLED -eq 0 ]; then
        # Tentar usar Node.js 16 via NVM se disponível
        export NVM_DIR="$HOME/.nvm"
        if [ -s "$NVM_DIR/nvm.sh" ]; then
            . "$NVM_DIR/nvm.sh"
            nvm use 16 > /dev/null 2>&1
            log "INFO" "Tentando usar Node.js 16 via NVM"
        fi
        
        NODE_VERSION=$(node --version | cut -d 'v' -f 2)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)
        
        if [ $NODE_MAJOR -lt 16 ]; then
            log "WARNING" "Esta aplicação requer Node.js v16.0.0 ou superior. Versão encontrada: $NODE_VERSION"
            log "INFO" "Tentaremos usar NVM para alternar para Node.js 16 durante a execução"
        else
            log "SUCCESS" "Node.js v$NODE_VERSION é compatível"
        fi
    else
        return 1
    fi
    
    # Verificar npm
    check_command "npm" "Normalmente instalado com Node.js. Visite https://nodejs.org"
    NPM_INSTALLED=$?
    
    if [ $NPM_INSTALLED -eq 0 ]; then
        NPM_VERSION=$(npm --version)
        NPM_MAJOR=$(echo $NPM_VERSION | cut -d '.' -f 1)
        
        if [ $NPM_MAJOR -lt 7 ]; then
            log "WARNING" "Esta aplicação requer npm v7.0.0 ou superior. Versão encontrada: $NPM_VERSION"
            log "INFO" "Execute 'npm install -g npm@latest' para atualizar"
            return 1
        else
            log "SUCCESS" "npm v$NPM_VERSION é compatível"
        fi
    else
        return 1
    fi
    
    # Verificar curl (usado para testar conectividade)
    check_command "curl" "Execute 'sudo apt-get install curl' para instalar"
    CURL_INSTALLED=$?
    
    # Verificar conectividade com API externa
    if [ $CURL_INSTALLED -eq 0 ]; then
        log "INFO" "Verificando conectividade com a API de CNPJ (https://publica.cnpj.ws/cnpj/)..."
        # Usamos um CNPJ sabidamente inexistente para testar o endpoint
        HTTP_STATUS=$(curl --output /dev/null --silent -w "%{http_code}" "https://publica.cnpj.ws/cnpj/00000000000000" -m 10) # Timeout de 10s
        
        # Códigos de status que indicam que a API está minimamente responsiva
        # 200: OK (improvável para CNPJ inexistente, mas incluído por segurança)
        # 404: Not Found (esperado para CNPJ inexistente, indica que o serviço está no ar)
        # 400: Bad Request (pode ocorrer se o formato do CNPJ de teste for considerado inválido pela API)
        # 429: Too Many Requests (indica que a API está no ar, mas limitando)
        if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 404 ] || [ "$HTTP_STATUS" -eq 400 ] || [ "$HTTP_STATUS" -eq 429 ]; then
            log "SUCCESS" "API de CNPJ está acessível (recebido status $HTTP_STATUS para CNPJ de teste)"
        else
            log "WARNING" "Não foi possível acessar a API de CNPJ de forma esperada (recebido status $HTTP_STATUS para CNPJ de teste)."
            log "WARNING" "Verifique sua conexão com a internet ou o status da API em https://publica.cnpj.ws/"
            log "INFO" "A aplicação ainda pode ser iniciada, mas a funcionalidade de consulta pode não funcionar."
        fi
    fi
    
    return 0
}

# Instalar dependências do backend
install_backend_dependencies() {
    log "INFO" "Instalando dependências do backend..."
    
    # Verificar se package.json existe, caso contrário criar um básico
    if [ ! -f "$BACKEND_DIR/package.json" ]; then
        log "INFO" "Criando package.json para o backend..."
        cat > "$BACKEND_DIR/package.json" << EOF
{
  "name": "analisador-risco-cnpj-backend",
  "version": "1.0.0",
  "description": "Backend para o Analisador de Risco de Cliente PJ via CNPJ",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "helmet": "^5.1.0",
    "joi": "^17.6.0",
    "moment": "^2.29.3",
    "sequelize": "^6.21.0",
    "sqlite3": "^5.0.8",
    "winston": "^3.7.2"
  },
  "devDependencies": {
    "jest": "^28.1.1",
    "nodemon": "^2.0.16",
    "supertest": "^6.2.3"
  }
}
EOF
    fi
    
    # Instalar dependências
    cd "$BACKEND_DIR"
    npm install
    
    # Verificar resultado
    if [ $? -eq 0 ]; then
        log "SUCCESS" "Dependências do backend instaladas com sucesso"
    else
        log "ERROR" "Falha ao instalar dependências do backend"
        return 1
    fi
    
    return 0
}

# Instalar dependências do frontend
install_frontend_dependencies() {
    log "INFO" "Instalando dependências do frontend..."
    
    # Verificar se package.json existe, caso contrário criar um básico
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        log "INFO" "Criando package.json para o frontend..."
        cat > "$FRONTEND_DIR/package.json" << EOF
{
  "name": "analisador-risco-cnpj-frontend",
  "version": "1.0.0",
  "description": "Frontend para o Analisador de Risco de Cliente PJ via CNPJ",
  "private": true,
  "dependencies": {
    "axios": "^0.27.2",
    "bootstrap": "^5.1.3",
    "chart.js": "^3.8.0",
    "react": "^18.1.0",
    "react-bootstrap": "^2.4.0",
    "react-dom": "^18.1.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.0.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF
    fi
    
    # Instalar dependências
    cd "$FRONTEND_DIR"
    npm install
    
    # Verificar resultado
    if [ $? -eq 0 ]; then
        log "SUCCESS" "Dependências do frontend instaladas com sucesso"
    else
        log "ERROR" "Falha ao instalar dependências do frontend"
        return 1
    fi
    
    return 0
}

# Iniciar backend
start_backend() {
    log "INFO" "Iniciando o servidor backend..."
    
    # Verificar se o código fonte principal existe
    if [ ! -f "$BACKEND_DIR/src/index.js" ]; then
        log "WARNING" "Arquivo principal do backend não encontrado. Criando um arquivo básico..."
        
        # Criar arquivo principal
        cat > "$BACKEND_DIR/src/index.js" << EOF
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Configuração do logger
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return \`\${timestamp} [\${level.toUpperCase()}] - \${message}\`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: path.join(logDir, 'application.log') 
        })
    ]
});

// Criação da aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${duration}ms\`);
    });
    next();
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Rota de consulta CNPJ (mock)
app.get('/api/consulta/:cnpj', (req, res) => {
    const { cnpj } = req.params;
    
    // Log da consulta
    logger.info(\`Consulta de CNPJ: \${cnpj}\`);
    
    // Validação básica de CNPJ
    if (!/^\d{14}$/.test(cnpj.replace(/[^\d]/g, ''))) {
        logger.warn(\`CNPJ inválido: \${cnpj}\`);
        return res.status(400).json({ error: 'CNPJ inválido' });
    }
    
    // Simulação de resposta
    setTimeout(() => {
        res.json({
            cnpj: cnpj,
            razao_social: "Empresa Exemplo S.A.",
            data_abertura: "2015-01-01",
            situacao_cadastral: "Ativa",
            cnae_principal: "6204-0/00 - Consultoria em tecnologia da informação",
            porte: "Médio",
            municipio: "São Paulo",
            uf: "SP",
            score: 25,
            classificacao_risco: "Baixo",
            criterios: [
                { nome: "Empresa ativa", pontuacao: 10 },
                { nome: "Mais de 3 anos de operação", pontuacao: 10 },
                { nome: "CNAE de baixo risco", pontuacao: 5 }
            ],
            cache: false
        });
    }, 1000); // Simulando latência de 1 segundo
});

// Tratamento de erro para rotas não encontradas
app.use((req, res) => {
    logger.warn(\`Rota não encontrada: \${req.originalUrl}\`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    logger.error(\`Erro: \${err.message}\`);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    logger.info(\`Servidor backend iniciado na porta \${PORT}\`);
    console.log(\`Servidor backend rodando em http://localhost:\${PORT}\`);
});
EOF
    fi
    
    # Iniciar backend em modo de desenvolvimento com nodemon, se disponível
    cd "$BACKEND_DIR"
    # Carregar NVM e usar Node.js 16
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 16 > /dev/null 2>&1 || echo "Falha ao usar Node.js 16. Tentando com node disponível."
    
    if [ "$DEV_MODE" = true ] && command -v npx &> /dev/null; then
        npx nodemon src/index.js > "$LOGS_DIR/backend.log" 2>&1 &
    else
        node src/index.js > "$LOGS_DIR/backend.log" 2>&1 &
    fi
    
    BACKEND_PID=$!
    echo $BACKEND_PID > "$SCRIPT_DIR/.backend.pid"
    
    log "SUCCESS" "Backend iniciado com PID $BACKEND_PID"
    log "INFO" "Logs sendo gravados em $LOGS_DIR/backend.log"
    
    # Aguardar um pouco para garantir que o backend inicializou
    sleep 3
    
    # Verificar se o backend está rodando
    if ps -p $BACKEND_PID > /dev/null; then
        log "SUCCESS" "Backend está rodando corretamente"
    else
        log "ERROR" "Falha ao iniciar o backend. Verifique os logs para mais detalhes."
        cat "$LOGS_DIR/backend.log"
        return 1
    fi
    
    return 0
}

# Iniciar frontend
start_frontend() {
    log "INFO" "Iniciando o frontend..."
    
    # Verificar se os arquivos principais existem
    if [ ! -f "$FRONTEND_DIR/src/index.js" ]; then
        log "WARNING" "Arquivos principais do frontend não encontrados. Criando arquivos básicos..."
        
        # Criar index.js
        cat > "$FRONTEND_DIR/src/index.js" << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
        
        # Criar App.js
        cat > "$FRONTEND_DIR/src/App.js" << EOF
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  // Formatar CNPJ ao digitar
  const formatarCnpj = (valor) => {
    const apenasNumeros = valor.replace(/\\D/g, '');
    
    let cnpjFormatado = apenasNumeros;
    if (apenasNumeros.length > 2) {
      cnpjFormatado = apenasNumeros.substring(0, 2) + '.' + apenasNumeros.substring(2);
    }
    if (apenasNumeros.length > 5) {
      cnpjFormatado = cnpjFormatado.substring(0, 6) + '.' + cnpjFormatado.substring(6);
    }
    if (apenasNumeros.length > 8) {
      cnpjFormatado = cnpjFormatado.substring(0, 10) + '/' + cnpjFormatado.substring(10);
    }
    if (apenasNumeros.length > 12) {
      cnpjFormatado = cnpjFormatado.substring(0, 15) + '-' + cnpjFormatado.substring(15);
    }
    
    return cnpjFormatado.substring(0, 18);
  };

  const handleChange = (e) => {
    setCnpj(formatarCnpj(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    const cnpjNumeros = cnpj.replace(/\\D/g, '');
    if (cnpjNumeros.length !== 14) {
      setErro('CNPJ deve conter 14 dígitos.');
      return;
    }
    
    setLoading(true);
    setErro(null);
    
    try {
      const response = await axios.get(\`\${API_URL}/consulta/\${cnpjNumeros}\`);
      setResultado(response.data);
      
      if (response.data.cache) {
        toast.info('Os dados apresentados são de uma consulta anterior (cache).');
      }
      
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      
      if (error.response && error.response.status === 400) {
        setErro(error.response.data.error || 'CNPJ inválido.');
      } else if (error.response && error.response.status === 404) {
        setErro('CNPJ não encontrado na base de dados.');
      } else {
        setErro('Erro ao consultar CNPJ. Tente novamente mais tarde.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (classificacao) => {
    if (!classificacao) return null;
    
    let variant = 'secondary';
    
    switch (classificacao.toLowerCase()) {
      case 'baixo':
        variant = 'success';
        break;
      case 'médio':
        variant = 'warning';
        break;
      case 'alto':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant} className="p-2">{classificacao}</Badge>;
  };

  const handleLimpar = () => {
    setCnpj('');
    setResultado(null);
    setErro(null);
  };

  return (
    <Container className="py-5">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Analisador de Risco via CNPJ</h1>
          <p className="text-center text-muted">
            Insira o CNPJ para analisar o risco da empresa
          </p>
        </Col>
      </Row>
      
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>CNPJ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={handleChange}
                    maxLength={18}
                  />
                </Form.Group>
                
                {erro && (
                  <Alert variant="danger">{erro}</Alert>
                )}
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Analisar Risco'}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleLimpar}>
                    Limpar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {resultado && (
        <Row className="justify-content-center">
          <Col md={10}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Resultado da Análise</h5>
                  {getRiskBadge(resultado.classificacao_risco)}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6>Dados da Empresa</h6>
                    <ul className="list-unstyled">
                      <li><strong>CNPJ:</strong> {resultado.cnpj}</li>
                      <li><strong>Razão Social:</strong> {resultado.razao_social}</li>
                      <li><strong>Data de Abertura:</strong> {resultado.data_abertura}</li>
                      <li><strong>Situação Cadastral:</strong> {resultado.situacao_cadastral}</li>
                      <li><strong>CNAE Principal:</strong> {resultado.cnae_principal}</li>
                      <li><strong>Porte:</strong> {resultado.porte}</li>
                      <li><strong>Localização:</strong> {resultado.municipio}/{resultado.uf}</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Análise de Risco</h6>
                    <p><strong>Score:</strong> {resultado.score}</p>
                    <p><strong>Critérios Aplicados:</strong></p>
                    <ul>
                      {resultado.criterios && resultado.criterios.map((criterio, index) => (
                        <li key={index}>
                          {criterio.nome}: {criterio.pontuacao > 0 ? '+' : ''}{criterio.pontuacao}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
    </Container>
  );
}

export default App;
EOF
        
        # Criar public/index.html
        mkdir -p "$FRONTEND_DIR/public"
        cat > "$FRONTEND_DIR/public/index.html" << EOF
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Analisador de Risco de Cliente PJ via CNPJ"
    />
    <title>Analisador de Risco via CNPJ</title>
  </head>
  <body>
    <noscript>Você precisa habilitar JavaScript para executar esta aplicação.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
    fi
    
    # Iniciar frontend
    cd "$FRONTEND_DIR"
    # Carregar NVM e usar Node.js 16
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 16 > /dev/null 2>&1 || echo "Falha ao usar Node.js 16. Tentando com node disponível."
    
    BROWSER=none npm start > "$LOGS_DIR/frontend.log" 2>&1 &
    
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$SCRIPT_DIR/.frontend.pid"
    
    log "SUCCESS" "Frontend iniciado com PID $FRONTEND_PID"
    log "INFO" "Logs sendo gravados em $LOGS_DIR/frontend.log"
    
    # Aguardar um pouco para garantir que o frontend inicializou
    sleep 5
    
    # Verificar se o frontend está rodando
    if ps -p $FRONTEND_PID > /dev/null; then
        log "SUCCESS" "Frontend está rodando corretamente"
        log "INFO" "Frontend disponível em: http://localhost:3000"
        
        # Abrir navegador automaticamente se solicitado
        if [ "$OPEN_BROWSER" = true ]; then
            log "INFO" "Abrindo navegador..."
            if command -v xdg-open &> /dev/null; then
                xdg-open "http://localhost:3000" &> /dev/null
            elif command -v open &> /dev/null; then
                open "http://localhost:3000" &> /dev/null
            else
                log "WARNING" "Não foi possível abrir o navegador automaticamente. Acesse http://localhost:3000 manualmente."
            fi
        fi
    else
        log "ERROR" "Falha ao iniciar o frontend. Verifique os logs para mais detalhes."
        cat "$LOGS_DIR/frontend.log"
        return 1
    fi
    
    return 0
}

# Função principal
main() {
    log "INFO" "Iniciando configuração do Analisador de Risco de Cliente PJ via CNPJ..."

    log "INFO" "Tentando parar instâncias anteriores da aplicação (se houver)..."
    if [ -f "$SCRIPT_DIR/stop.sh" ]; then
        bash "$SCRIPT_DIR/stop.sh"
    else
        log "WARNING" "Script stop.sh não encontrado. Tentando parar processos manualmente..."
        # Fallback manual stop logic (simplified from stop.sh)
        if [ -f "$BACKEND_PID_FILE" ]; then
            BACKEND_PID_TO_KILL=$(cat "$BACKEND_PID_FILE")
            if ps -p "$BACKEND_PID_TO_KILL" > /dev/null; then
                kill "$BACKEND_PID_TO_KILL" 2>/dev/null && sleep 1 && kill -9 "$BACKEND_PID_TO_KILL" 2>/dev/null
            fi
            rm -f "$BACKEND_PID_FILE"
        fi
        if [ -f "$FRONTEND_PID_FILE" ]; then
            FRONTEND_PID_TO_KILL=$(cat "$FRONTEND_PID_FILE")
            if ps -p "$FRONTEND_PID_TO_KILL" > /dev/null; then
                kill "$FRONTEND_PID_TO_KILL" 2>/dev/null && sleep 1 && kill -9 "$FRONTEND_PID_TO_KILL" 2>/dev/null
            fi
            rm -f "$FRONTEND_PID_FILE"
        fi
        # Add pkill for good measure if stop.sh is missing
        pkill -f "node.*backend/src/index.js"
        pkill -f "react-scripts start"
    fi
    log "INFO" "Verificação de instâncias anteriores concluída."
    
    # Criar diretórios necessários
    create_directories
    
    # Verificar requisitos
    check_requirements
    if [ $? -ne 0 ]; then
        log "ERROR" "Requisitos não atendidos. Abortando."
        exit 1
    fi
    
    # Instalar dependências
    install_backend_dependencies
    BACKEND_DEPS_OK=$?
    
    install_frontend_dependencies
    FRONTEND_DEPS_OK=$?
    
    if [ $BACKEND_DEPS_OK -ne 0 ] || [ $FRONTEND_DEPS_OK -ne 0 ]; then
        log "ERROR" "Falha ao instalar dependências. Abortando."
        exit 1
    fi
    
    # Se for apenas para instalar, parar aqui
    if [ "$INSTALL_ONLY" = true ]; then
        log "SUCCESS" "Instalação concluída com sucesso."
        exit 0
    fi
    
    # Iniciar backend
    start_backend
    BACKEND_OK=$?
    
    # Iniciar frontend
    start_frontend
    FRONTEND_OK=$?
    
    # Verificar se tudo está funcionando
    if [ $BACKEND_OK -eq 0 ] && [ $FRONTEND_OK -eq 0 ]; then
        log "SUCCESS" "Analisador de Risco de Cliente PJ via CNPJ iniciado com sucesso!"
        log "INFO" "Backend API: http://localhost:3001/api"
        log "INFO" "Frontend: http://localhost:3000"
        log "INFO" "Para parar a aplicação, execute ./stop.sh"
    else
        log "ERROR" "Ocorreram erros durante a inicialização. Verifique os logs para mais detalhes."
        exit 1
    fi
}

# Executar função principal
main
