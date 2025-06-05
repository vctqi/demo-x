# Analisador de Risco de Cliente PJ via CNPJ

Este sistema permite analisar o risco associado a empresas (Pessoas Jurídicas) através da consulta de seus CNPJs. O sistema consulta dados públicos da empresa e calcula um score de risco com base em critérios como tempo de operação, situação cadastral e atividade econômica.

## Arquitetura

O sistema é composto por:

- **Backend**: API RESTful desenvolvida com Node.js e Express
- **Frontend**: Interface de usuário desenvolvida com React e Material-UI
- **Banco de Dados**: SQLite para armazenamento de dados

## Requisitos de Sistema

- Node.js 18.x ou superior
- NPM 8.x ou superior
- Acesso à internet (para consulta à API externa de CNPJ)
- Sistema operacional Linux, macOS ou Windows

## Configuração do Ambiente

### 1. Instalação de Dependências do Sistema

**No Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install -y curl nodejs npm
```

**No macOS (usando Homebrew):**

```bash
brew install node
```

**No Windows:**

Baixe e instale o Node.js do site oficial: https://nodejs.org/

### 2. Verificação da Instalação

```bash
node --version  # Deve mostrar v18.x ou superior
npm --version   # Deve mostrar 8.x ou superior
```

## Instalação da Aplicação

### 1. Método Automatizado (Recomendado)

Use o script `start.sh` que irá verificar as dependências, instalá-las se necessário e iniciar a aplicação:

```bash
cd /caminho/para/codigo
chmod +x start.sh  # Tornar o script executável, se ainda não estiver
./start.sh
```

### 2. Instalação Manual

Se preferir instalar manualmente, siga estes passos:

**Backend:**

```bash
cd /caminho/para/codigo/backend
npm install
```

**Frontend:**

```bash
cd /caminho/para/codigo/frontend
npm install
```

## Execução da Aplicação

### 1. Método Automatizado (Recomendado)

Para iniciar a aplicação completa (backend e frontend):

```bash
cd /caminho/para/codigo
./start.sh
```

Para parar a aplicação:

```bash
cd /caminho/para/codigo
./stop.sh
```

### 2. Execução Manual

**Backend:**

```bash
cd /caminho/para/codigo/backend
npm start
```

O backend será iniciado na porta 3001: http://localhost:3001

**Frontend:**

```bash
cd /caminho/para/codigo/frontend
npm start
```

O frontend será iniciado na porta 3000: http://localhost:3000

## Uso da Aplicação

1. Abra seu navegador e acesse: http://localhost:3000
2. Insira um CNPJ válido no campo de busca (com ou sem formatação)
3. Clique no botão "Analisar Risco"
4. Visualize os dados da empresa e a análise de risco
5. Para uma nova consulta, clique no botão "Nova Consulta"

## Estrutura do Projeto

```
codigo/
├── backend/              # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/       # Configurações (banco de dados, logger)
│   │   ├── controllers/  # Controladores da API
│   │   ├── middlewares/  # Middlewares Express
│   │   ├── models/       # Modelos de dados (Sequelize)
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços de negócio
│   │   ├── utils/        # Utilitários
│   │   └── server.js     # Ponto de entrada do servidor
│   └── package.json      # Dependências do backend
│
├── frontend/             # Aplicação React
│   ├── public/           # Arquivos estáticos
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── services/     # Serviços de API
│   │   ├── utils/        # Utilitários
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Ponto de entrada
│   └── package.json      # Dependências do frontend
│
├── logs/                 # Arquivos de log da aplicação
├── start.sh              # Script para iniciar a aplicação
├── stop.sh               # Script para parar a aplicação
└── README.md             # Este arquivo
```

## Endpoints da API

- `GET /api/health`: Verificar saúde da API
- `GET /api/cnpj/:cnpj`: Consultar CNPJ e obter análise de risco
- `POST /api/cnpj/validate`: Validar formato de CNPJ

## Solução de Problemas

### API não inicia

Verifique os logs em `logs/backend.log` para identificar o problema.

Possíveis soluções:
- Porta 3001 já em uso: altere a porta no arquivo `backend/src/server.js`
- Erro de permissão: execute com privilégios adequados
- Dependências faltando: execute `npm install` no diretório backend

### Frontend não inicia

Verifique os logs em `logs/frontend.log` para identificar o problema.

Possíveis soluções:
- Porta 3000 já em uso: execute com `PORT=3002 npm start`
- Dependências faltando: execute `npm install` no diretório frontend

### Erro de conexão com a API

Se o frontend não conseguir se conectar ao backend:
- Verifique se o backend está rodando: `ps aux | grep node`
- Verifique se as portas estão corretas
- Verifique se há algum firewall bloqueando a conexão

### Erros na Consulta de CNPJ

- Verifique se o CNPJ é válido
- Verifique a conexão com a internet
- A API externa pode estar com limitações de consulta ou indisponível

## Logs

Os logs da aplicação são armazenados nos seguintes locais:
- Backend: `logs/application.log` e `logs/backend.log`
- Frontend: `logs/frontend.log`
- Scripts: `logs/start_script.log` e `logs/stop_script.log`