# Backlog de Desenvolvimento - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento detalha o planejamento técnico para o desenvolvimento do sistema "Analisador de Risco de Cliente PJ via CNPJ". Ele foi elaborado com base no Documento de Requisitos do Product Manager e no Documento de Arquitetura Técnica do Solution Architect.

O objetivo é decompor as User Stories em tarefas técnicas gerenciáveis, identificar dependências entre elas e estimar o esforço necessário para implementação.

## 2. Estrutura do Projeto

Conforme definido no documento de arquitetura, o projeto seguirá a seguinte estrutura:

```
analisador-risco-cnpj/
├── frontend/          # Aplicação React
├── backend/           # Servidor Node.js/Express
├── logs/              # Arquivos de log
├── README.md          # Documentação principal
├── start.sh           # Script para iniciar a aplicação
└── stop.sh            # Script para parar a aplicação
```

## 3. Backlog de Tarefas

As tarefas estão organizadas por fase e prioridade. Cada tarefa inclui:
- ID único
- Descrição
- User Story relacionada
- Dependências
- Estimativa de esforço
- Tipo de recurso necessário
- Critérios de aceitação técnica

### Fase 1: Setup Inicial e Configuração

#### Tarefa #1.1: Configuração do Ambiente Backend
- **Descrição**: Configurar o projeto Node.js/Express com as dependências necessárias
- **User Story**: N/A (Setup técnico)
- **Dependências**: Nenhuma
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Backend (Júnior/Pleno)
- **Critérios de Aceitação**:
  - Projeto Node.js inicializado com package.json
  - Dependências instaladas: Express, Axios, Winston, Joi, CORS, dotenv, Sequelize, SQLite3
  - Estrutura de diretórios criada conforme a arquitetura
  - ESLint e Prettier configurados
  - Scripts npm configurados (start, dev, test)

#### Tarefa #1.2: Configuração do Ambiente Frontend
- **Descrição**: Configurar o projeto React com as dependências necessárias
- **User Story**: N/A (Setup técnico)
- **Dependências**: Nenhuma
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Frontend (Júnior/Pleno)
- **Critérios de Aceitação**:
  - Projeto React inicializado (usando Create React App ou Vite)
  - Dependências instaladas: React Router, Axios, Material-UI, React Query
  - Estrutura de diretórios criada conforme a arquitetura
  - ESLint e Prettier configurados
  - Scripts npm configurados (start, build, test)

#### Tarefa #1.3: Configuração do Banco de Dados
- **Descrição**: Configurar o SQLite e os modelos Sequelize
- **User Story**: N/A (Setup técnico)
- **Dependências**: #1.1
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Backend (Pleno)
- **Critérios de Aceitação**:
  - Banco SQLite inicializado
  - Modelos Sequelize criados para `Company`, `RiskAnalysis` e `CNAECategories`
  - Migração inicial criada e testada
  - Script de seed para dados iniciais de CNAEs
  - Conexão do banco testada com sucesso

#### Tarefa #1.4: Configuração do Sistema de Logging
- **Descrição**: Implementar o sistema de logging conforme definido na arquitetura
- **User Story**: N/A (Requisito técnico)
- **Dependências**: #1.1
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Backend (Júnior/Pleno)
- **Critérios de Aceitação**:
  - Módulo de logging implementado usando Winston
  - Logs configurados para console e arquivo
  - Níveis de log configurados (ERROR, WARN, INFO, DEBUG)
  - Formato dos logs seguindo o padrão especificado
  - Diretório de logs criado e com permissões adequadas

### Fase 2: Desenvolvimento do Backend

