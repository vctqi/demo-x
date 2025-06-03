# Documento de Arquitetura Técnica - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento detalha a arquitetura técnica proposta para o sistema "Analisador de Risco de Cliente PJ via CNPJ", baseado nos requisitos fornecidos pelo Product Manager. A arquitetura foi projetada para atender a todos os requisitos funcionais e não funcionais, garantindo um sistema eficiente, escalável e de fácil manutenção.

### 1.1 Visão Geral da Solução

O sistema permitirá que usuários insiram um CNPJ e obtenham uma análise simplificada de risco baseada em dados públicos e critérios predefinidos. A solução consultará uma API pública de CNPJ, processará os dados obtidos aplicando regras de negócio para calcular um score de risco, e apresentará os resultados em um dashboard intuitivo com indicadores visuais claros.

## 2. Escolha de Tecnologias

### 2.1 Frontend
- **Framework Principal**: React.js
  - **Justificativa**: React oferece uma excelente experiência de desenvolvimento, componentes reutilizáveis, e renderização eficiente para interfaces dinâmicas como dashboards.
  - **Versão**: 18.x (última versão estável)

- **Bibliotecas Complementares**:
  - **Axios**: Para requisições HTTP
  - **React Router**: Para navegação (caso necessário expandir para múltiplas páginas)
  - **Styled Components**: Para estilização dos componentes
  - **React-Toastify**: Para notificações e alertas ao usuário
  - **React-Loading**: Para indicadores de carregamento durante consultas

### 2.2 Backend
- **Plataforma**: Node.js
  - **Justificativa**: Excelente para APIs RESTful, processamento assíncrono eficiente e compatibilidade com JavaScript/TypeScript do frontend.
  - **Versão**: 18.x LTS

- **Framework Web**: Express.js
  - **Justificativa**: Leve, flexível e amplamente adotado para APIs Node.js.

- **Bibliotecas Complementares**:
  - **Axios**: Para consultas à API externa de CNPJ
  - **Node-cache**: Para implementação de cache das consultas
  - **Winston**: Para logging
  - **Joi**: Para validação de entrada
  - **Cors**: Para configuração de segurança de Cross-Origin
  - **Helmet**: Para configuração de cabeçalhos HTTP de segurança

### 2.3 Banco de Dados
- **SQLite**
  - **Justificativa**: Conforme sugerido, é leve, não requer instalação de servidor separado, e adequado para o volume esperado de dados.
  - **ORM**: Sequelize - para abstração do banco de dados e facilidade de manutenção

### 2.4 Ferramentas de Desenvolvimento
- **Gerenciador de Pacotes**: npm
- **Linting e Formatação**: ESLint + Prettier
- **Testes**: Jest + React Testing Library (frontend) e Supertest (backend)
- **Documentação da API**: Swagger/OpenAPI

## 3. Arquitetura do Sistema

A arquitetura adotada segue o padrão de aplicação web em camadas, com separação clara entre frontend e backend, comunicando-se via API REST.

### 3.1 Visão de Alto Nível

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐
│   Cliente   │◄───►│   Backend   │◄───►│   API CNPJ    │
│  (Browser)  │     │  (Node.js)  │     │   Externa     │
└─────────────┘     └──────┬──────┘     └───────────────┘
                           │
                    ┌──────▼──────┐
                    │   SQLite    │
                    │  Database   │
                    └─────────────┘
