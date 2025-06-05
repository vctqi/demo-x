# Documento de Backlog de Desenvolvimento - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento apresenta o planejamento detalhado para o desenvolvimento do sistema "Analisador de Risco de Cliente PJ via CNPJ". Baseado no Documento de Requisitos do Product Owner e no Documento de Arquitetura do Solution Architect, este backlog decompõe as user stories em tarefas técnicas gerenciáveis, identifica dependências, estima esforço e organiza o trabalho em uma sequência lógica de implementação.

## 2. Visão Geral do Desenvolvimento

O desenvolvimento do sistema será organizado em 5 fases principais, alinhadas com os épicos identificados no documento de requisitos:

1. **Configuração do Ambiente e Estrutura Base**
2. **Consulta de CNPJ e Integração com API**
3. **Análise de Risco e Cálculo de Score**
4. **Interface do Usuário e Dashboard**
5. **Armazenamento e Gerenciamento de Cache**

Cada fase inclui tarefas técnicas específicas que, juntas, implementam as user stories relacionadas.

## 3. Decomposição de User Stories em Tarefas Técnicas

### 3.1. Fase 1: Configuração do Ambiente e Estrutura Base

#### Grupo de Tarefas 1.1: Configuração do Projeto
- **Tarefa 1.1.1**: Criar estrutura do projeto frontend (React)
  - Inicializar projeto React usando Create React App
  - Configurar ESLint e Prettier
  - Instalar dependências (React Bootstrap, Axios, Chart.js, React-Toastify)
  - Configurar estrutura de diretórios (components, services, utils)
  - **Estimativa**: 2h, 1 desenvolvedor frontend sênior

- **Tarefa 1.1.2**: Criar estrutura do projeto backend (Node.js/Express)
  - Inicializar projeto Node.js
  - Configurar Express.js
  - Instalar dependências (Axios, Winston, Joi, Moment.js, Cors, Helmet)
  - Configurar estrutura de diretórios (controllers, services, models, middlewares)
  - **Estimativa**: 2h, 1 desenvolvedor backend sênior

- **Tarefa 1.1.3**: Configurar banco de dados SQLite e ORM
  - Instalar SQLite e Sequelize
  - Configurar conexão com o banco de dados
  - Criar script de inicialização do banco
  - **Estimativa**: 2h, 1 desenvolvedor backend pleno

- **Tarefa 1.1.4**: Configurar ambiente de desenvolvimento integrado
  - Configurar scripts para executar frontend e backend simultaneamente
  - Configurar variáveis de ambiente
  - Configurar proxy para desenvolvimento
  - **Estimativa**: 1h, 1 desenvolvedor pleno fullstack

#### Grupo de Tarefas 1.2: Configuração de Logging e Monitoramento
- **Tarefa 1.2.1**: Implementar sistema de logging no backend
  - Configurar Winston para logging estruturado
  - Implementar middleware de logging para requisições HTTP
  - Configurar diferentes níveis de log (INFO, ERROR, DEBUG)
  - Configurar rotação de logs para ambiente de produção
  - **Estimativa**: 3h, 1 desenvolvedor backend pleno

### 3.2. Fase 2: Consulta de CNPJ e Integração com API

#### Grupo de Tarefas 2.1: Integração com API de CNPJ
- **Tarefa 2.1.1**: Criar serviço de adapter para API de CNPJ
  - Implementar módulo para consumo da API pública
  - Validar e testar chamadas à API
  - Implementar tratamento de erros (timeout, API indisponível, CNPJ não encontrado)
  - Implementar mecanismo de retry com backoff exponencial
  - **Estimativa**: 4h, 1 desenvolvedor backend pleno

- **Tarefa 2.1.2**: Implementar validação de CNPJ
  - Criar função para validar formato de CNPJ
  - Implementar validação de dígitos verificadores
  - **Estimativa**: 2h, 1 desenvolvedor backend júnior

#### Grupo de Tarefas 2.2: API de Backend para Consulta
- **Tarefa 2.2.1**: Implementar endpoint para consulta de CNPJ
  - Criar rota `/api/consulta/:cnpj`
  - Implementar validação de entrada
  - Integrar com serviço de adapter da API
  - Documentar a API
  - **Estimativa**: 3h, 1 desenvolvedor backend pleno

### 3.3. Fase 3: Análise de Risco e Cálculo de Score

#### Grupo de Tarefas 3.1: Implementação da Lógica de Análise
- **Tarefa 3.1.1**: Implementar serviço de análise de risco
  - Desenvolver lógica para cálculo de score baseado nos critérios definidos
  - Implementar classificação de risco (Baixo, Médio, Alto)
  - Implementar identificação de sinais de alerta
  - **Estimativa**: 4h, 1 desenvolvedor backend sênior

