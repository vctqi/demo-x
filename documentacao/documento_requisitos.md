# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## Visão Geral do Sistema

O **Analisador de Risco de Cliente PJ via CNPJ** é uma ferramenta web que permite aos usuários (principalmente profissionais de análise de crédito, compliance e áreas comerciais) realizar uma avaliação rápida e simplificada do risco associado a uma empresa cliente através da consulta do seu CNPJ. 

O sistema utiliza dados públicos obtidos via API para fornecer uma classificação de risco baseada em critérios pré-definidos, auxiliando na tomada de decisão relacionada à concessão de crédito, estabelecimento de parcerias comerciais ou avaliação preliminar de clientes.

## Requisitos Funcionais

### RF01 - Consulta de CNPJ
- O sistema deve permitir ao usuário inserir um número de CNPJ no formato padrão brasileiro (XX.XXX.XXX/XXXX-XX) ou sem formatação.
- O sistema deve validar o formato e o dígito verificador do CNPJ antes de prosseguir com a consulta.
- O sistema deve notificar o usuário caso o CNPJ seja inválido, explicando o motivo.

### RF02 - Obtenção de Dados Públicos
- O sistema deve consultar a API pública para obter os seguintes dados:
  - Razão social e nome fantasia
  - Data de abertura
  - Situação cadastral (ativa, inapta, suspensa, baixada)
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (município e UF)
- O sistema deve gerenciar erros de comunicação com a API, fornecendo feedback adequado ao usuário.

### RF03 - Cálculo de Score de Risco
- O sistema deve calcular um score de risco baseado nos seguintes critérios:
  - Situação cadastral (ativa: +10 pontos, outras situações: -20 pontos)
  - Tempo de operação (mais de 3 anos: +10 pontos, menos de 6 meses: -10 pontos)
  - CNAE principal (baixo risco: +10 pontos, alto risco: -10 pontos)
- O score final deve classificar o cliente como:
  - Baixo risco: 20 pontos ou mais
  - Médio risco: Entre 0 e 19 pontos
  - Alto risco: Abaixo de 0 pontos

### RF04 - Apresentação dos Resultados
- O sistema deve exibir um dashboard com:
  - Dados cadastrais básicos da empresa consultada
  - Score de risco calculado
  - Classificação de risco (Baixo, Médio, Alto) com indicação visual por cores
  - Sinais de alerta relevantes
  - Detalhamento dos critérios que impactaram o score
- A visualização deve ser clara e de fácil interpretação.

### RF05 - Histórico de Consultas
- O sistema deve manter um histórico das consultas realizadas na sessão atual.
- O usuário deve poder visualizar as últimas consultas sem precisar reinserir os CNPJs.

## Requisitos Não Funcionais

### RNF01 - Desempenho
- O tempo de resposta para consulta e cálculo de risco não deve exceder 3 segundos em condições normais de operação.
- O sistema deve implementar cache apropriado para consultas recentes.

### RNF02 - Usabilidade
- A interface deve ser intuitiva e responsiva, adaptando-se a diferentes tamanhos de tela.
- O sistema deve fornecer feedback visual durante o processamento da consulta.
- As mensagens de erro devem ser claras e orientativas.

### RNF03 - Segurança
- Dados sensíveis não devem ser armazenados permanentemente.
- O sistema deve implementar proteção contra ataques básicos (XSS, CSRF).
- As requisições à API externa devem ser feitas de forma segura.

### RNF04 - Disponibilidade
- O sistema deve estar disponível durante o horário comercial (8h às 18h) em dias úteis.
- Manutenções programadas devem ser realizadas fora do horário comercial.

### RNF05 - Compatibilidade
- O sistema deve funcionar corretamente nos navegadores Chrome, Firefox, Edge e Safari em suas versões mais recentes.
- A interface deve ser responsiva para uso em tablets e desktops.

## Épicos e User Stories

### Épico 1: Consulta de Dados Cadastrais

#### US01 - Consulta Básica de CNPJ
**Como** analista de crédito, 
**Eu quero** consultar os dados cadastrais de uma empresa através do CNPJ, 
**Para que** eu possa verificar informações básicas antes de prosseguir com a análise.

