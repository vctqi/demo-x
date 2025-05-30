# Backlog de Desenvolvimento - Analisador de Risco de Cliente PJ via CNPJ

## Visão Geral do Planejamento

Este documento descreve o backlog de desenvolvimento para o sistema "Analisador de Risco de Cliente PJ via CNPJ", decompondo as user stories em tarefas técnicas específicas e menores. As tarefas estão organizadas por componentes do sistema, com dependências identificadas e estimativas iniciais de esforço. Este plano servirá como guia para a implementação do sistema pelos desenvolvedores.

## Priorização e Estimativas

Para priorização, utilizamos a seguinte escala:
- **Alta**: Essencial para o MVP (Minimum Viable Product)
- **Média**: Importante, mas pode ser implementada após funcionalidades essenciais
- **Baixa**: Desejável, mas não crítica para o lançamento inicial

Para estimativas, utilizamos a seguinte escala em Story Points (SP):
- **1 SP**: Tarefa muito pequena (algumas horas)
- **2 SP**: Tarefa pequena (meio dia)
- **3 SP**: Tarefa média (um dia)
- **5 SP**: Tarefa grande (alguns dias)
- **8 SP**: Tarefa muito grande (deve ser decomposta, se possível)

## Definição de Pronto (Definition of Done)

Uma tarefa é considerada concluída quando:
1. O código foi implementado seguindo os padrões definidos
2. Testes unitários foram escritos e estão passando
3. O código foi revisado por outro desenvolvedor
4. A funcionalidade foi testada manualmente
5. A documentação foi atualizada, se necessário

## Backlog de Tarefas

### 1. Configuração Inicial do Projeto

#### 1.1 Configuração do Ambiente de Frontend (T001)
- **Descrição**: Configurar o projeto React com Vite, instalar dependências básicas e configurar linters.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: Nenhuma
- **Prioridade**: Alta
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Projeto React criado com Vite
  - Material-UI instalado e configurado
  - ESLint e Prettier configurados
  - Estrutura de diretórios básica criada
  - Configuração de rotas básicas

#### 1.2 Configuração do Ambiente de Backend (T002)
- **Descrição**: Configurar o projeto Node.js com Express, instalar dependências básicas e configurar ambiente.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: Nenhuma
- **Prioridade**: Alta
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Projeto Node.js/Express criado
  - Middlewares básicos configurados (CORS, bodyParser, etc.)
  - ESLint configurado
  - Estrutura de diretórios básica criada
  - Ambiente de desenvolvimento configurado

#### 1.3 Configuração do Banco de Dados SQLite (T003)
- **Descrição**: Configurar o banco de dados SQLite e criar as tabelas iniciais.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: T002
- **Prioridade**: Alta
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - SQLite instalado e configurado
  - Prisma ou Sequelize configurado como ORM
  - Scripts de criação de tabelas implementados
  - Migrações configuradas
  - Seed de dados para ambiente de desenvolvimento (opcional)

### 2. Funcionalidade de Consulta de CNPJ

#### 2.1 Criação do Componente de Formulário de CNPJ (T004)
- **Descrição**: Implementar o componente de formulário para inserção e validação do CNPJ.
- **User Story Relacionada**: US01 - Consulta Básica de CNPJ
- **Dependências**: T001
- **Prioridade**: Alta
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Campo de entrada para CNPJ implementado
  - Validação de formato de CNPJ (frontend)
  - Feedback visual para erros de validação
  - Botão de consulta implementado
  - Indicador de loading durante a consulta

#### 2.2 Implementação do Endpoint de Validação de CNPJ (T005)
- **Descrição**: Criar endpoint REST para validação do formato do CNPJ.
- **User Story Relacionada**: US01 - Consulta Básica de CNPJ
- **Dependências**: T002
- **Prioridade**: Alta
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Endpoint GET/POST para validação de CNPJ
  - Validação de formato e dígitos verificadores
  - Retorno de erro formatado para CNPJs inválidos
  - Testes unitários implementados

#### 2.3 Implementação do Cliente para API CNPJ.ws (T006)
- **Descrição**: Desenvolver o módulo de cliente HTTP para comunicação com a API externa CNPJ.ws.
- **User Story Relacionada**: US01, US02 - Consulta Básica de CNPJ e Visualização de Dados Cadastrais
- **Dependências**: T002
- **Prioridade**: Alta
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Cliente HTTP configurado para API CNPJ.ws
  - Tratamento de erros e timeouts
  - Retry mechanism implementado
  - Parsing da resposta da API
  - Testes unitários (com mocks para API externa)

