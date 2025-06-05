# Documento de Arquitetura - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

### 1.1 Propósito
Este documento descreve a arquitetura técnica do sistema "Analisador de Risco de Cliente PJ via CNPJ", detalhando seus componentes, tecnologias, fluxos de dados e considerações de implementação. O objetivo é fornecer uma visão clara e detalhada para guiar o desenvolvimento do sistema.

### 1.2 Escopo
O escopo deste documento abrange todos os aspectos técnicos do sistema, incluindo:
- Tecnologias selecionadas
- Arquitetura de componentes
- Integração com APIs externas
- Modelo de dados
- Estratégia de logging
- Considerações de infraestrutura e implantação

### 1.3 Referências
- Documento de Requisitos do Product Manager (`documentacao/documento_requisitos.md`)
- Documentação da API pública de CNPJ: https://docs.cnpj.ws/referencia-de-api/api-publica

## 2. Visão Geral da Arquitetura

### 2.1 Padrão Arquitetural
O sistema seguirá uma arquitetura de três camadas:
1. **Camada de Apresentação (Frontend)**: Interface do usuário responsável pela exibição dos dados e interação com o usuário.
2. **Camada de Negócio (Backend)**: Implementação da lógica de negócio, processamento de dados e cálculo de score.
3. **Camada de Dados**: Armazenamento e acesso aos dados do sistema.

Adicionalmente, seguiremos o padrão MVC (Model-View-Controller) para organizar o código de forma clara e modular.

### 2.2 Diagrama de Alto Nível

```
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│                   │         │                   │         │                   │
│     Frontend      │◄────────►      Backend      │◄────────►    API Externa    │
│  (HTML/CSS/React) │         │     (Node.js)     │         │   (CNPJ.ws API)   │
│                   │         │                   │         │                   │
└───────────────────┘         └────────┬──────────┘         └───────────────────┘
                                       │
                                       ▼
                              ┌───────────────────┐
                              │                   │
                              │   Banco de Dados  │
                              │     (SQLite)      │
                              │                   │
                              └───────────────────┘
```

## 3. Tecnologias Selecionadas

### 3.1 Frontend
- **Framework**: React 18.x
- **Bibliotecas principais**:
  - React Router para navegação
  - Axios para requisições HTTP
  - Material-UI para componentes de interface
  - React Query para gerenciamento de estado das requisições
- **Linguagens**: JavaScript (ES6+), HTML5, CSS3
- **Ferramentas de build**: Webpack, Babel

**Justificativa**: React foi escolhido pela sua popularidade, robustez e flexibilidade. Material-UI fornecerá componentes pré-estilizados que permitirão desenvolver uma interface atraente e responsiva com menos esforço. React Query simplificará o gerenciamento de estados de requisições e cache.

### 3.2 Backend
- **Plataforma**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Bibliotecas principais**:
  - Axios para requisições HTTP à API externa
  - Winston para logging
  - Joi para validação de dados
  - CORS para habilitar requisições cross-origin
  - dotenv para gerenciamento de variáveis de ambiente
- **Linguagem**: JavaScript (ES6+)

**Justificativa**: Node.js com Express fornece um ambiente leve e eficiente para aplicações web, com excelente suporte a operações assíncronas, essencial para integração com APIs externas. A combinação dessas tecnologias permite um desenvolvimento rápido e robusto.

### 3.3 Banco de Dados
- **SGBD**: SQLite 3
- **ORM**: Sequelize

**Justificativa**: SQLite foi escolhido por sua simplicidade, não necessitar de instalação de servidor separado e ser suficiente para o escopo do projeto. Sequelize fornecerá uma camada de abstração para facilitar operações no banco de dados.

### 3.4 Outras Ferramentas e Tecnologias
- **Controle de Versão**: Git
- **Formatação de Código**: ESLint, Prettier
- **Testes**:
  - Jest para testes unitários
  - Supertest para testes de API
  - React Testing Library para testes de componentes

## 4. Componentes do Sistema

### 4.1 Componentes do Frontend

