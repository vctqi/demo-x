# Analisador de Risco de Cliente PJ via CNPJ

Este sistema permite analisar o risco de clientes pessoa jurídica através da consulta do CNPJ, utilizando dados públicos e critérios pré-definidos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend**: API REST desenvolvida com Node.js, Express e SQLite
- **Frontend**: Interface de usuário desenvolvida com React e Material-UI

## Requisitos

Para executar o sistema, você precisa ter instalado:

- Node.js (v16 ou superior)
- npm (v7 ou superior)

## Configuração e Execução

### Backend

1. Navegue até o diretório do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm run dev
```

O servidor será iniciado na porta 3000.

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

O frontend será iniciado na porta 3001 e estará acessível em [http://localhost:3001](http://localhost:3001).

## Funcionalidades

- Consulta de dados cadastrais de empresas através do CNPJ
- Análise de risco baseada em critérios pré-definidos
- Visualização de dashboard com classificação de risco
- Histórico de consultas

## API REST

O backend expõe os seguintes endpoints:

- **POST /api/cnpj/validate**: Valida o formato de um CNPJ
- **GET /api/cnpj/:cnpj**: Obtém dados cadastrais de uma empresa
- **GET /api/risk/:cnpj**: Obtém análise de risco de uma empresa
- **POST /api/history**: Adiciona uma consulta ao histórico
- **GET /api/history?userSession=:id**: Obtém o histórico de consultas de uma sessão

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQLite (via Sequelize ORM)
- Joi (validação)
- Axios (requisições HTTP)
- node-cache (cache em memória)

### Frontend
- React
- Material-UI
- React Router
- Axios
- Vite (build tool)

## Limitações e Considerações

- O sistema utiliza a API pública [CNPJ.ws](https://docs.cnpj.ws) para consultar dados de CNPJ
- A análise de risco é simplificada e baseada apenas em alguns critérios básicos
- O histórico de consultas é mantido apenas durante a sessão atual
- Este é um sistema de demonstração e não substitui uma análise completa de risco

## Desenvolvedor

Este projeto foi desenvolvido como parte de uma demonstração de aplicação web para análise simplificada de risco de clientes PJ.