# Documento de Arquitetura - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento descreve a arquitetura técnica do sistema **"Analisador de Risco de Cliente PJ via CNPJ"**, detalhando as tecnologias escolhidas, os componentes do sistema, suas interações, o modelo de dados, estratégias de integração, logging e monitoramento.

A arquitetura foi projetada para atender todos os requisitos funcionais e não funcionais especificados no documento de requisitos, com foco em criar uma solução totalmente funcional, eficiente, escalável e de fácil manutenção.

## 2. Escolha de Tecnologias

### 2.1. Frontend
- **Linguagem**: JavaScript
- **Framework**: React.js (v18+)
  - Escolhido por sua eficiência, componentização e facilidade de criação de interfaces interativas
- **Bibliotecas Principais**:
  - **Axios**: Para requisições HTTP
  - **React-Bootstrap**: Para componentes visuais responsivos
  - **Chart.js**: Para visualização gráfica do score de risco
  - **React-Toastify**: Para notificações ao usuário

### 2.2. Backend
- **Linguagem**: JavaScript
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
  - Escolhido por sua simplicidade, desempenho e ampla adoção
- **Bibliotecas Principais**:
  - **Axios**: Para consumo da API externa de CNPJ
  - **Winston**: Para logging estruturado
  - **Joi**: Para validação de dados
  - **Moment.js**: Para manipulação de datas
  - **Cors**: Para habilitar CORS
  - **Helmet**: Para melhorar a segurança da aplicação

### 2.3. Banco de Dados
- **SQLite** (v3+)
  - Escolhido por sua simplicidade de configuração e não necessitar de servidor separado
  - Adequado para o escopo do projeto, que não exige alta concorrência
- **ORM**: Sequelize
  - Para abstrair operações de banco de dados e facilitar a manutenção

### 2.4. Ferramentas e Serviços Complementares
- **ESLint**: Para garantir qualidade de código
- **Jest**: Para testes unitários
- **Supertest**: Para testes de API
- **Nodemon**: Para desenvolvimento com reload automático
- **Concurrently**: Para executar frontend e backend simultaneamente durante desenvolvimento

## 3. Arquitetura do Sistema

### 3.1. Visão Geral

A arquitetura segue o padrão cliente-servidor com separação clara entre frontend e backend, organizados em camadas lógicas para facilitar manutenção e escalabilidade.

### 3.2. Componentes Principais

#### Frontend
- **Componentes de UI**: Interface gráfica com a qual o usuário interage
- **Serviços**: Módulos para comunicação com o backend
- **Estados**: Gerenciamento de estado da aplicação
- **Utilitários**: Funções auxiliares reutilizáveis

#### Backend
- **Controladores**: Recebem requisições, coordenam processamento e devolvem respostas
- **Serviços**: Encapsulam lógica de negócio
- **Adaptadores**: Abstraem a comunicação com APIs externas
- **Repositórios**: Gerenciam acesso e persistência de dados
- **Modelos**: Definem estrutura dos dados
- **Middleware**: Interceptam requisições para logging, validação, etc.
- **Configuração**: Gerencia variáveis de ambiente e configurações

### 3.3. Padrões de Design

- **MVC (Model-View-Controller)**: Separação clara entre modelo de dados, lógica de negócio e interface
- **Repository Pattern**: Abstração da camada de persistência
- **Adapter Pattern**: Para encapsular a comunicação com a API externa
- **Service Layer**: Encapsulamento da lógica de negócio
- **Dependency Injection**: Para facilitar testes e desacoplamento

### 3.4. Fluxo de Dados

```
┌─────────────┐     ┌─────────────────────────────────────────────────────┐     ┌──────────────┐
│             │     │                                                     │     │              │
│   Frontend  │     │                     Backend                         │     │  API CNPJ    │
│             │     │                                                     │     │              │
└──────┬──────┘     └──────────────────────────┬──────────────────────────┘     └──────┬───────┘
       │                                        │                                       │
       │ 1. Requisição (CNPJ)                   │                                       │
       │ ─────────────────────────────────────► │                                       │
       │                                        │                                       │
       │                                        │ 2. Verifica cache (SQLite)            │
       │                                        │ ◄───────────────────────────────────► │
       │                                        │                                       │
       │                                        │ 3. Se não estiver em cache, consulta  │
       │                                        │ ─────────────────────────────────────►│
       │                                        │                                       │
       │                                        │ 4. Resposta com dados da empresa      │
       │                                        │ ◄─────────────────────────────────────│
       │                                        │                                       │
       │                                        │ 5. Processa dados e calcula risco     │
       │                                        │ ◄───────────────────────────────────► │
       │                                        │                                       │
       │                                        │ 6. Armazena resultado                 │
       │                                        │ ◄───────────────────────────────────► │
       │                                        │                                       │
       │ 7. Resposta (Dashboard com análise)    │                                       │
       │ ◄─────────────────────────────────────┘                                       │
       │                                                                                │
```

