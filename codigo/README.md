# Analisador de Risco de Cliente PJ via CNPJ

Este projeto implementa uma ferramenta para análise de risco de empresas brasileiras através da consulta de seu CNPJ em bases de dados públicas.

## Estrutura do Projeto

O projeto está estruturado em duas partes principais:

- **Backend**: API REST em Node.js/Express que consulta dados de CNPJ, calcula o score de risco e fornece endpoints para frontend
- **Frontend**: Interface web em React que permite aos usuários inserir CNPJs e visualizar os resultados da análise

## Requisitos

- Node.js 18.x ou superior
- NPM 8.x ou superior

## Como Executar

### Backend

1. Navegue até o diretório do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do diretório backend com as seguintes variáveis:

```
PORT=3000
NODE_ENV=development
DB_PATH=./database.sqlite
CACHE_TTL=3600
CNPJ_API_URL=https://publica.cnpj.ws/cnpj
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

4. Inicie o servidor:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

### Frontend

1. Navegue até o diretório do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`.

## Endpoints da API

### Validar CNPJ

```
GET /api/cnpj/validate/:cnpj
```

Verifica se o formato do CNPJ é válido.

### Consultar CNPJ

```
GET /api/cnpj/:cnpj
```

Consulta os dados do CNPJ e retorna com análise de risco.

### Detalhes do Risco

```
GET /api/cnpj/:cnpj/details
```

Retorna detalhes dos critérios de risco para um CNPJ.

### Exportar PDF

```
GET /api/cnpj/:cnpj/export
```

Gera um PDF com a análise de risco para download.

## Funcionalidades

- Consulta de CNPJ com validação de formato
- Exibição de dados cadastrais da empresa
- Cálculo de score de risco baseado em critérios como tempo de operação, situação cadastral e CNAE
- Classificação em três níveis de risco: Baixo, Médio e Alto
- Detalhamento dos critérios que impactaram o score
- Destaque para sinais de alerta identificados
- Histórico das últimas consultas realizadas
- Exportação da análise em formato PDF

## Tecnologias Utilizadas

### Backend
- Node.js e Express
- SQLite com interface nativa
- Axios para requisições HTTP
- Winston para logging
- PDFKit para geração de PDFs
- Node-cache para caching

### Frontend
- React 18
- Material-UI para componentes de interface
- React Router para navegação
- Axios para requisições HTTP
- React Hook Form para formulários
- Recharts para visualizações (se necessário)