#### 4.1.1 Componentes React
- **App**: Componente raiz da aplicação
- **Header**: Cabeçalho da aplicação
- **CNPJInputForm**: Formulário para entrada do CNPJ
- **LoadingIndicator**: Indicador visual de carregamento
- **CompanyDetails**: Exibição dos dados da empresa
- **RiskAnalysis**: Exibição da análise de risco e score
- **RiskBadge**: Badge visual indicando o nível de risco
- **AlertList**: Lista de alertas relacionados à empresa
- **ErrorDisplay**: Componente para exibição de erros

#### 4.1.2 Serviços do Frontend
- **api.service.js**: Encapsula chamadas à API backend
- **validation.service.js**: Validação de entrada (CNPJ)
- **formatter.service.js**: Formatação de dados (CNPJ, datas, etc.)

### 4.2 Componentes do Backend

#### 4.2.1 Controllers
- **cnpjController.js**: Gerencia requisições relacionadas a CNPJ
- **healthController.js**: Endpoints para verificação de saúde da aplicação

#### 4.2.2 Services
- **cnpjService.js**: Lógica de negócio para processamento de CNPJ
- **riskAnalysisService.js**: Implementação do algoritmo de análise de risco
- **cnpjApiService.js**: Encapsula a integração com a API externa de CNPJ

#### 4.2.3 Models
- **Company.js**: Modelo para dados de empresas
- **RiskAnalysis.js**: Modelo para dados de análise de risco
- **CNAECategories.js**: Modelo para categorias de risco de CNAEs

#### 4.2.4 Middlewares
- **errorHandler.js**: Middleware para tratamento centralizado de erros
- **requestLogger.js**: Middleware para logging de requisições
- **validator.js**: Middleware para validação de entrada

### 4.3 Fluxo de Dados e Interações

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│            │     │            │     │            │     │            │
│  Frontend  │─────►  Backend   │─────►  API CNPJ  │─────►  Processo  │
│            │     │            │     │            │     │  de Score  │
│            │     │            │     │            │     │            │
└────────────┘     └────────────┘     └────────────┘     └────────────┘
       ▲                                                        │
       │                                                        │
       └────────────────────────────────────────────────────────┘
                                 Resposta
```

1. Usuário insere CNPJ no frontend
2. Frontend valida formato básico e envia ao backend
3. Backend valida o CNPJ e consulta a API externa
4. Backend processa os dados recebidos e calcula o score de risco
5. Backend retorna os dados processados ao frontend
6. Frontend exibe os resultados formatados ao usuário

## 5. Integração com API de CNPJ

### 5.1 Detalhes da API
- **URL Base**: https://publica.cnpj.ws/cnpj/
- **Endpoint Principal**: `/{cnpj}` (ex: https://publica.cnpj.ws/cnpj/12345678000199)
- **Método HTTP**: GET
- **Formato de Resposta**: JSON
- **Rate Limiting**: Consultar documentação atual para limites de requisições

### 5.2 Implementação da Integração

#### 5.2.1 Módulo Adapter para API
Será criado um módulo adapter (`src/services/cnpjApiAdapter.js`) que encapsulará toda a lógica de interação com a API externa. Este módulo:

- Gerenciará as requisições HTTP
- Tratará erros e timeouts
- Transformará os dados recebidos para o formato esperado pelo sistema
- Implementará cache básico para reduzir requisições repetidas

#### 5.2.2 Tratamento de Erros e Cenários
O adapter deve tratar adequadamente os seguintes cenários:

- **CNPJ não encontrado**: Retornar resposta específica para o frontend exibir mensagem apropriada
- **API indisponível**: Implementar retry com backoff exponencial (máx. 3 tentativas) e então retornar erro
- **Timeout**: Configurar timeout de 10 segundos conforme requisito não funcional
- **Erro de formato**: Validar e sanitizar a resposta antes de processá-la

#### 5.2.3 Exemplo de Chamada à API
```javascript
// Exemplo de como realizar chamada de teste à API via curl
// curl https://publica.cnpj.ws/cnpj/27865757000102
```

**IMPORTANTE**: Antes de implementar a integração, o desenvolvedor DEVE:
1. Consultar a documentação oficial da API: https://docs.cnpj.ws/referencia-de-api/api-publica
2. Realizar chamadas de teste via curl ou Postman para validar os formatos de resposta
3. Verificar limites de requisições e possíveis restrições

## 6. Modelo de Dados

### 6.1 Modelo Conceitual

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   Company     │      │ RiskAnalysis  │      │ CNAECategory  │
├───────────────┤      ├───────────────┤      ├───────────────┤
│ cnpj (PK)     │──┐   │ id (PK)       │      │ code (PK)     │
│ razaoSocial   │  │   │ cnpj (FK)     │──┐   │ description   │
│ nomeFantasia  │  └──►│ score         │  │   │ riskLevel     │
│ situacao      │      │ riskLevel     │  │   └───────────────┘
│ dataAbertura  │      │ factors       │  │            ▲
│ cnae          │──┐   │ createdAt     │  │            │
│ porte         │  │   └───────────────┘  │            │
│ municipio     │  │                      │            │
│ uf            │  │                      │            │
└───────────────┘  │                      │            │
                   └──────────────────────┴────────────┘
```