#### 2.4 Implementação do Endpoint de Consulta de CNPJ (T007)
- **Descrição**: Criar endpoint REST para consulta de CNPJ, integrando com o cliente da API externa.
- **User Story Relacionada**: US01, US02 - Consulta Básica de CNPJ e Visualização de Dados Cadastrais
- **Dependências**: T003, T005, T006
- **Prioridade**: Alta
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Endpoint GET para consulta de CNPJ
  - Integração com o cliente da API externa
  - Armazenamento da consulta no banco de dados
  - Implementação de cache para consultas recentes
  - Testes de integração

### 3. Funcionalidade de Análise de Risco

#### 3.1 Implementação do Serviço de Cálculo de Score (T008)
- **Descrição**: Desenvolver o serviço que implementa a lógica de cálculo do score de risco baseado nos critérios definidos.
- **User Story Relacionada**: US03 - Análise de Risco
- **Dependências**: Nenhuma
- **Prioridade**: Alta
- **Estimativa**: 5 SP
- **Critérios de Aceitação**:
  - Implementação de todos os critérios de pontuação
  - Cálculo correto do score final
  - Classificação em categorias de risco (Baixo, Médio, Alto)
  - Identificação de sinais de alerta
  - Testes unitários abrangentes

#### 3.2 Integração do Serviço de Score com o Endpoint de Consulta (T009)
- **Descrição**: Integrar o serviço de cálculo de score com o endpoint de consulta de CNPJ.
- **User Story Relacionada**: US03 - Análise de Risco
- **Dependências**: T007, T008
- **Prioridade**: Alta
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Cálculo de score chamado após consulta bem-sucedida
  - Armazenamento do resultado da análise no banco de dados
  - Retorno dos dados de consulta junto com a análise
  - Testes de integração

#### 3.3 Implementação do Componente de Visualização de Risco (T010)
- **Descrição**: Desenvolver o componente de frontend para exibição da análise de risco.
- **User Story Relacionada**: US03 - Análise de Risco
- **Dependências**: T004, T009
- **Prioridade**: Alta
- **Estimativa**: 5 SP
- **Critérios de Aceitação**:
  - Exibição do score de risco
  - Badge colorido para classificação (verde, amarelo, vermelho)
  - Lista de sinais de alerta
  - Layout responsivo
  - Testes de componente

### 4. Visualização de Dados Cadastrais

#### 4.1 Implementação do Componente de Dados Cadastrais (T011)
- **Descrição**: Desenvolver o componente de frontend para exibição dos dados cadastrais da empresa.
- **User Story Relacionada**: US02 - Visualização de Dados Cadastrais
- **Dependências**: T004, T007
- **Prioridade**: Alta
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Exibição de todos os dados cadastrais requeridos
  - Formatação adequada dos dados (datas, CNAE, etc.)
  - Tratamento para dados não disponíveis
  - Layout responsivo
  - Testes de componente

### 5. Detalhamento dos Critérios de Risco

#### 5.1 Implementação do Endpoint de Detalhamento de Critérios (T012)
- **Descrição**: Criar endpoint REST para fornecer detalhes sobre os critérios utilizados no cálculo do score.
- **User Story Relacionada**: US04 - Detalhamento dos Critérios de Risco
- **Dependências**: T009
- **Prioridade**: Média
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Endpoint GET para detalhamento de critérios
  - Retorno da lista completa de critérios avaliados
  - Detalhes da pontuação para cada critério
  - Testes unitários

#### 5.2 Implementação do Componente de Detalhamento de Critérios (T013)
- **Descrição**: Desenvolver o componente de frontend para exibição detalhada dos critérios de risco.
- **User Story Relacionada**: US04 - Detalhamento dos Critérios de Risco
- **Dependências**: T010, T012
- **Prioridade**: Média
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Exibição de todos os critérios avaliados
  - Detalhes da pontuação para cada critério
  - Funcionalidade de expandir/colapsar
  - Formatação visual que diferencia critérios positivos e negativos
  - Testes de componente

### 6. Histórico de Consultas

#### 6.1 Implementação da Gestão de Histórico no Frontend (T014)
- **Descrição**: Implementar a lógica de armazenamento e gestão do histórico de consultas no frontend.
- **User Story Relacionada**: US05 - Histórico de Consultas
- **Dependências**: T010, T011
- **Prioridade**: Média
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Armazenamento das últimas 10 consultas na sessão
  - Persistência durante a sessão do usuário
  - Gerenciamento do state com Context API
  - Testes unitários