```

### 3.2 Componentes Principais e Responsabilidades

#### 3.2.1 Frontend (Cliente)
- **Componentes de Apresentação**: Responsáveis pela interface visual
  - `Header`: Cabeçalho da aplicação
  - `CNPJForm`: Formulário de entrada do CNPJ
  - `CompanyInfo`: Exibição dos dados da empresa
  - `RiskBadge`: Badge visual de indicação de risco
  - `ScoreDetails`: Detalhamento dos critérios e pontuação
  - `ErrorDisplay`: Componente para exibição de erros

- **Componentes de Contêiner**: Orquestram os componentes de apresentação
  - `Dashboard`: Organiza e gerencia o estado geral da aplicação
  - `ResultsPanel`: Gerencia a exibição de resultados

- **Serviços**:
  - `api.js`: Centraliza as chamadas ao backend
  - `formatter.js`: Utilitários para formatação de dados (CNPJ, datas, etc.)
  - `validator.js`: Validação de entradas do usuário

#### 3.2.2 Backend (Servidor)
- **Camada de API**: Exposição de endpoints RESTful
  - `CNPJController`: Controla as operações relacionadas a CNPJs

- **Camada de Serviços**: Lógica de negócio
  - `CNPJService`: Consulta à API externa e tratamento dos dados
  - `RiskAnalysisService`: Implementa regras de análise de risco
  - `CacheService`: Gerencia o cache de consultas

- **Camada de Dados**: Interação com banco de dados
  - `CompanyRepository`: Acesso a dados de empresas consultadas
  - `CNAERepository`: Acesso à classificação de CNAEs
  - `Models`: Definição do esquema de dados

#### 3.2.3 Banco de Dados
- **Tabelas**:
  - `companies`: Armazena dados de empresas consultadas
  - `cnaes`: Classificação de CNAEs por nível de risco
  - `consultations`: Histórico de consultas (opcional)

### 3.3 Padrões Arquiteturais Adotados

- **Frontend**: Arquitetura baseada em componentes React
- **Backend**: Arquitetura em camadas (MVC modificado)
  - Controllers: Tratamento de requisições e respostas
  - Services: Lógica de negócio
  - Repositories: Acesso a dados
  - Models: Estrutura de dados

## 4. Integração com Sistemas Externos

### 4.1 API Pública de CNPJ

- **URL Base**: https://publica.cnpj.ws/cnpj/
- **Método de Comunicação**: REST/HTTP
- **Formato de Dados**: JSON
- **Endpoint Principal**: `GET https://publica.cnpj.ws/cnpj/{cnpj}`

### 4.2 Estratégias de Integração

- **Padrão de Comunicação**: REST assíncrono
- **Tratamento de Falhas**:
  - Implementação de retry automático (máximo 3 tentativas)
  - Circuit breaker para evitar sobrecarga da API externa
  - Timeout configurado para 10 segundos

### 4.3 Estratégia de Cache

- **Tipo de Cache**: Em memória (node-cache) + persistente (SQLite)
- **Política de Expiração**: 24 horas para dados cadastrais
- **Invalidação**: Manual por CNPJ ou automática por tempo

## 5. Modelo de Dados

### 5.1 Modelo Conceitual

- **Entidade Principal**: Empresa (PJ)
  - Identificada pelo CNPJ
  - Possui atributos cadastrais (razão social, data de abertura, etc.)
  - Associada a um CNAE principal
  - Possui um score calculado de risco

- **Entidade Secundária**: CNAE
  - Identificada pelo código
  - Possui descrição
  - Classificada por nível de risco

### 5.2 Modelo Lógico

#### Tabela: companies
| Campo             | Tipo         | Descrição                           |
|-------------------|--------------|-------------------------------------|
| cnpj              | VARCHAR(14)  | CNPJ sem formatação (PK)           |
| razao_social      | VARCHAR(255) | Nome oficial da empresa             |
| nome_fantasia     | VARCHAR(255) | Nome fantasia                       |
| situacao_cadastral| VARCHAR(50)  | Situação na Receita Federal         |
| data_abertura     | DATE         | Data de início das atividades       |
| cnae_principal    | VARCHAR(7)   | Código CNAE principal               |
| cnae_descricao    | VARCHAR(255) | Descrição da atividade principal    |
| porte             | VARCHAR(50)  | Porte da empresa                    |
| cidade            | VARCHAR(100) | Cidade sede                         |
| uf                | CHAR(2)      | Estado (UF)                         |
| score             | INTEGER      | Pontuação calculada                 |
| risk_level        | VARCHAR(20)  | Classificação (Baixo, Médio, Alto)  |
| last_updated      | TIMESTAMP    | Data/hora da última atualização     |