### 6.2 Esquema de Banco de Dados

#### 6.2.1 Tabela `companies`
```sql
CREATE TABLE companies (
  cnpj TEXT PRIMARY KEY,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  situacao TEXT NOT NULL,
  data_abertura DATE NOT NULL,
  cnae TEXT NOT NULL,
  descricao_cnae TEXT,
  porte TEXT,
  municipio TEXT,
  uf TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.2 Tabela `risk_analyses`
```sql
CREATE TABLE risk_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cnpj TEXT NOT NULL,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  factors TEXT NOT NULL, -- JSON string com fatores que impactaram o score
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cnpj) REFERENCES companies (cnpj)
);
```

#### 6.2.3 Tabela `cnae_categories`
```sql
CREATE TABLE cnae_categories (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  risk_level TEXT NOT NULL -- 'HIGH', 'LOW', 'NEUTRAL'
);
```

### 6.3 Dados Iniciais
A tabela `cnae_categories` será inicializada com os dados de categorização de CNAEs conforme definido nas regras de negócio:

```javascript
const initialCnaeData = [
  { code: '6491-3/00', description: 'Sociedades de fomento mercantil - factoring', riskLevel: 'HIGH' },
  { code: '4120-4/00', description: 'Construção de edifícios', riskLevel: 'HIGH' },
  // outros CNAEs conforme definido no documento de requisitos...
];
```

## 7. Logging e Monitoramento

### 7.1 Estratégia de Logging

#### 7.1.1 O que será logado
- **Eventos de Aplicação**:
  - Inicialização e encerramento da aplicação
  - Erros críticos e exceções não tratadas
- **Requisições HTTP**:
  - Requisições recebidas (método, rota, IP)
  - Respostas enviadas (status, tempo de resposta)
- **Integração com API Externa**:
  - Requisições enviadas à API de CNPJ (CNPJ consultado)
  - Resumo das respostas recebidas (status HTTP, sucesso/erro)
- **Análise de Risco**:
  - CNPJ analisado
  - Score calculado e nível de risco
  - Fatores que impactaram o score

#### 7.1.2 Níveis de Log
- **ERROR**: Erros que afetam o funcionamento da aplicação
- **WARN**: Situações inesperadas que não impedem o funcionamento, mas merecem atenção
- **INFO**: Eventos normais de operação que documentam o fluxo da aplicação
- **DEBUG**: Informações detalhadas úteis para depuração (apenas em ambiente de desenvolvimento)

#### 7.1.3 Destino dos Logs
- **Console**: Todos os logs (nível conforme ambiente)
- **Arquivo**: `logs/application.log` (rotação diária, retenção de 7 dias)

#### 7.1.4 Formato dos Logs
```
YYYY-MM-DD HH:MM:SS [NÍVEL] [CONTEXTO] - Mensagem
```

Exemplo:
```
2025-06-04 10:15:30 [INFO] [Server] - Aplicação iniciada na porta 3000
2025-06-04 10:16:45 [INFO] [CNPJController] - Consultando CNPJ: 27.865.757/0001-02
2025-06-04 10:16:46 [INFO] [CNPJApiService] - Resposta da API: HTTP 200, dados encontrados
2025-06-04 10:16:47 [INFO] [RiskService] - Score calculado: 15, Risco: MÉDIO
```

### 7.2 Implementação de Logging
Utilizaremos a biblioteca Winston para implementação dos logs:

```javascript
// src/config/logger.js
const winston = require('winston');
const { format, transports } = winston;
const path = require('path');