#### Tarefa #2.1: Implementação do Adapter da API de CNPJ
- **Descrição**: Criar o módulo adapter para integração com a API pública de CNPJ
- **User Story**: 1.2 (Consulta de Dados Cadastrais)
- **Dependências**: #1.1, #1.4
- **Estimativa**: 4 horas
- **Recurso**: Desenvolvedor Backend (Pleno)
- **Critérios de Aceitação**:
  - Módulo adapter implementado com métodos para consulta de CNPJ
  - Tratamento adequado de respostas, erros e timeouts
  - Transformação dos dados da API para o formato interno
  - Logs implementados para rastrear chamadas e respostas
  - Testes unitários implementados com mock de respostas
  - Validação manual com chamadas reais à API

#### Tarefa #2.2: Implementação da Validação de CNPJ
- **Descrição**: Criar o módulo de validação de CNPJ
- **User Story**: 1.1 (Entrada e Validação de CNPJ)
- **Dependências**: #1.1
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Backend (Júnior)
- **Critérios de Aceitação**:
  - Função de validação de formato de CNPJ implementada
  - Função de validação de dígitos verificadores implementada
  - Testes unitários cobrindo casos válidos e inválidos
  - Logs de validação implementados

#### Tarefa #2.3: Implementação do Serviço de Análise de Risco
- **Descrição**: Criar o serviço que implementa a lógica de cálculo de score e análise de risco
- **User Story**: 2.1 (Cálculo do Score de Risco)
- **Dependências**: #1.3
- **Estimativa**: 4 horas
- **Recurso**: Desenvolvedor Backend (Pleno)
- **Critérios de Aceitação**:
  - Serviço implementado com método para calcular score de risco
  - Implementação de todas as regras de negócio definidas
  - Categorização correta dos CNAEs de alto e baixo risco
  - Lógica para identificação de fatores que impactaram o score
  - Testes unitários cobrindo diferentes cenários
  - Logs detalhando o cálculo do score

#### Tarefa #2.4: Implementação dos Controllers e Rotas
- **Descrição**: Criar os controllers e rotas do backend
- **User Story**: Todas
- **Dependências**: #2.1, #2.2, #2.3
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Backend (Pleno)
- **Critérios de Aceitação**:
  - Controller para consulta de CNPJ implementado
  - Rota `/api/cnpj/:cnpj` implementada
  - Middleware de validação de entrada configurado
  - Tratamento adequado de erros e respostas
  - Logs de requisições e respostas implementados
  - Testes de integração das rotas

#### Tarefa #2.5: Implementação da Persistência de Dados
- **Descrição**: Implementar a lógica de salvamento e consulta dos dados no banco
- **User Story**: Todas
- **Dependências**: #1.3, #2.3, #2.4
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Backend (Pleno)
- **Critérios de Aceitação**:
  - Métodos de persistência implementados para dados da empresa
  - Métodos de persistência implementados para análises de risco
  - Consultas otimizadas para evitar duplicidade
  - Testes unitários dos métodos de persistência
  - Logs de operações de banco de dados

### Fase 3: Desenvolvimento do Frontend

#### Tarefa #3.1: Implementação dos Componentes Base do Frontend
- **Descrição**: Criar os componentes estruturais da aplicação
- **User Story**: 3.1 (Interface Responsiva e Intuitiva)
- **Dependências**: #1.2
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Componente App implementado
  - Componente Header implementado
  - Layout responsivo configurado
  - Tema Material-UI personalizado
  - Rotas básicas configuradas

#### Tarefa #3.2: Implementação do Formulário de Input de CNPJ
- **Descrição**: Criar o formulário para entrada e validação de CNPJ
- **User Story**: 1.1 (Entrada e Validação de CNPJ)
- **Dependências**: #3.1
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Componente de formulário implementado
  - Validação de formato de CNPJ no frontend
  - Feedback visual para CNPJ inválido
  - Campo aceita entrada com ou sem formatação
  - Botão de submissão desabilitado até validação
  - Formatação automática do CNPJ durante digitação
  - Testes de unidade do componente