#### Tabela: cnaes
| Campo             | Tipo         | Descrição                          |
|-------------------|--------------|----------------------------------- |
| codigo            | VARCHAR(7)   | Código CNAE (PK)                   |
| descricao         | VARCHAR(255) | Descrição da atividade             |
| nivel_risco       | VARCHAR(20)  | Classificação (Baixo, Médio, Alto) |
| pontuacao         | INTEGER      | Pontuação associada ao risco       |

### 5.3 Scripts de Criação do Banco

```sql
-- Tabela de empresas consultadas
CREATE TABLE IF NOT EXISTS companies (
    cnpj TEXT PRIMARY KEY,
    razao_social TEXT,
    nome_fantasia TEXT,
    situacao_cadastral TEXT,
    data_abertura DATE,
    cnae_principal TEXT,
    cnae_descricao TEXT,
    porte TEXT,
    cidade TEXT,
    uf TEXT,
    score INTEGER,
    risk_level TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de classificação de CNAEs
CREATE TABLE IF NOT EXISTS cnaes (
    codigo TEXT PRIMARY KEY,
    descricao TEXT,
    nivel_risco TEXT,
    pontuacao INTEGER
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_companies_risk_level ON companies(risk_level);
CREATE INDEX IF NOT EXISTS idx_cnaes_nivel_risco ON cnaes(nivel_risco);
```

## 6. Infraestrutura Necessária

### 6.1 Ambiente de Desenvolvimento
- Node.js v18.x LTS
- npm 8.x+
- SQLite 3
- Git para controle de versão

### 6.2 Ambiente de Produção
- Servidor: Qualquer ambiente que suporte Node.js
  - Opções: VPS, serviços de PaaS (Heroku, Render, Railway)
- Requisitos mínimos:
  - CPU: 1 vCPU
  - RAM: 512MB
  - Armazenamento: 1GB

### 6.3 Requisitos de Rede
- Conexão externa para acesso à API pública de CNPJ
- Porta HTTP/HTTPS para acesso dos usuários

### 6.4 Considerações de Segurança
- Implementar rate limiting por IP
- Utilizar HTTPS para todas as comunicações
- Implementar validação de entrada em todos os campos
- Configurar headers de segurança via Helmet
- Implementar proteção contra ataques comuns (XSS, CSRF, etc.)

## 7. Diagramas de Arquitetura

### 7.1 Diagrama de Componentes