## 4. Modelo de Dados

### 4.1. Entidades Principais

#### Consulta
- **Atributos**:
  - `id`: Identificador único (PK)
  - `cnpj`: CNPJ consultado
  - `data_consulta`: Data e hora da consulta
  - `dados_empresa`: JSON com dados brutos da API
  - `score`: Pontuação calculada
  - `classificacao_risco`: Classificação (Baixo, Médio, Alto)
  - `criterios_aplicados`: JSON com critérios aplicados e pontuações

### 4.2. Modelo Relacional

```
┌───────────────────────────────┐
│           CONSULTA            │
├───────────────────────────────┤
│ id: INTEGER (PK)              │
│ cnpj: TEXT                    │
│ data_consulta: DATETIME       │
│ dados_empresa: TEXT (JSON)    │
│ score: INTEGER                │
│ classificacao_risco: TEXT     │
│ criterios_aplicados: TEXT (JSON)│
└───────────────────────────────┘
```

### 4.3. Estratégia de Cache

- As consultas são armazenadas no banco de dados SQLite
- Ao receber uma requisição, o sistema verifica se o CNPJ foi consultado nas últimas 24 horas
- Se sim, retorna os dados armazenados, evitando nova chamada à API
- O usuário é informado que os dados são de uma consulta anterior

## 5. Integração com API de CNPJ

### 5.1. Detalhes da API

- **URL Base**: `https://publica.cnpj.ws/cnpj/`
- **Método**: GET
- **Endpoint**: `{cnpj}` (onde {cnpj} é o número do CNPJ sem formatação)
- **Autenticação**: Não necessária (API pública)
- **Formato de Resposta**: JSON

### 5.2. Exemplo de Requisição

```bash
curl -X GET "https://publica.cnpj.ws/cnpj/00000000000191"
```

### 5.3. Exemplo de Resposta

```json
{
  "cnpj": "00.000.000/0001-91",
  "razao_social": "BANCO DO BRASIL SA",
  "nome_fantasia": null,
  "inicio_atividade": "1966-03-02",
  "natureza_juridica": {
    "codigo": "2038",
    "descricao": "Sociedade de Economia Mista"
  },
  "capital_social": 67000000000,
  "porte": {
    "codigo": "5",
    "descricao": "Demais"
  },
  "simples_nacional": null,
  "situacao_cadastral": {
    "codigo": "2",
    "data": "2005-11-03",
    "motivo": null,
    "descricao": "Ativa"
  },
  "atividade_principal": {
    "codigo": "6422-1/00",
    "descricao": "Bancos múltiplos, com carteira comercial"
  },
  "atividades_secundarias": [
    {
      "codigo": "6424-7/01",
      "descricao": "Bancos cooperativos"
    },
    // ... outras atividades
  ],
  "endereco": {
    "cep": "70073-901",
    "logradouro": "SAUN QUADRA 5 LOTE B TORRES I, II E III",
    "numero": "s/n",
    "complemento": "ANDAR 1 A 16 SALA 101 A 1601",
    "bairro": "ASA NORTE",
    "municipio": {
      "codigo": "5300108",
      "descricao": "BRASILIA"
    },
    "uf": "DF",
    "pais": {
      "codigo": "1058",
      "descricao": "BRASIL"
    }
  }
}
```

### 5.4. Tratamento de Erros

O sistema deve tratar os seguintes cenários de erro:

- **CNPJ não encontrado**: Quando a API retorna 404
- **API indisponível**: Quando ocorre timeout ou erro de conexão
- **Erro na API**: Quando a API retorna código 5xx
- **Formato de resposta inválido**: Quando a resposta não está no formato esperado

Em cada caso, o usuário deve receber uma mensagem clara e orientações sobre como proceder.

### 5.5. Estratégia para Indisponibilidade

- Implementar retry com backoff exponencial (até 3 tentativas)
- Informar ao usuário sobre falha na consulta externa
- Sugerir tentar novamente mais tarde

## 6. Logging e Monitoramento

### 6.1. Estratégia de Logging

