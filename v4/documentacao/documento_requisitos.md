# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral do Produto

O **Analisador de Risco de Cliente PJ via CNPJ** é uma ferramenta que permite aos usuários realizar uma análise simplificada de risco de empresas (Pessoas Jurídicas) a partir do número de CNPJ. A solução consulta dados públicos, aplica critérios de análise de risco pré-definidos e apresenta um dashboard com a classificação de risco e informações relevantes sobre a empresa consultada.

Esta ferramenta visa auxiliar profissionais de crédito, analistas financeiros e gestores de relacionamento a realizar uma avaliação rápida e padronizada do risco potencial de clientes PJ, facilitando a tomada de decisão inicial em processos de concessão de crédito, estabelecimento de parcerias comerciais ou avaliação de fornecedores.

## 2. Requisitos Funcionais

### 2.1. Entrada de Dados
- RF-01: O sistema deve fornecer um campo para que o usuário insira o número de CNPJ a ser analisado.
- RF-02: O sistema deve validar o formato do CNPJ inserido (14 dígitos numéricos, sem caracteres especiais).
- RF-03: O sistema deve oferecer um botão "Analisar Risco" para iniciar a análise após a inserção do CNPJ.
- RF-04: O sistema deve permitir limpar o campo de CNPJ para uma nova consulta.