```
┌───────────────────────────────────────────────────────────────┐
│                         Frontend                               │
│                                                               │
│  ┌──────────┐   ┌───────────┐   ┌──────────────┐   ┌────────┐ │
│  │ CNPJForm │──►│ Dashboard │◄──│ CompanyInfo  │◄──│ API    │ │
│  └──────────┘   │           │   └──────────────┘   │ Client │ │
│                 │           │   ┌──────────────┐   │        │ │
│                 │           │◄──│ RiskBadge    │◄──│        │ │
│                 │           │   └──────────────┘   │        │ │
│                 │           │   ┌──────────────┐   │        │ │
│                 │           │◄──│ ScoreDetails │◄──│        │ │
│                 └───────────┘   └──────────────┘   └────────┘ │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                          Backend                               │
│                                                                │
│  ┌──────────────┐   ┌─────────────────┐   ┌──────────────────┐ │
│  │     API      │   │   Services      │   │  Repositories    │ │
│  │ Controllers  │   │                 │   │                  │ │
│  │              │   │ ┌─────────────┐ │   │ ┌──────────────┐ │ │
│  │ ┌──────────┐ │   │ │ CNPJService │ │   │ │  Company     │ │ │
│  │ │CNPJ      │ │◄─►│ └─────────────┘ │◄─►│ │ Repository   │ │ │
│  │ │Controller│ │   │ ┌─────────────┐ │   │ └──────────────┘ │ │
│  │ └──────────┘ │   │ │RiskAnalysis │ │   │ ┌──────────────┐ │ │
│  │              │   │ │  Service    │ │   │ │    CNAE      │ │ │
│  │              │   │ └─────────────┘ │   │ │ Repository   │ │ │
│  │              │   │ ┌─────────────┐ │   │ └──────────────┘ │ │
│  │              │   │ │CacheService │ │   │                  │ │
│  │              │   │ └─────────────┘ │   │                  │ │
│  └──────────────┘   └─────────────────┘   └──────────────────┘ │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                        Database                                │
│                                                                │
│                 ┌───────────┐    ┌───────────┐                 │
│                 │ companies │    │   cnaes   │                 │
│                 └───────────┘    └───────────┘                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 7.2 Diagrama de Sequência - Fluxo Principal

```
┌──────┐          ┌────────┐          ┌────────┐        ┌───────────┐      ┌──────────┐
│Cliente│          │Frontend│          │Backend │        │API Externa│      │ Database │
└───┬───┘          └───┬────┘          └───┬────┘        └─────┬─────┘      └────┬─────┘
    │    Insere CNPJ    │                  │                   │                │
    │ ───────────────► │                  │                   │                │
    │                  │                  │                   │                │
    │                  │  Consulta CNPJ   │                   │                │
    │                  │ ───────────────► │                   │                │
    │                  │                  │                   │                │
    │                  │                  │ Verifica no cache │                │
    │                  │                  │ ──────────────────────────────────►│
    │                  │                  │                   │                │
    │                  │                  │ Cache miss/expired│                │
    │                  │                  │ ◄──────────────────────────────────│
    │                  │                  │                   │                │
    │                  │                  │  Consulta CNPJ    │                │
    │                  │                  │ ─────────────────►│                │
    │                  │                  │                   │                │
    │                  │                  │   Retorna dados   │                │
    │                  │                  │ ◄─────────────────│                │
    │                  │                  │                   │                │
    │                  │                  │ Consulta CNAE risk│                │
    │                  │                  │ ──────────────────────────────────►│
    │                  │                  │                   │                │
    │                  │                  │  Retorna risco    │                │
    │                  │                  │ ◄──────────────────────────────────│
    │                  │                  │                   │                │
    │                  │                  │  Calcula score    │                │
    │                  │                  │ ─┐                │                │
    │                  │                  │  │                │                │
    │                  │                  │ ◄┘                │                │
    │                  │                  │                   │                │
    │                  │                  │ Armazena consulta │                │
    │                  │                  │ ──────────────────────────────────►│
    │                  │                  │                   │                │
    │                  │  Retorna análise │                   │                │
    │                  │ ◄───────────────┐│                   │                │
    │                  │                  │                   │                │
    │  Exibe resultado │                  │                   │                │
    │ ◄─────────────── │                  │                   │                │
    │                  │                  │                   │                │
┌───┴───┐          ┌───┴────┐          ┌───┴────┐        ┌─────┴─────┐      ┌────┴─────┐
│Cliente│          │Frontend│          │Backend │        │API Externa│      │ Database │
└──────┘          └────────┘          └────────┘        └───────────┘      └──────────┘
```

### 7.3 Diagrama de Implantação

```
┌─────────────────────────────────┐
│         Client Browser           │
│                                 │
│  ┌─────────────────────────┐    │
│  │     React Application    │    │
│  └─────────────────────────┘    │
└──────────────┬──────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────┐
│         Server Environment       │
│                                 │
│  ┌─────────────────────────┐    │
│  │    Node.js + Express    │    │
│  └──────────────┬──────────┘    │
│                 │               │
│  ┌──────────────▼──────────┐    │
│  │        SQLite           │    │
│  └─────────────────────────┘    │
└──────────────┬──────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────┐
│     External CNPJ API Service    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  https://publica.cnpj.ws │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