- **Tarefa 3.1.2**: Implementar mapeamento de CNAE por risco
  - Criar banco de dados de CNAEs classificados por nível de risco
  - Implementar lógica para identificar CNAEs de risco
  - **Estimativa**: 3h, 1 desenvolvedor backend pleno

#### Grupo de Tarefas 3.2: Integração da Análise com a API
- **Tarefa 3.2.1**: Expandir endpoint de consulta para incluir análise
  - Modificar a rota para processar dados e calcular risco
  - Estruturar resposta com dados da empresa e análise
  - **Estimativa**: 2h, 1 desenvolvedor backend pleno

### 3.4. Fase 4: Interface do Usuário e Dashboard

#### Grupo de Tarefas 4.1: Formulário de Consulta
- **Tarefa 4.1.1**: Criar componente de formulário de entrada
  - Implementar campo para entrada de CNPJ com máscara
  - Implementar validação client-side
  - Implementar botão de submissão e limpar
  - **Estimativa**: 3h, 1 desenvolvedor frontend pleno

#### Grupo de Tarefas 4.2: Dashboard de Resultados
- **Tarefa 4.2.1**: Criar componente para exibição de dados cadastrais
  - Implementar layout responsivo para exibir dados da empresa
  - Implementar tratamento para dados ausentes
  - **Estimativa**: 3h, 1 desenvolvedor frontend pleno

- **Tarefa 4.2.2**: Criar componente para exibição de análise de risco
  - Implementar badges visuais para classificação de risco
  - Implementar exibição de sinais de alerta
  - Implementar exibição dos critérios que impactaram o score
  - **Estimativa**: 4h, 1 desenvolvedor frontend sênior

- **Tarefa 4.2.3**: Implementar notificações ao usuário
  - Configurar React-Toastify
  - Implementar mensagens para diferentes cenários (sucesso, erro, dados em cache)
  - **Estimativa**: 2h, 1 desenvolvedor frontend júnior

#### Grupo de Tarefas 4.3: Serviços Frontend
- **Tarefa 4.3.1**: Implementar serviço de comunicação com o backend
  - Criar serviço para enviar CNPJ e receber resultados
  - Implementar tratamento de erros
  - **Estimativa**: 2h, 1 desenvolvedor frontend pleno

### 3.5. Fase 5: Armazenamento e Gerenciamento de Cache

#### Grupo de Tarefas 5.1: Modelo de Dados e Persistência
- **Tarefa 5.1.1**: Implementar modelo de dados para consultas
  - Criar modelo Sequelize para a entidade Consulta
  - Implementar métodos de acesso (CRUD)
  - **Estimativa**: 2h, 1 desenvolvedor backend pleno

- **Tarefa 5.1.2**: Implementar repositório para persistência de consultas
  - Criar serviço para salvar resultados de consultas
  - Implementar métodos para recuperar consultas anteriores
  - **Estimativa**: 2h, 1 desenvolvedor backend pleno

#### Grupo de Tarefas 5.2: Mecanismo de Cache
- **Tarefa 5.2.1**: Implementar lógica de cache de consultas
  - Modificar endpoint de consulta para verificar cache antes de chamar API
  - Implementar lógica para identificar consultas em menos de 24h
  - Incluir informação de uso de cache na resposta
  - **Estimativa**: 3h, 1 desenvolvedor backend sênior

### 3.6. Fase 6: Testes e Documentação

#### Grupo de Tarefas 6.1: Testes
- **Tarefa 6.1.1**: Implementar testes unitários para o backend
  - Criar testes para validadores, serviços e controladores
  - Configurar ambiente de teste
  - **Estimativa**: 4h, 1 desenvolvedor backend sênior

- **Tarefa 6.1.2**: Implementar testes unitários para o frontend
  - Criar testes para componentes principais
  - Testar fluxos de usuário
  - **Estimativa**: 4h, 1 desenvolvedor frontend sênior

#### Grupo de Tarefas 6.2: Documentação e Scripts
- **Tarefa 6.2.1**: Criar documentação de uso
  - Documentar API backend
  - Criar README detalhado
  - **Estimativa**: 2h, 1 desenvolvedor pleno

- **Tarefa 6.2.2**: Criar scripts de inicialização e parada
  - Implementar script start.sh
  - Implementar script stop.sh
  - Testar scripts em diferentes ambientes
  - **Estimativa**: 2h, 1 desenvolvedor pleno

## 4. Dependências entre Tarefas

```
Tarefa 1.1.1 → Tarefa 4.1.1 → Tarefa 4.2.1 → Tarefa 4.2.2 → Tarefa 4.2.3 → Tarefa 4.3.1
    ↓
Tarefa 1.1.2 → Tarefa 1.2.1 → Tarefa 2.1.1 → Tarefa 2.1.2 → Tarefa 2.2.1 → Tarefa 3.1.1 → Tarefa 3.1.2 → Tarefa 3.2.1
    ↓                                                             ↓
Tarefa 1.1.3 → Tarefa 1.1.4                                    Tarefa 5.1.1 → Tarefa 5.1.2 → Tarefa 5.2.1
                                                                    ↓
                                                                Tarefa 6.1.1 → Tarefa 6.1.2 → Tarefa 6.2.1 → Tarefa 6.2.2
```