### 2.2. Processamento de Dados
- RF-05: O sistema deve consultar dados públicos da empresa por meio da API pública de CNPJ (https://docs.cnpj.ws/), incluindo:
  - Situação cadastral (ativa, inapta, suspensa, baixada)
  - Data de abertura
  - CNAE principal (atividade econômica)
  - Porte da empresa
  - Localização
- RF-06: O sistema deve calcular um score de risco com base nos critérios pré-definidos:
  - Empresa ativa (+10 pontos)
  - Mais de 3 anos de operação (+10 pontos)
  - CNAE de baixo risco (+10 pontos)
  - CNAE de risco (ex.: factoring) (-10 pontos)
  - Empresa inativa/suspensa (-20 pontos)
  - Empresa aberta há menos de 6 meses (-10 pontos)
- RF-07: O sistema deve classificar o risco com base no score final:
  - 20 ou mais: Baixo risco
  - Entre 0 e 19: Médio risco
  - Abaixo de 0: Alto risco

### 2.3. Saída e Visualização
- RF-08: O sistema deve exibir um dashboard com os dados cadastrais da empresa consultada:
  - Razão social
  - CNPJ
  - Situação cadastral
  - Data de abertura
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (município/UF)
- RF-09: O sistema deve apresentar a classificação de risco (Baixo, Médio ou Alto) com um badge visual:
  - Baixo risco: Verde
  - Médio risco: Amarelo
  - Alto risco: Vermelho
- RF-10: O sistema deve exibir os sinais de alerta identificados na análise:
  - Situação cadastral irregular
  - Empresa recém-aberta
  - CNAE com risco associado
- RF-11: O sistema deve mostrar os critérios que impactaram o score final, incluindo:
  - Critérios positivos aplicados
  - Critérios negativos aplicados
  - Pontuação atribuída a cada critério
  - Score final calculado

### 2.4. Armazenamento e Histórico
- RF-12: O sistema deve salvar o resultado de cada consulta no banco de dados, incluindo:
  - CNPJ consultado
  - Data/hora da consulta
  - Dados obtidos da API
  - Score calculado
  - Classificação de risco
- RF-13: Caso um CNPJ seja consultado novamente em menos de 24 horas, o sistema deve:
  - Recuperar os dados da consulta anterior armazenados no banco
  - Não realizar nova consulta à API
  - Exibir uma notificação informando que os dados são de uma consulta anterior
  - Mostrar a data/hora da consulta original

## 3. Requisitos Não Funcionais

### 3.1. Desempenho
- RNF-01: O tempo de resposta para consulta à API externa não deve exceder 5 segundos.
- RNF-02: O tempo total para processar e exibir o resultado da análise não deve exceder 8 segundos.
- RNF-03: O sistema deve ser capaz de processar até 100 consultas simultâneas sem degradação de desempenho.

### 3.2. Segurança
- RNF-04: O sistema deve implementar técnicas para prevenir ataques de injeção e outros vetores comuns.
- RNF-05: Os dados armazenados no banco de dados devem ser protegidos contra acesso não autorizado.

### 3.3. Usabilidade
- RNF-06: A interface deve ser responsiva, adaptando-se a diferentes tamanhos de tela.
- RNF-07: O sistema deve fornecer mensagens claras de erro e orientações para o usuário.
- RNF-08: As informações de risco devem ser apresentadas de forma visual e intuitiva.
- RNF-09: O sistema deve oferecer ajuda contextual sobre os critérios de avaliação de risco.

### 3.4. Confiabilidade
- RNF-10: O sistema deve implementar tratamento adequado para falhas na API externa.
- RNF-11: Em caso de indisponibilidade da API, o sistema deve notificar o usuário e sugerir tentar novamente mais tarde.
- RNF-12: O sistema deve manter registros de log para todas as operações críticas e erros.

### 3.5. Manutenibilidade
- RNF-13: O código deve seguir padrões de qualidade e boas práticas de desenvolvimento.
- RNF-14: A arquitetura deve permitir a fácil inclusão de novos critérios de avaliação de risco.
- RNF-15: A lógica de negócio deve ser separada da interface de usuário.

## 4. Épicos e User Stories

### Épico 1: Consulta de CNPJ
**Descrição**: Possibilitar ao usuário consultar informações de empresas através do CNPJ.

#### User Story 1.1
**Como** analista de crédito,  
**Eu quero** inserir um CNPJ no sistema,  
**Para que** eu possa consultar os dados cadastrais da empresa.

**Critérios de Aceitação:**
- Deve existir um campo para inserção do CNPJ.
- O sistema deve validar se o formato do CNPJ é válido (14 dígitos numéricos).
- Deve haver um botão "Analisar Risco" para iniciar a consulta.
- O sistema deve exibir uma mensagem de erro clara se o CNPJ estiver em formato inválido.
- Deve ser possível limpar o campo para uma nova consulta.

#### User Story 1.2
**Como** analista de crédito,  
**Eu quero** visualizar os dados cadastrais da empresa consultada,  
**Para que** eu possa conhecer suas informações básicas.

**Critérios de Aceitação:**
- Após a consulta, o sistema deve exibir:
  - Razão social da empresa
  - CNPJ formatado
  - Situação cadastral atual
  - Data de abertura
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (município/UF)
- As informações devem ser apresentadas de forma clara e organizada.
- Se a API não retornar alguma informação, o sistema deve indicar "Não disponível".

### Épico 2: Análise de Risco
**Descrição**: Processar e exibir a análise de risco da empresa consultada.

#### User Story 2.1
**Como** analista de crédito,  
**Eu quero** que o sistema calcule automaticamente o score de risco da empresa,  
**Para que** eu possa avaliar seu nível de risco de forma padronizada.

**Critérios de Aceitação:**
- O sistema deve calcular o score com base nos critérios definidos:
  - Empresa ativa (+10 pontos)
  - Mais de 3 anos de operação (+10 pontos)
  - CNAE de baixo risco (+10 pontos)
  - CNAE de risco (ex.: factoring) (-10 pontos)
  - Empresa inativa/suspensa (-20 pontos)
  - Empresa aberta há menos de 6 meses (-10 pontos)
- O cálculo deve ser realizado automaticamente após a consulta do CNPJ.
- O score final deve ser exibido numericamente.

#### User Story 2.2
**Como** analista de crédito,  
**Eu quero** visualizar a classificação de risco da empresa,  
**Para que** eu possa tomar decisões rápidas baseadas nessa classificação.

**Critérios de Aceitação:**
- O sistema deve classificar o risco com base no score final:
  - 20 ou mais: Baixo risco (verde)
  - Entre 0 e 19: Médio risco (amarelo)
  - Abaixo de 0: Alto risco (vermelho)
- A classificação deve ser exibida com um badge visual na cor correspondente.
- Os sinais de alerta devem ser destacados (situação cadastral irregular, empresa recém-aberta, CNAE de risco).
- O sistema deve exibir detalhadamente os critérios que impactaram o score.

### Épico 3: Histórico e Cache
**Descrição**: Gerenciar o armazenamento e recuperação de consultas anteriores.

#### User Story 3.1
**Como** analista de crédito,  
**Eu quero** que o sistema armazene o resultado das consultas,  
**Para que** seja possível rastrear análises anteriores.

**Critérios de Aceitação:**
- O sistema deve salvar no banco de dados:
  - CNPJ consultado
  - Data/hora da consulta
  - Dados obtidos da API
  - Score calculado
  - Classificação de risco
- O armazenamento deve ocorrer automaticamente após cada consulta bem-sucedida.
- Os dados armazenados devem ser protegidos contra acesso não autorizado.

#### User Story 3.2
**Como** analista de crédito,  
**Eu quero** que o sistema utilize dados em cache para consultas recentes,  
**Para que** o processo seja mais rápido e reduza chamadas desnecessárias à API externa.

**Critérios de Aceitação:**
- Se um CNPJ for consultado novamente em menos de 24 horas, o sistema deve:
  - Recuperar os dados da consulta anterior do banco de dados
  - Não realizar nova chamada à API externa
  - Exibir uma notificação informando que os dados são de uma consulta anterior
  - Mostrar a data/hora da consulta original
- O usuário deve ter a opção de forçar uma nova consulta à API, caso deseje.

## 5. Restrições e Limitações
- O sistema utilizará apenas dados públicos disponíveis através da API de CNPJ.
- A análise de risco é simplificada e baseada em critérios básicos, não substituindo uma análise financeira completa.
- A disponibilidade do sistema depende da disponibilidade da API externa.
- O escopo inicial não inclui autenticação de usuários ou níveis de acesso.

## 6. Glossário
- **CNPJ**: Cadastro Nacional da Pessoa Jurídica
- **CNAE**: Classificação Nacional de Atividades Econômicas
- **PJ**: Pessoa Jurídica
- **Score**: Pontuação calculada para determinar o nível de risco
- **Badge**: Elemento visual que indica a classificação de risco
- **API**: Interface de Programação de Aplicações