## 8. Requisitos Não-Funcionais e Implementação

### 8.1 Escalabilidade
- A arquitetura de camadas permite escalabilidade horizontal
- Uso de cache reduz carga no backend e na API externa
- Banco SQLite pode ser substituído por PostgreSQL/MySQL se necessário escalar

### 8.2 Performance
- Cache em dois níveis (memória e persistente)
- Processamento assíncrono de requisições
- Carregamento otimizado de componentes React

### 8.3 Segurança
- Implementação de rate limiting
- Validação rigorosa de entrada
- Headers HTTP seguros via Helmet
- Proteção contra ataques comuns

### 8.4 Manutenibilidade
- Separação clara de responsabilidades
- Código modular e bem documentado
- Testes automatizados
- Convenções de código padronizadas

### 8.5 Usabilidade
- Interface responsiva para diferentes dispositivos
- Feedback claro sobre operações em andamento
- Mensagens de erro amigáveis
- Design intuitivo com foco na jornada do usuário

## 9. Padrões de Código e Boas Práticas

### 9.1 Convenções de Nomenclatura
- **JavaScript/TypeScript**:
  - camelCase para variáveis, funções e métodos
  - PascalCase para classes e componentes React
  - UPPER_SNAKE_CASE para constantes
- **CSS/Styled Components**:
  - kebab-case para classes CSS tradicionais
  - PascalCase para componentes estilizados

### 9.2 Estrutura de Diretórios

#### Frontend (React)
```
/src
  /components        # Componentes React reutilizáveis
    /common          # Componentes genéricos (botões, inputs, etc)
    /layout          # Componentes de layout (header, footer, etc)
    /forms           # Componentes de formulários
    /dashboard       # Componentes específicos do dashboard
  /hooks             # Custom React hooks
  /services          # Serviços (API, formatação, etc)
  /utils             # Utilitários e helpers
  /contexts          # Context API
  /styles            # Estilos globais
  /assets            # Imagens, fontes, etc
  /pages             # Componentes de página
  /types             # Definições de tipos (TypeScript)
```

#### Backend (Node.js/Express)
```
/src
  /controllers       # Controladores de rota
  /services          # Lógica de negócio
  /repositories      # Acesso a dados
  /models            # Modelos/esquemas de dados
  /middlewares       # Middlewares Express
  /utils             # Utilitários e helpers
  /config            # Configurações
  /types             # Definições de tipos (TypeScript)
  /routes            # Definições de rotas
  /scripts           # Scripts de inicialização, seed, etc
```

### 9.3 Práticas de Teste
- **Frontend**:
  - Testes de componentes com React Testing Library
  - Testes de hooks personalizados
  - Testes de integração para fluxos principais

- **Backend**:
  - Testes unitários para serviços e utilitários
  - Testes de integração para APIs
  - Testes de repositórios com banco de dados em memória

### 9.4 Gestão de Dependências
- Utilizar package.json com versões específicas
- Manter dependências atualizadas
- Minimizar o número de dependências
- Preferir bibliotecas bem mantidas e populares

## 10. Conclusão

A arquitetura aqui proposta para o "Analisador de Risco de Cliente PJ via CNPJ" foi desenhada para atender a todos os requisitos funcionais e não funcionais, com foco na entrega de um produto totalmente funcional. A escolha de tecnologias modernas e amplamente adotadas (React, Node.js, SQLite) permite um desenvolvimento ágil e resulta em uma aplicação de alta qualidade.

A separação clara de responsabilidades entre frontend e backend, a organização em camadas e a aplicação de padrões de código consistentes garantem um sistema manutenível e escalável. As estratégias de cache e tratamento de erros asseguram que o sistema seja robusto mesmo diante de falhas na API externa.

Esta arquitetura permite que a equipe de desenvolvimento inicie o trabalho com uma base sólida, clara e bem documentada.