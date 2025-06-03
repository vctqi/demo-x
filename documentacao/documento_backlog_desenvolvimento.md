# Documento de Backlog de Desenvolvimento - Analisador de Risco de Cliente PJ via CNPJ

## Introdução

Este documento detalha o planejamento de desenvolvimento para o sistema "Analisador de Risco de Cliente PJ via CNPJ", baseado nos requisitos fornecidos pelo Product Manager e na arquitetura técnica definida pelo Solution Architect. Cada User Story foi decomposta em tarefas técnicas, com identificação de dependências, estimativas de esforço e recursos necessários.

## Organização do Backlog

O backlog está organizado por épicos e user stories, seguindo a estrutura definida no documento de requisitos. Para cada user story, foram identificadas as tarefas técnicas necessárias para implementação.

## Épico 1: Consulta de CNPJ

### User Story 1.1: Como usuário, quero inserir um CNPJ para consulta, para que eu possa obter informações sobre uma empresa específica.

#### Tarefa 1.1.1: Criar componente de formulário para entrada de CNPJ
- **Descrição:** Desenvolver o componente React para entrada e validação do CNPJ, incluindo formatação automática e feedback visual.
- **Critérios de Conclusão:**
  1. O campo aceita entrada com ou sem formatação (pontos, traços, barras).
  2. Validação em tempo real do formato e dígito verificador do CNPJ.
  3. Feedback visual sobre a validade do CNPJ inserido.
  4. Botão de envio desabilitado se o CNPJ for inválido.
  5. Testes unitários implementados e passando.
- **Dependências:** Nenhuma
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

#### Tarefa 1.1.2: Implementar endpoint de validação de CNPJ no backend
- **Descrição:** Criar endpoint REST para validação de formato e dígito verificador de CNPJ.
- **Critérios de Conclusão:**
  1. Endpoint `POST /api/cnpj/validate` implementado.
  2. Validação correta do formato e dígito verificador.
  3. Respostas adequadas para CNPJ válido e inválido.
  4. Testes unitários e de integração implementados.
- **Dependências:** Nenhuma
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Júnior)

#### Tarefa 1.1.3: Implementar função de limpeza do formulário
- **Descrição:** Adicionar funcionalidade para limpar o campo de CNPJ e reiniciar o estado do formulário.
- **Critérios de Conclusão:**
  1. Botão "Limpar" funcional no formulário.
  2. Ao clicar, o campo é limpo e quaisquer mensagens de erro são removidas.
  3. O formulário retorna ao estado inicial.
  4. Testes unitários implementados.
- **Dependências:** Tarefa 1.1.1
- **Estimativa:** 1 hora
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Júnior)

### User Story 1.2: Como usuário, quero visualizar os dados cadastrais básicos da empresa consultada, para conhecer suas informações fundamentais.

#### Tarefa 1.2.1: Implementar endpoint de consulta de CNPJ
- **Descrição:** Criar endpoint REST que consulta a API pública de CNPJ e retorna os dados formatados.
- **Critérios de Conclusão:**
  1. Endpoint `GET /api/cnpj/{cnpj}` implementado.
  2. Integração correta com a API pública (https://publica.cnpj.ws/cnpj/).
  3. Tratamento adequado de erros e timeout.
  4. Retorno de dados formatados conforme modelo definido.
  5. Testes de integração implementados.
- **Dependências:** Tarefa 1.1.2
- **Estimativa:** 6 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

#### Tarefa 1.2.2: Implementar serviço de cache para consultas de CNPJ
- **Descrição:** Desenvolver mecanismo de cache para armazenar resultados de consultas recentes e reduzir chamadas à API externa.
- **Critérios de Conclusão:**
  1. Implementação de cache em memória usando node-cache.
  2. Persistência de dados consultados no SQLite.
  3. Política de expiração de 24 horas para dados em cache.
  4. Testes unitários para verificar funcionamento do cache.
- **Dependências:** Tarefa 1.2.1
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

#### Tarefa 1.2.3: Criar componente de exibição de dados cadastrais
- **Descrição:** Desenvolver componente React para exibir informações cadastrais da empresa consultada.
- **Critérios de Conclusão:**
  1. Exibição clara e organizada de todos os dados cadastrais retornados pela API.
  2. Formatação adequada de datas, códigos e valores.
  3. Cálculo e exibição do tempo de operação da empresa.
  4. Indicação visual clara quando algum dado não estiver disponível.
  5. Layout responsivo que se adapta a diferentes tamanhos de tela.
  6. Testes unitários implementados.
- **Dependências:** Tarefa 1.2.1
- **Estimativa:** 5 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

## Épico 2: Análise de Risco

### User Story 2.1: Como usuário, quero que o sistema calcule automaticamente um score de risco para a empresa consultada, para que eu tenha uma avaliação objetiva.

#### Tarefa 2.1.1: Criar tabela de CNAEs com classificação de risco
- **Descrição:** Implementar tabela no banco de dados e script de seed para classificação de CNAEs por nível de risco.
- **Critérios de Conclusão:**
  1. Criação da tabela `cnaes` conforme modelo de dados definido.
  2. Script de seed com classificação inicial dos CNAEs mais comuns.
  3. Documentação dos critérios utilizados para classificação.
  4. Testes de acesso aos dados da tabela.
- **Dependências:** Nenhuma
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

#### Tarefa 2.1.2: Implementar serviço de cálculo de score de risco
- **Descrição:** Desenvolver lógica de negócio para calcular o score de risco com base nos critérios definidos.
- **Critérios de Conclusão:**
  1. Implementação do `RiskAnalysisService` com método de cálculo de score.
  2. Aplicação correta de todos os critérios definidos no documento de requisitos.
  3. Classificação final em três níveis (baixo, médio, alto risco).
  4. Testes unitários para cada critério e combinações de critérios.
- **Dependências:** Tarefa 2.1.1
- **Estimativa:** 5 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Sênior)