## 5. Estimativa de Recursos e Tempo

### 5.1. Resumo de Estimativas por Fase

| Fase | Descrição | Horas Estimadas | Perfil dos Recursos |
|------|-----------|-----------------|---------------------|
| 1    | Configuração do Ambiente | 10h | 1 Dev Frontend Sênior, 1 Dev Backend Sênior, 1 Dev Backend Pleno, 1 Dev Fullstack Pleno |
| 2    | Consulta de CNPJ e API | 9h | 1 Dev Backend Pleno, 1 Dev Backend Júnior |
| 3    | Análise de Risco | 9h | 1 Dev Backend Sênior, 1 Dev Backend Pleno |
| 4    | Interface do Usuário | 14h | 1 Dev Frontend Sênior, 1 Dev Frontend Pleno, 1 Dev Frontend Júnior |
| 5    | Armazenamento e Cache | 7h | 1 Dev Backend Sênior, 1 Dev Backend Pleno |
| 6    | Testes e Documentação | 12h | 1 Dev Frontend Sênior, 1 Dev Backend Sênior, 1 Dev Pleno |
| **Total** | | **61h** | |

### 5.2. Distribuição de Recursos

| Perfil | Horas Totais | Tarefas |
|--------|-------------|---------|
| Desenvolvedor Frontend Sênior | 11h | 1.1.1, 4.2.2, 6.1.2 |
| Desenvolvedor Frontend Pleno | 8h | 4.1.1, 4.2.1, 4.3.1 |
| Desenvolvedor Frontend Júnior | 2h | 4.2.3 |
| Desenvolvedor Backend Sênior | 13h | 1.1.2, 3.1.1, 5.2.1, 6.1.1 |
| Desenvolvedor Backend Pleno | 21h | 1.1.3, 1.2.1, 2.1.1, 2.2.1, 3.1.2, 3.2.1, 5.1.1, 5.1.2 |
| Desenvolvedor Backend Júnior | 2h | 2.1.2 |
| Desenvolvedor Fullstack Pleno | 4h | 1.1.4, 6.2.1, 6.2.2 |

## 6. Organização do Backlog

### 6.1. MVP (Minimum Viable Product)

As seguintes tarefas compõem o MVP, essencial para a primeira entrega funcional:

1. Toda a Fase 1: Configuração do Ambiente
2. Toda a Fase 2: Consulta de CNPJ e API
3. Da Fase 3: Tarefas 3.1.1, 3.2.1 (cálculo básico de risco)
4. Da Fase 4: Tarefas 4.1.1, 4.2.1, 4.2.2, 4.3.1 (interface básica)
5. Da Fase 6: Tarefa 6.2.1, 6.2.2 (documentação e scripts)

Tempo estimado para MVP: 35h

### 6.2. Incrementos Pós-MVP

Após o MVP, as seguintes funcionalidades serão implementadas:

1. Da Fase 3: Tarefa 3.1.2 (mapeamento detalhado de CNAE)
2. Toda a Fase 5: Armazenamento e Cache
3. Da Fase 4: Tarefa 4.2.3 (notificações aprimoradas)
4. Toda a Fase 6: Testes unitários

Tempo estimado para incrementos: 26h

## 7. Quadro Kanban Inicial

### Backlog
- Todas as tarefas da Fase 3, 4, 5 e 6

### A Fazer (Sprint 1)
- Tarefa 1.1.1: Criar estrutura do projeto frontend
- Tarefa 1.1.2: Criar estrutura do projeto backend
- Tarefa 1.1.3: Configurar banco de dados SQLite e ORM
- Tarefa 1.1.4: Configurar ambiente de desenvolvimento integrado
- Tarefa 1.2.1: Implementar sistema de logging no backend

### Em Progresso
- Nenhuma tarefa inicialmente

### Revisão
- Nenhuma tarefa inicialmente

### Concluído
- Nenhuma tarefa inicialmente

## 8. Considerações Finais

Este backlog de desenvolvimento fornece um plano detalhado para a implementação do sistema "Analisador de Risco de Cliente PJ via CNPJ". A organização das tarefas em fases lógicas, com dependências claras e estimativas de esforço, permite um desenvolvimento estruturado e eficiente.

O sistema será implementado como uma aplicação totalmente funcional, seguindo as tecnologias e a arquitetura definidas no documento de arquitetura e atendendo a todos os requisitos funcionais e não funcionais especificados pelo Product Owner.

A abordagem incremental, começando com um MVP bem definido, permite entregas de valor contínuas e oportunidades para ajustes baseados em feedback.