#### Tarefa #3.3: Implementação dos Serviços de API no Frontend
- **Descrição**: Criar os serviços que se comunicam com o backend
- **User Story**: Todas
- **Dependências**: #2.4, #3.1
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Serviço de API implementado com Axios
  - Métodos para consulta de CNPJ
  - Tratamento adequado de erros e timeouts
  - Interceptors configurados para tratamento global
  - Testes unitários dos serviços

#### Tarefa #3.4: Implementação da Exibição de Dados da Empresa
- **Descrição**: Criar os componentes para exibição dos dados cadastrais
- **User Story**: 1.2 (Consulta de Dados Cadastrais)
- **Dependências**: #3.3
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Componente CompanyDetails implementado
  - Exibição adequada de todos os dados cadastrais
  - Tratamento visual para dados ausentes
  - Layout responsivo para diferentes tamanhos de tela
  - Testes de unidade do componente

#### Tarefa #3.5: Implementação da Exibição da Análise de Risco
- **Descrição**: Criar os componentes para exibição da análise de risco
- **User Story**: 2.2 (Classificação e Exibição do Risco)
- **Dependências**: #3.3
- **Estimativa**: 4 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Componente RiskAnalysis implementado
  - Badge visual colorido para indicação de risco
  - Lista de fatores que impactaram o score
  - Alertas específicos para situações críticas
  - Layout responsivo e visualmente intuitivo
  - Testes de unidade do componente

#### Tarefa #3.6: Implementação do Fluxo de Múltiplas Consultas
- **Descrição**: Implementar a funcionalidade de realizar múltiplas consultas
- **User Story**: 3.2 (Múltiplas Consultas)
- **Dependências**: #3.2, #3.4, #3.5
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor Frontend (Pleno)
- **Critérios de Aceitação**:
  - Botão para nova consulta implementado
  - Limpeza adequada de resultados anteriores
  - Foco automático no campo de CNPJ para nova consulta
  - Testes do fluxo completo de múltiplas consultas

### Fase 4: Integração e Testes

#### Tarefa #4.1: Integração Frontend-Backend
- **Descrição**: Integrar e testar a comunicação entre frontend e backend
- **User Story**: Todas
- **Dependências**: #2.5, #3.6
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Fullstack (Pleno)
- **Critérios de Aceitação**:
  - Configuração de CORS adequada
  - Testes end-to-end do fluxo completo
  - Tratamento adequado de erros de comunicação
  - Logs de integração implementados

#### Tarefa #4.2: Testes de Integração com API Externa
- **Descrição**: Realizar testes abrangentes da integração com a API de CNPJ
- **User Story**: 1.2 (Consulta de Dados Cadastrais)
- **Dependências**: #2.1, #4.1
- **Estimativa**: 3 horas
- **Recurso**: Desenvolvedor Backend (Pleno) ou QA
- **Critérios de Aceitação**:
  - Testes com diversos CNPJs reais
  - Testes de cenários de erro e timeout
  - Documentação dos resultados de teste
  - Ajustes no código se necessário

#### Tarefa #4.3: Testes de Aceitação
- **Descrição**: Realizar testes de aceitação baseados nas user stories
- **User Story**: Todas
- **Dependências**: #4.1
- **Estimativa**: 4 horas
- **Recurso**: QA ou Product Manager
- **Critérios de Aceitação**:
  - Todos os critérios de aceitação das user stories verificados
  - Documentação dos resultados de teste
  - Lista de eventuais bugs encontrados

### Fase 5: Finalização

#### Tarefa #5.1: Criação dos Scripts de Automação
- **Descrição**: Criar os scripts start.sh e stop.sh
- **User Story**: N/A (Requisito técnico)
- **Dependências**: #4.1
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor DevOps ou Backend (Pleno)
- **Critérios de Aceitação**:
  - Script start.sh funcional que:
    - Verifica dependências necessárias
    - Instala o que estiver faltando
    - Inicia a aplicação corretamente
  - Script stop.sh funcional que:
    - Para a aplicação de forma segura
  - Testes de execução em ambiente limpo