#### Tarefa 2.1.3: Integrar cálculo de score ao endpoint de consulta
- **Descrição:** Integrar o serviço de cálculo de score ao endpoint de consulta de CNPJ.
- **Critérios de Conclusão:**
  1. Endpoint `/api/cnpj/{cnpj}` retorna dados cadastrais e score calculado.
  2. Informações sobre critérios aplicados são incluídas na resposta.
  3. Testes de integração atualizados para verificar a resposta completa.
- **Dependências:** Tarefas 1.2.1 e 2.1.2
- **Estimativa:** 2 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

### User Story 2.2: Como usuário, quero ver os fatores que influenciaram positivamente e negativamente o score, para entender como a classificação foi determinada.

#### Tarefa 2.2.1: Implementar detalhamento de critérios do score
- **Descrição:** Expandir o serviço de cálculo de score para retornar detalhes sobre cada critério aplicado.
- **Critérios de Conclusão:**
  1. Para cada critério aplicado, retornar descrição, pontuação e impacto (positivo/negativo).
  2. Separar os critérios por categoria (cadastral, temporal, atividade).
  3. Incluir pontuação total e classificação final.
  4. Testes unitários para verificar o detalhamento correto.
- **Dependências:** Tarefa 2.1.2
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

#### Tarefa 2.2.2: Criar componente de exibição dos critérios de score
- **Descrição:** Desenvolver componente React para exibir detalhes dos critérios que afetaram o score.
- **Critérios de Conclusão:**
  1. Exibição organizada de todos os critérios aplicados.
  2. Separação visual entre critérios positivos e negativos.
  3. Exibição da pontuação para cada critério e total.
  4. Opção para expandir/recolher a seção.
  5. Layout responsivo.
  6. Testes unitários implementados.
- **Dependências:** Tarefas 2.2.1 e 1.2.3
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

## Épico 3: Visualização de Resultados

### User Story 3.1: Como usuário, quero visualizar um badge colorido indicando o nível de risco, para identificar rapidamente a classificação.

#### Tarefa 3.1.1: Criar componente visual de badge de risco
- **Descrição:** Desenvolver componente React para exibir badge colorido indicando o nível de risco.
- **Critérios de Conclusão:**
  1. Badge com cores distintas para cada nível de risco (verde, amarelo, vermelho).
  2. Texto claro indicando a classificação (Baixo, Médio, Alto Risco).
  3. Tamanho adequado para destaque na interface.
  4. Adaptação para diferentes tamanhos de tela.
  5. Testes unitários implementados.
- **Dependências:** Tarefa 2.1.3
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

### User Story 3.2: Como usuário, quero um dashboard organizado com todas as informações relevantes, para ter uma visão completa da análise.

#### Tarefa 3.2.1: Desenvolver layout do dashboard principal
- **Descrição:** Criar estrutura principal do dashboard integrando todos os componentes visuais.
- **Critérios de Conclusão:**
  1. Layout com seções bem definidas para formulário, dados cadastrais e análise de risco.
  2. Organização lógica das informações com hierarquia visual adequada.
  3. Design responsivo para diferentes dispositivos.
  4. Estados de carregamento e erro implementados.
  5. Testes unitários e de integração dos componentes.
- **Dependências:** Tarefas 1.1.1, 1.2.3, 2.2.2 e 3.1.1
- **Estimativa:** 6 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Sênior)