**Critérios de Aceitação:**
- Deve existir um campo para inserção do CNPJ com máscara opcional.
- O sistema deve validar o CNPJ antes de enviar a consulta.
- Deve exibir mensagem apropriada caso o CNPJ seja inválido.
- Deve exibir os dados básicos da empresa após consulta bem-sucedida.
- Deve exibir mensagem apropriada caso o CNPJ não seja encontrado.
- Deve exibir mensagem de erro caso haja falha na comunicação com a API.

#### US02 - Visualização de Dados Detalhados
**Como** analista de compliance, 
**Eu quero** visualizar dados detalhados sobre a empresa consultada, 
**Para que** eu possa identificar possíveis sinais de alerta.

**Critérios de Aceitação:**
- Após uma consulta bem-sucedida, deve exibir:
  - Razão social e nome fantasia
  - Data de abertura (com cálculo de tempo de operação)
  - Situação cadastral atual
  - CNAE principal com descrição
  - Porte da empresa
  - Localização (município/UF)
- Deve destacar visualmente situações cadastrais diferentes de "ativa".
- Deve permitir expandir/recolher seções de detalhes.

### Épico 2: Análise de Risco

#### US03 - Cálculo Automático de Score
**Como** analista de risco, 
**Eu quero** que o sistema calcule automaticamente um score de risco para a empresa consultada, 
**Para que** eu possa ter uma avaliação preliminar objetiva.

**Critérios de Aceitação:**
- O sistema deve calcular o score conforme os critérios definidos em RF03.
- O cálculo deve ser realizado automaticamente após a obtenção dos dados cadastrais.
- Deve exibir os pontos atribuídos a cada critério de forma transparente.
- O score final deve ser exibido de forma clara e destacada.

#### US04 - Visualização da Classificação de Risco
**Como** gerente comercial, 
**Eu quero** visualizar a classificação de risco da empresa consultada, 
**Para que** eu possa tomar decisões comerciais preliminares.

**Critérios de Aceitação:**
- Deve exibir a classificação de risco (Baixo, Médio, Alto) com destaque visual.
- Baixo risco deve ser representado pela cor verde.
- Médio risco deve ser representado pela cor amarela.
- Alto risco deve ser representado pela cor vermelha.
- Deve exibir uma breve explicação sobre o que cada nível de risco significa.
- Deve listar os principais fatores que contribuíram para a classificação.

### Épico 3: Experiência do Usuário

#### US05 - Histórico de Consultas
**Como** usuário do sistema, 
**Eu quero** visualizar um histórico das consultas que realizei, 
**Para que** eu possa retornar rapidamente a uma análise anterior.

**Critérios de Aceitação:**
- Deve manter um histórico das últimas 10 consultas na sessão atual.
- Para cada consulta no histórico, deve exibir:
  - CNPJ consultado
  - Razão social
  - Data/hora da consulta
  - Classificação de risco (com indicação visual)
- Deve permitir clicar em um item do histórico para visualizar novamente os detalhes.
- O histórico deve ser mantido apenas durante a sessão atual.

#### US06 - Interface Responsiva
**Como** usuário do sistema, 
**Eu quero** acessar a ferramenta de diferentes dispositivos, 
**Para que** eu possa realizar consultas de onde estiver.

**Critérios de Aceitação:**
- A interface deve se adaptar a diferentes tamanhos de tela (desktop, tablet).
- Todos os elementos da interface devem ser utilizáveis em dispositivos touch.
- A experiência de uso deve ser consistente entre diferentes navegadores.
- Deve haver feedback visual durante o carregamento/processamento.

## Suposições e Restrições

### Suposições
- A API pública de consulta de CNPJ estará disponível e funcional.
- Os dados fornecidos pela API são confiáveis e atualizados.
- Os usuários terão acesso à internet para utilizar o sistema.
- O volume de consultas não excederá os limites da API.

### Restrições
- O sistema é uma ferramenta de análise preliminar e não substitui uma avaliação completa de risco.
- A classificação de risco é baseada apenas nos critérios definidos, podendo não refletir todos os aspectos relevantes.
- A demo não incluirá funcionalidades de autenticação de usuários.
- Não haverá persistência de dados entre sessões.
- A ferramenta utilizará apenas dados públicos disponíveis via API.

---

Este documento de requisitos serve como base para o desenvolvimento do sistema "Analisador de Risco de Cliente PJ via CNPJ" e pode ser refinado ao longo do processo de desenvolvimento.