#### Tarefa #5.2: Documentação Final
- **Descrição**: Criar o README.md com instruções detalhadas
- **User Story**: N/A (Documentação)
- **Dependências**: #5.1
- **Estimativa**: 2 horas
- **Recurso**: Desenvolvedor (Qualquer nível) ou Technical Writer
- **Critérios de Aceitação**:
  - README.md criado com:
    - Visão geral do sistema
    - Instruções detalhadas de configuração
    - Lista de dependências
    - Processo de build
    - Instruções de execução
    - Troubleshooting básico
  - Documentação clara e completa para o time de QA

#### Tarefa #5.3: Revisão Final e Ajustes
- **Descrição**: Revisar o código, corrigir bugs e realizar ajustes finais
- **User Story**: Todas
- **Dependências**: #4.3, #5.2
- **Estimativa**: 4 horas
- **Recurso**: Desenvolvedor Sênior ou Team Lead
- **Critérios de Aceitação**:
  - Revisão completa do código
  - Correção de bugs identificados
  - Ajustes de performance se necessário
  - Aplicação funcionando conforme esperado

## 4. Resumo de Estimativas

| Fase | Descrição | Estimativa Total |
|------|-----------|------------------|
| 1    | Setup Inicial e Configuração | 9 horas |
| 2    | Desenvolvimento do Backend | 16 horas |
| 3    | Desenvolvimento do Frontend | 17 horas |
| 4    | Integração e Testes | 10 horas |
| 5    | Finalização | 8 horas |
| **Total** | | **60 horas** |

## 5. Cronograma Sugerido

Considerando uma equipe com:
- 1 Desenvolvedor Backend Pleno
- 1 Desenvolvedor Frontend Pleno
- 1 QA

O desenvolvimento pode ser concluído em aproximadamente:
- 2 semanas (10 dias úteis) em dedicação parcial (4h/dia)
- 1 semana (5 dias úteis) em dedicação total (8h/dia)

## 6. Riscos e Mitigações

### 6.1 Riscos Técnicos

#### Limitações da API de CNPJ
- **Risco**: A API pública pode ter limitações de requisições ou inconsistências nos dados.
- **Mitigação**: 
  - Implementar cache local para reduzir número de chamadas
  - Criar fallbacks para cenários de indisponibilidade
  - Testar com diversos CNPJs para identificar padrões de resposta

#### Complexidade do Cálculo de Risco
- **Risco**: Regras de negócio para cálculo de risco podem ser mais complexas na prática.
- **Mitigação**:
  - Validar a implementação com o PO durante o desenvolvimento
  - Criar testes unitários abrangentes para diferentes cenários
  - Documentar claramente a lógica implementada

### 6.2 Riscos de Projeto

#### Escopo Crescente
- **Risco**: Solicitações de funcionalidades adicionais durante o desenvolvimento.
- **Mitigação**:
  - Manter o foco no MVP definido no documento de requisitos
  - Documentar solicitações adicionais para futuras iterações
  - Comunicar claramente o impacto de alterações de escopo

#### Dependência de Recursos
- **Risco**: Indisponibilidade de desenvolvedores com experiência específica.
- **Mitigação**:
  - Priorizar tarefas críticas no início do projeto
  - Documentar bem cada componente para facilitar transições
  - Criar pareamentos para compartilhar conhecimento

## 7. Conclusão

Este backlog de desenvolvimento fornece um plano detalhado para a implementação do sistema "Analisador de Risco de Cliente PJ via CNPJ". As tarefas foram organizadas em fases lógicas, com dependências claras e estimativas realistas.

A implementação seguirá a arquitetura definida pelo Solution Architect e atenderá a todos os requisitos especificados pelo Product Manager, resultando em uma aplicação totalmente funcional que permitirá aos usuários analisar o risco associado a empresas através da consulta de seus CNPJs.