#### O que deve ser logado:
- **Inicialização e parada da aplicação**:
  - Data/hora
  - Versão da aplicação
  - Ambiente (dev, teste, produção)
- **Requisições à aplicação**:
  - Data/hora
  - Endpoint acessado
  - Método HTTP
  - IP do cliente
  - Tempo de resposta
- **Consultas à API de CNPJ**:
  - Data/hora
  - CNPJ consultado
  - Status da resposta
  - Tempo de resposta
- **Cálculo de score**:
  - CNPJ
  - Critérios aplicados
  - Pontuações atribuídas
  - Score final
- **Erros e exceções**:
  - Data/hora
  - Tipo de erro
  - Mensagem
  - Stack trace (em ambiente de desenvolvimento)
  - Contexto da operação

#### Níveis de Log:
- **ERROR**: Falhas críticas (erro na API, erro no banco de dados, etc.)
- **WARN**: Situações anormais mas não críticas (CNPJ inválido, tentativa de acesso a recurso inexistente)
- **INFO**: Eventos normais importantes (início/fim da aplicação, consultas realizadas)
- **DEBUG**: Informações detalhadas para depuração (apenas em ambiente de desenvolvimento)

#### Destino dos Logs:
- **Console**: Para desenvolvimento e debug
- **Arquivo**: `logs/application.log` para ambiente de produção

#### Formato dos Logs:
```
YYYY-MM-DD HH:MM:SS [NÍVEL] - Mensagem
```

Exemplo:
```
2025-06-05 14:30:15 [INFO] - Iniciando consulta de CNPJ: 00.000.000/0001-91
2025-06-05 14:30:16 [INFO] - API respondeu com status 200 em 850ms
2025-06-05 14:30:16 [INFO] - Score calculado: 30 (Baixo Risco)
```

### 6.2. Métricas para Monitoramento

- **Performance**:
  - Tempo médio de resposta da aplicação
  - Tempo médio de resposta da API externa
  - Número de consultas por minuto/hora/dia
- **Erros**:
  - Taxa de erros da aplicação
  - Taxa de erros da API externa
  - Tipos de erros mais comuns
- **Utilização**:
  - Número de consultas únicas vs. retornos de cache
  - Distribuição das classificações de risco
  - CNPJs mais consultados

## 7. Diagramas

### 7.1. Diagrama de Arquitetura (C4 Model - Contexto)

```
┌───────────────────────┐      ┌──────────────────────┐      ┌────────────────────┐
│                       │      │                      │      │                    │
│                       │      │  Analisador de       │      │                    │
│      Usuário          │─────►│  Risco de Cliente    │─────►│  API Pública CNPJ  │
│                       │      │  PJ via CNPJ         │      │                    │
│                       │      │                      │      │                    │
└───────────────────────┘      └──────────────────────┘      └────────────────────┘
                                          │
                                          │
                                          ▼
                                ┌──────────────────────┐
                                │                      │
                                │  Banco de Dados      │
                                │  SQLite              │
                                │                      │
                                └──────────────────────┘
```

### 7.2. Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     Frontend                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐   │
│  │                 │     │                 │     │                         │   │
│  │  Componente de  │     │  Componente de  │     │  Componente de          │   │
│  │  Formulário     │     │  Dashboard      │     │  Histórico              │   │
│  │                 │     │                 │     │                         │   │
│  └────────┬────────┘     └────────┬────────┘     └─────────────┬───────────┘   │
│           │                       │                            │               │
│           │                       │                            │               │
│  ┌────────▼────────────────────────────────────────────────────▼───────────┐   │
│  │                                                                         │   │
│  │                          Serviços API                                   │   │
│  │                                                                         │   │
│  └─────────────────────────────────┬───────────────────────────────────────┘   │
│                                    │                                           │
└────────────────────────────────────┼───────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     Backend                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐   │
│  │                 │     │                 │     │                         │   │
│  │  Controladores  │     │  Middleware     │     │  Validadores            │   │
│  │                 │     │                 │     │                         │   │
│  └────────┬────────┘     └────────┬────────┘     └─────────────┬───────────┘   │
│           │                       │                            │               │
│           │                       │                            │               │
│  ┌────────▼────────────────────────────────────────────────────▼───────────┐   │
│  │                                                                         │   │
│  │                          Serviços de Negócio                            │   │
│  │                                                                         │   │
│  └─────────────────────────────────┬───────────────────────────────────────┘   │
│                                    │                                           │
│                                    │                                           │
│  ┌────────────────────┐    ┌───────▼──────────┐    ┌─────────────────────┐    │
│  │                    │    │                  │    │                     │    │
│  │  API Adapter       │    │  Repositórios    │    │  Logger             │    │
│  │                    │    │                  │    │                     │    │
│  └─────────┬──────────┘    └──────┬───────────┘    └─────────────────────┘    │
│            │                      │                                            │
└────────────┼──────────────────────┼────────────────────────────────────────────┘
             │                      │
             ▼                      ▼