#### 6.2 Implementação do Componente de Histórico (T015)
- **Descrição**: Desenvolver o componente de frontend para exibição do histórico de consultas.
- **User Story Relacionada**: US05 - Histórico de Consultas
- **Dependências**: T014
- **Prioridade**: Média
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Lista das últimas consultas
  - Exibição de CNPJ, razão social e classificação de risco
  - Indicador visual de risco para cada item
  - Funcionalidade de clique para rever detalhes
  - Layout responsivo
  - Testes de componente

### 7. Exportação de Resultados

#### 7.1 Implementação do Serviço de Geração de PDF (T016)
- **Descrição**: Desenvolver o serviço de backend para geração de relatórios em PDF.
- **User Story Relacionada**: US06 - Exportação de Resultados
- **Dependências**: T009
- **Prioridade**: Baixa
- **Estimativa**: 5 SP
- **Critérios de Aceitação**:
  - Geração de PDF contendo dados cadastrais e análise de risco
  - Formatação profissional do documento
  - Inclusão de todos os detalhes relevantes
  - Nomenclatura adequada do arquivo
  - Testes unitários

#### 7.2 Implementação do Endpoint de Exportação para PDF (T017)
- **Descrição**: Criar endpoint REST para exportação dos resultados em formato PDF.
- **User Story Relacionada**: US06 - Exportação de Resultados
- **Dependências**: T016
- **Prioridade**: Baixa
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Endpoint GET para exportação em PDF
  - Integração com o serviço de geração de PDF
  - Headers HTTP adequados para download do arquivo
  - Testes de integração

#### 7.3 Implementação do Componente de Exportação (T018)
- **Descrição**: Desenvolver o componente de frontend para exportação dos resultados.
- **User Story Relacionada**: US06 - Exportação de Resultados
- **Dependências**: T017
- **Prioridade**: Baixa
- **Estimativa**: 2 SP
- **Critérios de Aceitação**:
  - Botão de "Exportar para PDF" na tela de resultados
  - Feedback visual durante o processo de exportação
  - Tratamento de erros de exportação
  - Testes de componente

### 8. Testes e Finalização

#### 8.1 Testes de Integração Abrangentes (T019)
- **Descrição**: Implementar testes de integração abrangentes para validar o sistema como um todo.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: Todas as tarefas de implementação
- **Prioridade**: Alta
- **Estimativa**: 5 SP
- **Critérios de Aceitação**:
  - Testes end-to-end para os fluxos principais
  - Testes de integração entre frontend e backend
  - Testes de cenários de erro e edge cases
  - Cobertura de testes de pelo menos 80%

#### 8.2 Revisão e Otimização de Performance (T020)
- **Descrição**: Revisar a aplicação e otimizar gargalos de performance.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: Todas as tarefas de implementação
- **Prioridade**: Média
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - Análise de performance do frontend e backend
  - Otimização de consultas ao banco de dados
  - Minimização de chamadas à API externa
  - Otimização de assets do frontend

#### 8.3 Documentação Técnica e README (T021)
- **Descrição**: Criar documentação técnica detalhada e README para o projeto.
- **User Story Relacionada**: N/A (Tarefa Técnica)
- **Dependências**: Todas as tarefas de implementação
- **Prioridade**: Média
- **Estimativa**: 3 SP
- **Critérios de Aceitação**:
  - README com instruções de instalação e execução
  - Documentação de APIs (Swagger/OpenAPI)
  - Documentação de arquitetura e componentes
  - Instruções para contribuição e desenvolvimento

## Diagrama de Dependências

```
                +------+
                | T001 |
                +------+
                   |
                   v
+------+        +------+        +------+
| T005 |<-------| T004 |------->| T011 |
+------+        +------+        +------+
   |               |               |
   |               v               |
   |            +------+           |
   |            | T010 |<----------+
   |            +------+
   |               |
   v               v
+------+        +------+        +------+
| T007 |<-------| T013 |<-------| T012 |
+------+        +------+        +------+
   |               |
   v               v
+------+        +------+        +------+
| T009 |------->| T014 |------->| T015 |
+------+        +------+        +------+
   |
   v
+------+        +------+        +------+
| T016 |------->| T017 |------->| T018 |
+------+        +------+        +------+
                   |
                   v
                +------+
                | T019 |
                +------+
                   |
                   v
                +------+        +------+
                | T020 |------->| T021 |
                +------+        +------+
```

## Sequência Sugerida de Implementação

Para uma implementação eficiente, sugerimos a seguinte sequência de desenvolvimento:

### Sprint 1: Configuração e Estrutura Básica
1. T001 - Configuração do Ambiente de Frontend
2. T002 - Configuração do Ambiente de Backend
3. T003 - Configuração do Banco de Dados SQLite
4. T004 - Criação do Componente de Formulário de CNPJ
5. T005 - Implementação do Endpoint de Validação de CNPJ

### Sprint 2: Consulta de CNPJ e Análise Básica
1. T006 - Implementação do Cliente para API CNPJ.ws
2. T007 - Implementação do Endpoint de Consulta de CNPJ
3. T008 - Implementação do Serviço de Cálculo de Score
4. T009 - Integração do Serviço de Score com o Endpoint de Consulta
5. T011 - Implementação do Componente de Dados Cadastrais

### Sprint 3: Visualização e Detalhamento
1. T010 - Implementação do Componente de Visualização de Risco
2. T012 - Implementação do Endpoint de Detalhamento de Critérios
3. T013 - Implementação do Componente de Detalhamento de Critérios
4. T014 - Implementação da Gestão de Histórico no Frontend
5. T015 - Implementação do Componente de Histórico

### Sprint 4: Finalização e Polimento
1. T016 - Implementação do Serviço de Geração de PDF
2. T017 - Implementação do Endpoint de Exportação para PDF
3. T018 - Implementação do Componente de Exportação
4. T019 - Testes de Integração Abrangentes
5. T020 - Revisão e Otimização de Performance
6. T021 - Documentação Técnica e README

## Marcos (Milestones) do Desenvolvimento

1. **M1: Estrutura Básica** - Ambiente configurado e formulário de consulta funcional
   - Tarefas: T001, T002, T003, T004, T005
   - Critério: Usuário pode inserir CNPJ e sistema valida o formato

2. **M2: Consulta Funcional** - Consulta de CNPJ funcional com exibição de dados básicos
   - Tarefas: T006, T007, T011
   - Critério: Sistema consulta CNPJ e exibe dados cadastrais

3. **M3: Análise de Risco** - Cálculo e visualização de score de risco implementados
   - Tarefas: T008, T009, T010, T012, T013
   - Critério: Sistema calcula e exibe análise de risco com detalhamento

4. **M4: Funcionalidades Complementares** - Histórico e exportação implementados
   - Tarefas: T014, T015, T016, T017, T018
   - Critério: Sistema mantém histórico e permite exportação para PDF

5. **M5: Sistema Completo** - Sistema completamente testado e documentado
   - Tarefas: T019, T020, T021
   - Critério: Todos os testes passando e documentação completa

## Riscos Identificados e Estratégias de Mitigação

### R1: Indisponibilidade ou Limitações da API CNPJ.ws
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**: 
  - Implementar cache agressivo para reduzir dependência
  - Criar mock de dados para desenvolvimento e testes
  - Implementar circuit breaker para evitar chamadas repetidas em caso de falha
  - Considerar alternativas de API como fallback

### R2: Performance do Cálculo de Score para Múltiplas Consultas
- **Probabilidade**: Baixa
- **Impacto**: Médio
- **Mitigação**:
  - Otimizar algoritmo de cálculo
  - Implementar cache de resultados
  - Considerar processamento assíncrono para múltiplas consultas

### R3: Complexidade da UI para Exibição de Detalhes do Score
- **Probabilidade**: Média
- **Impacto**: Médio
- **Mitigação**:
  - Iniciar com protótipos de baixa fidelidade para validar abordagem
  - Realizar testes de usabilidade com usuários
  - Considerar divisão em componentes menores para gerenciar complexidade

### R4: Geração de PDF em Diferentes Navegadores
- **Probabilidade**: Alta
- **Impacto**: Baixo
- **Mitigação**:
  - Gerar PDF no backend para evitar incompatibilidades
  - Testar em múltiplos navegadores
  - Considerar biblioteca bem estabelecida para geração de PDF

## Considerações Finais

Este backlog representa o plano inicial para o desenvolvimento do "Analisador de Risco de Cliente PJ via CNPJ". As tarefas, estimativas e prioridades podem ser ajustadas conforme o desenvolvimento avança e novos insights são obtidos. A abordagem incremental proposta permite entregas de valor desde as primeiras sprints, com funcionalidades básicas sendo implementadas primeiro e refinamentos sendo adicionados nas sprints subsequentes.

Para o sucesso do projeto, é essencial manter comunicação constante entre os membros da equipe, revisar regularmente o progresso e ajustar o backlog conforme necessário. A implementação deve seguir os padrões definidos no documento de arquitetura e todos os desenvolvedores devem estar familiarizados com os requisitos detalhados no documento de requisitos.