#### Tarefa 3.2.2: Implementar navegação e estados da aplicação
- **Descrição:** Desenvolver gerenciamento de estado e navegação entre as diferentes visualizações da aplicação.
- **Critérios de Conclusão:**
  1. Gerenciamento de estado da aplicação implementado (contexto ou Redux).
  2. Transição suave entre estado inicial, carregamento e resultado.
  3. Persistência temporária de resultados durante a sessão.
  4. Navegação intuitiva entre diferentes consultas.
  5. Testes de navegação e gerenciamento de estado.
- **Dependências:** Tarefa 3.2.1
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Sênior)

## Épico 4: Gerenciamento de Erros e Exceções

### User Story 4.1: Como usuário, quero receber notificações claras quando ocorrerem erros na consulta, para saber como proceder.

#### Tarefa 4.1.1: Implementar tratamento de erros no backend
- **Descrição:** Desenvolver middleware para tratamento padronizado de erros na API.
- **Critérios de Conclusão:**
  1. Middleware de tratamento de erros implementado.
  2. Categorização de erros (validação, recursos não encontrados, erro do servidor, etc.).
  3. Respostas HTTP adequadas para cada tipo de erro.
  4. Mensagens de erro claras e orientadas ao usuário.
  5. Registro de erros (logging).
  6. Testes para verificar o correto tratamento de diferentes cenários de erro.
- **Dependências:** Tarefas 1.1.2 e 1.2.1
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

#### Tarefa 4.1.2: Criar componente de exibição de erros
- **Descrição:** Desenvolver componente React para exibir mensagens de erro de forma amigável.
- **Critérios de Conclusão:**
  1. Exibição clara de mensagens de erro.
  2. Estilo visual adequado para alertar sem alarmar.
  3. Sugestões de ação para resolver o problema quando aplicável.
  4. Diferentes visuais para diferentes tipos de erro.
  5. Testes unitários implementados.
- **Dependências:** Nenhuma
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Júnior)

### User Story 4.2: Como usuário, quero poder tentar novamente após um erro, sem precisar reinserir todos os dados.

#### Tarefa 4.2.1: Implementar funcionalidade de retry
- **Descrição:** Adicionar botão e lógica para tentar novamente após um erro.
- **Critérios de Conclusão:**
  1. Botão "Tentar Novamente" exibido quando ocorre um erro.
  2. Preservação dos dados inseridos anteriormente.
  3. Limpeza de resultados parciais ou incorretos.
  4. Feedback visual durante nova tentativa.
  5. Testes unitários e de integração.
- **Dependências:** Tarefas 4.1.2 e 3.2.2
- **Estimativa:** 2 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

## Infraestrutura e Configuração

### Tarefa I.1: Configuração inicial do projeto frontend
- **Descrição:** Criar e configurar o projeto React com as dependências necessárias.
- **Critérios de Conclusão:**
  1. Projeto criado com Create React App ou configuração manual equivalente.
  2. Dependências instaladas (axios, styled-components, react-toastify, etc.).
  3. Configuração de ESLint e Prettier.
  4. Estrutura de diretórios conforme definido na arquitetura.
  5. Configuração de testes com Jest e React Testing Library.
- **Dependências:** Nenhuma
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Frontend (Pleno)

### Tarefa I.2: Configuração inicial do projeto backend
- **Descrição:** Criar e configurar o projeto Node.js/Express com as dependências necessárias.
- **Critérios de Conclusão:**
  1. Projeto Node.js inicializado com estrutura de diretórios adequada.
  2. Dependências instaladas (express, axios, sequelize, sqlite3, etc.).
  3. Configuração de ESLint e Prettier.
  4. Configuração inicial do Express com middlewares básicos.
  5. Configuração de testes com Jest.
- **Dependências:** Nenhuma
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

### Tarefa I.3: Configuração do banco de dados
- **Descrição:** Configurar SQLite e criar scripts de inicialização do banco.
- **Critérios de Conclusão:**
  1. Configuração do Sequelize com SQLite.
  2. Scripts de criação de tabelas conforme modelo de dados.
  3. Script de migração para inicialização do banco.
  4. Seed de dados iniciais para a tabela de CNAEs.
  5. Testes de conexão e operações básicas.
- **Dependências:** Tarefa I.2
- **Estimativa:** 3 horas
- **Recursos Necessários:** 1 Desenvolvedor Backend (Pleno)

### Tarefa I.4: Criação de scripts de build e execução
- **Descrição:** Desenvolver scripts para build, execução e parada da aplicação.
- **Critérios de Conclusão:**
  1. Script `start.sh` que verifica requisitos, instala dependências e inicia a aplicação.
  2. Script `stop.sh` que encerra corretamente a aplicação.
  3. Configuração de ambiente de desenvolvimento e produção.
  4. README com instruções detalhadas.
- **Dependências:** Tarefas I.1, I.2 e I.3
- **Estimativa:** 2 horas
- **Recursos Necessários:** 1 Desenvolvedor DevOps ou Full Stack