const logFormat = format.printf(({ level, message, timestamp, context }) => {
  return `${timestamp} [${level.toUpperCase()}] [${context || 'App'}] - ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ 
      filename: path.join(__dirname, '../../logs/application.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 7,
    })
  ]
});

module.exports = logger;
```

## 8. Infraestrutura e Implantação

### 8.1 Requisitos de Infraestrutura
Por ser uma aplicação de demonstração, a infraestrutura será simples:

- **Ambiente de Desenvolvimento**:
  - Computador local com Node.js 18.x+ instalado
  - NPM ou Yarn para gerenciamento de dependências
  - Git para controle de versão

- **Ambiente de Execução**:
  - Máquina com Node.js 18.x+ instalado
  - Mínimo de 1GB de RAM
  - 500MB de espaço em disco
  - Conexão com internet para acessar a API externa

### 8.2 Processo de Build e Deployment

#### 8.2.1 Setup do Ambiente
```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

#### 8.2.2 Execução em Desenvolvimento
```bash
# Iniciar backend (modo desenvolvimento)
cd backend
npm run dev

# Iniciar frontend (modo desenvolvimento)
cd ../frontend
npm start
```

#### 8.2.3 Build para Produção
```bash
# Build do frontend
cd frontend
npm run build

# Preparar backend para produção
cd ../backend
npm run build
```

#### 8.2.4 Scripts de Automação
Serão criados dois scripts principais:

1. **start.sh**: Verifica dependências, instala o necessário e inicia a aplicação
2. **stop.sh**: Para a aplicação de forma segura

## 9. Diagramas da Arquitetura

### 9.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (React)                                                │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │             │     │             │     │             │        │
│  │ Components  │────►│  Services   │────►│    Store    │        │
│  │             │     │             │     │             │        │
│  └─────────────┘     └─────────────┘     └─────────────┘        │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Backend (Node.js + Express)                                     │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │             │     │             │     │             │        │
│  │  Routes &   │────►│  Services   │────►│   Models    │        │
│  │ Controllers │     │             │     │             │        │
│  │             │     │             │     │             │        │
│  └─────────────┘     └─────┬───────┘     └─────┬───────┘        │
│                            │                   │                 │
│                            │                   │                 │
│                      ┌─────▼───────┐     ┌─────▼───────┐         │
│                      │             │     │             │         │
│                      │ CNPJ API    │     │  SQLite DB  │         │
│                      │ Adapter     │     │             │         │
│                      │             │     │             │         │
│                      └─────┬───────┘     └─────────────┘         │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      API Externa (CNPJ.ws)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Diagrama de Sequência - Consulta de CNPJ e Análise de Risco

```
┌───────┐          ┌───────────┐          ┌───────────┐          ┌───────────┐          ┌─────────┐
│       │          │           │          │           │          │           │          │         │
│ User  │          │ Frontend  │          │ Backend   │          │ CNPJ API  │          │ Database│
│       │          │           │          │           │          │           │          │         │
└───┬───┘          └─────┬─────┘          └─────┬─────┘          └─────┬─────┘          └────┬────┘
    │                    │                      │                      │                     │
    │ Insere CNPJ        │                      │                      │                     │
    │ ──────────────────>│                      │                      │                     │
    │                    │                      │                      │                     │
    │                    │ Valida formato       │                      │                     │
    │                    │ ─────────────────┐   │                      │                     │
    │                    │                  │   │                      │                     │
    │                    │ <────────────────┘   │                      │                     │
    │                    │                      │                      │                     │
    │                    │ Envia CNPJ           │                      │                     │
    │                    │ ─────────────────────>                      │                     │
    │                    │                      │                      │                     │
    │                    │                      │ Consulta CNPJ        │                     │
    │                    │                      │ ─────────────────────>                     │
    │                    │                      │                      │                     │
    │                    │                      │                      │ Processa            │
    │                    │                      │                      │ ──────────────┐     │
    │                    │                      │                      │               │     │
    │                    │                      │                      │ <─────────────┘     │
    │                    │                      │                      │                     │
    │                    │                      │ Retorna dados        │                     │
    │                    │                      │ <─────────────────────                     │
    │                    │                      │                      │                     │
    │                    │                      │ Salva consulta       │                     │
    │                    │                      │ ───────────────────────────────────────────>
    │                    │                      │                      │                     │
    │                    │                      │ Calcula score        │                     │
    │                    │                      │ ─────────────────┐   │                     │
    │                    │                      │                  │   │                     │
    │                    │                      │ <────────────────┘   │                     │
    │                    │                      │                      │                     │
    │                    │                      │ Salva análise        │                     │
    │                    │                      │ ───────────────────────────────────────────>
    │                    │                      │                      │                     │
    │                    │ Retorna resultados   │                      │                     │
    │                    │ <─────────────────────                      │                     │
    │                    │                      │                      │                     │
    │                    │ Exibe dashboard      │                      │                     │
    │                    │ ─────────────────┐   │                      │                     │
    │                    │                  │   │                      │                     │
    │                    │ <────────────────┘   │                      │                     │
    │                    │                      │                      │                     │
    │ Visualiza resultado│                      │                      │                     │
    │ <──────────────────│                      │                      │                     │
    │                    │                      │                      │                     │
```

### 9.3 Diagrama de Implantação

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                       Máquina/Servidor                        │
│                                                               │
│   ┌───────────────┐       ┌───────────────┐                   │
│   │               │       │               │                   │
│   │  Frontend     │◄──────►   Backend     │                   │
│   │  (React)      │       │  (Node.js)    │                   │
│   │  Porta: 3000  │       │  Porta: 3001  │                   │
│   │               │       │               │                   │
│   └───────────────┘       └───────┬───────┘                   │
│                                   │                           │
│                                   ▼                           │
│                           ┌───────────────┐                   │
│                           │               │                   │
│                           │   SQLite DB   │                   │
│                           │   (Arquivo)   │                   │
│                           │               │                   │
│                           └───────────────┘                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                      Internet / Rede                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                   API Externa (CNPJ.ws)                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## 10. Considerações de Segurança

### 10.1 Validação de Entrada
- Todos os inputs do usuário devem ser validados tanto no frontend quanto no backend
- Para o CNPJ, usar validação de formato e dígitos verificadores
- Sanitizar dados antes de processá-los ou armazená-los

### 10.2 Proteção contra Ataques Comuns
- Implementar rate limiting para prevenir abuso da API
- Configurar headers HTTP de segurança (Content-Security-Policy, X-XSS-Protection, etc.)
- Validar e sanitizar parâmetros de consulta e corpo das requisições

### 10.3 Configurações Sensíveis
- Usar variáveis de ambiente para configurações sensíveis
- Não incluir credenciais ou chaves no código-fonte
- Configurar timeout adequado para requisições à API externa

## 11. Considerações Finais

### 11.1 Limitações Conhecidas
- A API pública de CNPJ pode ter limitações de consultas
- A análise de risco é simplificada e baseada apenas em dados públicos
- Não há autenticação de usuários nesta versão

### 11.2 Potenciais Melhorias Futuras
- Implementação de autenticação e autorização
- Histórico de consultas por usuário
- Expansão dos critérios de análise de risco
- Dashboard com estatísticas de consultas
- Exportação de relatórios

### 11.3 Recomendações para o Desenvolvimento
- Seguir o princípio de "fail fast" - validar entradas e falhar cedo
- Implementar testes unitários e de integração desde o início
- Manter logs detalhados, especialmente para interações com a API externa
- Documentar o código adequadamente
- Implementar o sistema de forma incremental, começando pelos componentes essenciais