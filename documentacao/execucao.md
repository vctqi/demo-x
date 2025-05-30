# Documentação de Execução - Analisador de Risco CNPJ

## Requisitos de Sistema
- Node.js v14+ e npm v6+
- SQLite3

## Configuração do Ambiente

### 1. Instalação das Dependências

#### Backend
```bash
cd codigo/backend
npm install
```

#### Frontend
```bash
cd codigo/frontend
npm install
```

### 2. Configuração do Banco de Dados
O sistema utiliza SQLite como banco de dados. A criação do banco e tabelas é automática na primeira execução.

### 3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na pasta `codigo/backend` com o seguinte conteúdo:

```
PORT=3001
NODE_ENV=development
CNPJ_API_URL=https://api.cnpj.ws/
CNPJ_API_TOKEN=seu_token_aqui
```

## Execução do Sistema

### Ambiente de Desenvolvimento

#### Backend
```bash
cd codigo/backend
npm run dev
```
O servidor será iniciado na porta 3001 (ou conforme configurado no .env).

#### Frontend
```bash
cd codigo/frontend
npm start
```
A aplicação frontend será iniciada na porta 3000 e abrirá automaticamente no navegador.

### Produção

#### Backend
```bash
cd codigo/backend
npm run build
npm start
```

#### Frontend
```bash
cd codigo/frontend
npm run build
```
Os arquivos estáticos gerados estarão na pasta `build` e podem ser servidos por qualquer servidor web.

## Testes

### Executando Testes Unitários
```bash
cd codigo/backend
npm test

cd codigo/frontend
npm test
```

### Executando Testes End-to-End
```bash
cd codigo
npm run test:e2e
```

## Uso da Aplicação

1. Acesse a aplicação pelo navegador (http://localhost:3000 em desenvolvimento)
2. Digite um CNPJ válido no campo de entrada
3. Clique no botão "Analisar Risco"
4. Visualize os resultados da análise

## Resolução de Problemas

### API externa indisponível
Se a API CNPJ.ws estiver indisponível, o sistema apresentará uma mensagem de erro. Verifique:
- Sua conexão com a internet
- Se o token da API está válido
- Status da API em https://status.cnpj.ws/

### Erro no banco de dados
Se ocorrerem erros relacionados ao banco de dados:
- Verifique permissões de escrita na pasta do projeto
- Delete o arquivo do banco e reinicie a aplicação para recriá-lo

## Recursos Adicionais
- Documentação da API: http://localhost:3001/api-docs (com servidor rodando)
- Documentação do código: Ver pasta `codigo/docs`