## Integração e Finalização

### Tarefa F.1: Integração frontend-backend
- **Descrição:** Integrar o frontend com o backend e testar o fluxo completo.
- **Critérios de Conclusão:**
  1. Configuração de proxy para desenvolvimento.
  2. Testes de integração para todos os fluxos principais.
  3. Ajustes finais na comunicação entre camadas.
  4. Documentação das APIs utilizadas.
- **Dependências:** Todas as tarefas de frontend e backend
- **Estimativa:** 4 horas
- **Recursos Necessários:** 1 Desenvolvedor Full Stack (Sênior)

### Tarefa F.2: Testes finais e ajustes
- **Descrição:** Realizar testes completos do sistema e fazer ajustes finais.
- **Critérios de Conclusão:**
  1. Testes de todos os fluxos principais e alternativos.
  2. Verificação de responsividade em diferentes dispositivos.
  3. Ajustes de performance se necessário.
  4. Correção de quaisquer bugs identificados.
- **Dependências:** Tarefa F.1
- **Estimativa:** 6 horas
- **Recursos Necessários:** 1 Desenvolvedor Full Stack (Sênior) e 1 QA

## Estimativa Total e Recursos

### Resumo de Horas por Épico
- **Épico 1 (Consulta de CNPJ)**: 23 horas
- **Épico 2 (Análise de Risco)**: 18 horas
- **Épico 3 (Visualização de Resultados)**: 13 horas
- **Épico 4 (Gerenciamento de Erros)**: 9 horas
- **Infraestrutura e Configuração**: 11 horas
- **Integração e Finalização**: 10 horas

**Total**: 84 horas de desenvolvimento

### Recursos Necessários
- 1 Desenvolvedor Frontend Sênior (13 horas)
- 1 Desenvolvedor Frontend Pleno (24 horas)
- 1 Desenvolvedor Frontend Júnior (4 horas)
- 1 Desenvolvedor Backend Sênior (5 horas)
- 1 Desenvolvedor Backend Pleno (27 horas)
- 1 Desenvolvedor Backend Júnior (3 horas)
- 1 Desenvolvedor Full Stack Sênior (10 horas)
- 1 QA (incluído nas 6 horas da Tarefa F.2)

## Planejamento de Sprints

Com base nas estimativas e dependências, sugere-se o seguinte planejamento de sprints:

### Sprint 1 (Infraestrutura e Consulta Básica) - 35 horas
- Tarefas I.1, I.2, I.3 (Configuração inicial)
- Tarefas 1.1.1, 1.1.2, 1.1.3 (Formulário de entrada)
- Tarefas 1.2.1, 1.2.2, 1.2.3 (Consulta e exibição de dados)
- Tarefa 2.1.1 (Tabela de CNAEs)
- Tarefa 4.1.2 (Componente de exibição de erros)

### Sprint 2 (Análise de Risco e Dashboard) - 35 horas
- Tarefas 2.1.2, 2.1.3, 2.2.1, 2.2.2 (Cálculo e exibição de score)
- Tarefas 3.1.1, 3.2.1, 3.2.2 (Badge e dashboard)
- Tarefas 4.1.1, 4.2.1 (Tratamento de erros e retry)

### Sprint 3 (Integração e Finalização) - 14 horas
- Tarefa I.4 (Scripts de build e execução)
- Tarefas F.1, F.2 (Integração e testes finais)

## Riscos e Mitigações

### Risco 1: Indisponibilidade ou limitações da API externa de CNPJ
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**: Implementar cache robusto, mock para testes e desenvolvimento, e tratamento gracioso de falhas.

### Risco 2: Complexidade na interpretação de CNAEs para classificação de risco
- **Probabilidade**: Alta
- **Impacto**: Médio
- **Mitigação**: Iniciar com uma classificação simplificada dos CNAEs mais comuns e prever mecanismo para atualização contínua.

### Risco 3: Usabilidade inadequada para o público-alvo
- **Probabilidade**: Média
- **Impacto**: Médio
- **Mitigação**: Priorizar feedback visual claro e testes com usuários desde o início do desenvolvimento.

## Considerações Finais

Este backlog de desenvolvimento foi elaborado com base nos requisitos e na arquitetura técnica definidos previamente. As tarefas foram organizadas para maximizar a eficiência do desenvolvimento, priorizando a entrega de valor e minimizando dependências bloqueantes.

A implementação seguirá uma abordagem incremental, começando pela infraestrutura básica e as funcionalidades essenciais de consulta, seguida pelas funcionalidades de análise de risco e visualização, e finalizando com integração e testes completos.

Recomenda-se revisões regulares do progresso e ajustes no backlog conforme necessário durante o desenvolvimento.