┌─────────────────────┐    ┌────────────────────┐
│                     │    │                    │
│  API Pública CNPJ   │    │  SQLite Database   │
│                     │    │                    │
└─────────────────────┘    └────────────────────┘
```

### 7.3. Diagrama de Sequência (Fluxo Principal)

```
┌─────────┐          ┌───────────┐          ┌────────────┐          ┌──────────┐          ┌─────────────┐
│         │          │           │          │            │          │          │          │             │
│ Usuário │          │ Frontend  │          │ Backend    │          │ Database │          │ API CNPJ    │
│         │          │           │          │            │          │          │          │             │
└────┬────┘          └─────┬─────┘          └──────┬─────┘          └────┬─────┘          └──────┬──────┘
     │                     │                       │                     │                       │
     │  Insere CNPJ        │                       │                     │                       │
     │ ──────────────────► │                       │                     │                       │
     │                     │                       │                     │                       │
     │                     │  Envia CNPJ           │                     │                       │
     │                     │ ─────────────────────►│                     │                       │
     │                     │                       │                     │                       │
     │                     │                       │  Verifica Cache     │                       │
     │                     │                       │ ────────────────────►                       │
     │                     │                       │                     │                       │
     │                     │                       │  Resposta Cache     │                       │
     │                     │                       │ ◄────────────────────                       │
     │                     │                       │                     │                       │
     │                     │                       │  Se não em cache,   │                       │
     │                     │                       │  consulta API       │                       │
     │                     │                       │ ──────────────────────────────────────────► │
     │                     │                       │                     │                       │
     │                     │                       │  Dados da Empresa   │                       │
     │                     │                       │ ◄─────────────────────────────────────────── │
     │                     │                       │                     │                       │
     │                     │                       │  Calcula Score      │                       │
     │                     │                       │ ─────┐              │                       │
     │                     │                       │      │              │                       │
     │                     │                       │ ◄────┘              │                       │
     │                     │                       │                     │                       │
     │                     │                       │  Salva Resultado    │                       │
     │                     │                       │ ────────────────────►                       │
     │                     │                       │                     │                       │
     │                     │  Envia Dashboard      │                     │                       │
     │                     │ ◄─────────────────────│                     │                       │
     │                     │                       │                     │                       │
     │  Visualiza          │                       │                     │                       │
     │  Resultado          │                       │                     │                       │
     │ ◄────────────────── │                       │                     │                       │
     │                     │                       │                     │                       │
```

## 8. Considerações de Segurança

- **Validação de Entrada**: Todas as entradas do usuário devem ser validadas no frontend e backend
- **Proteção contra Injeção**: Uso de parâmetros preparados para consultas SQL
- **Prevenção XSS**: Escape apropriado de saídas e uso do React (que previne XSS por padrão)
- **Headers de Segurança**: Uso da biblioteca Helmet para configurar headers HTTP de segurança
- **Rate Limiting**: Implementação de limite de requisições por IP para prevenir abuso
- **Tratamento de Erros**: Mensagens de erro genéricas para o usuário, detalhes apenas nos logs

## 9. Considerações de Implantação

- **Ambiente**: A aplicação pode ser implantada em qualquer servidor que suporte Node.js
- **Build**: O frontend React deve ser compilado para produção (`npm run build`)
- **Inicialização**: Scripts de inicialização e parada serão fornecidos
- **Variáveis de Ambiente**: Configurações sensíveis devem ser armazenadas em variáveis de ambiente
- **Banco de Dados**: O SQLite será criado automaticamente na primeira execução

## 10. Conclusão

A arquitetura proposta para o "Analisador de Risco de Cliente PJ via CNPJ" é simples, robusta e adequada aos requisitos do sistema. Utilizando tecnologias modernas e padrões de design consolidados, a solução oferece uma base sólida para o desenvolvimento e evolução do sistema.

Esta arquitetura garante uma aplicação totalmente funcional, com boa performance, facilidade de manutenção e possibilidade de extensão futura para adicionar novos critérios de análise de risco ou integrações com outras fontes de dados.