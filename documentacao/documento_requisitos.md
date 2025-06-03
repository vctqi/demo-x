# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral do Produto

O "Analisador de Risco de Cliente PJ via CNPJ" é uma ferramenta web que permite a avaliação rápida e simplificada de risco de empresas brasileiras através da consulta do CNPJ. O sistema utiliza dados públicos para determinar um score de risco baseado em critérios predefinidos, auxiliando profissionais de crédito, compliance e áreas comerciais na tomada de decisões iniciais sobre estabelecimento de relacionamento comercial com empresas.

O produto oferece uma interface simples e direta para consulta, processando os dados obtidos através de uma API pública de CNPJ e apresentando os resultados em um dashboard intuitivo, com classificações visuais de risco e detalhamento dos fatores que impactaram a análise.

## 2. Requisitos Funcionais

1. **Entrada de CNPJ**
   - O sistema deve permitir ao usuário inserir um número de CNPJ para análise
   - O sistema deve validar o formato e dígitos verificadores do CNPJ inserido

2. **Consulta de Dados**
   - O sistema deve consultar dados cadastrais da empresa através da API pública de CNPJ
   - O sistema deve processar e extrair as informações relevantes da resposta da API

3. **Análise de Risco**
   - O sistema deve calcular um score de risco baseado nos critérios predefinidos
   - O sistema deve classificar o resultado em categorias de risco (Baixo, Médio, Alto)
   - O sistema deve identificar sinais de alerta específicos

4. **Apresentação de Resultados**
   - O sistema deve exibir os dados cadastrais obtidos da empresa consultada
   - O sistema deve mostrar a classificação de risco com indicação visual (badge colorido)
   - O sistema deve apresentar o detalhamento dos critérios que impactaram o score
   - O sistema deve permitir a visualização clara dos sinais de alerta identificados

5. **Tratamento de Erros**
   - O sistema deve informar adequadamente quando um CNPJ não for encontrado
   - O sistema deve tratar falhas na conexão com a API externa
   - O sistema deve fornecer mensagens de erro claras e orientativas

## 3. Requisitos Não Funcionais

1. **Desempenho**
   - O tempo de resposta para consulta e análise não deve exceder 5 segundos em condições normais
   - O sistema deve ser capaz de processar até 100 consultas simultâneas

2. **Segurança**
   - O sistema deve validar e sanitizar todas as entradas de dados para prevenir injeções
   - O sistema não deve armazenar dados sensíveis das consultas sem necessidade

3. **Usabilidade**
   - A interface deve ser intuitiva e responsiva, adaptando-se a diferentes tamanhos de tela
   - O sistema deve fornecer feedback visual durante o processamento da consulta
   - As informações devem ser apresentadas de forma clara e organizada

4. **Confiabilidade**
   - O sistema deve estar disponível em pelo menos 99% do tempo
   - As análises de risco devem ser consistentes para os mesmos dados de entrada

5. **Manutenibilidade**
   - O código deve seguir padrões de desenvolvimento e ser bem documentado
   - A arquitetura deve permitir a fácil atualização dos critérios de risco

6. **Escalabilidade**
   - O sistema deve ser projetado para permitir o aumento de volume de consultas sem degradação significativa

## 4. Épicos e User Stories

### Épico 1: Consulta de CNPJ

- **User Story 1.1**: Como usuário, quero inserir um CNPJ em um campo de busca para iniciar a análise de risco da empresa.
  - **Critérios de Aceitação**:
    - Deve existir um campo para inserção do CNPJ na página inicial
    - O campo deve aceitar apenas números
    - Deve haver validação do formato do CNPJ (14 dígitos)
    - Deve haver validação dos dígitos verificadores do CNPJ
    - Deve existir um botão "Analisar Risco" para iniciar a consulta

- **User Story 1.2**: Como usuário, quero receber feedback claro quando o CNPJ inserido for inválido ou não for encontrado.
  - **Critérios de Aceitação**:
    - Mensagem de erro deve ser exibida quando o formato do CNPJ for inválido
    - Mensagem específica deve ser mostrada quando o CNPJ não for encontrado na base de dados
    - O sistema deve sugerir verificar a digitação em caso de erro
    - O campo de CNPJ deve ser mantido para permitir correções

- **User Story 1.3**: Como usuário, quero visualizar um indicador de progresso enquanto aguardo o resultado da consulta.
  - **Critérios de Aceitação**:
    - Um indicador de carregamento deve ser exibido após o envio da consulta
    - O indicador deve permanecer visível até que o resultado seja carregado ou ocorra um erro
    - O usuário não deve poder iniciar outra consulta enquanto uma estiver em andamento

### Épico 2: Processamento de Dados

- **User Story 2.1**: Como sistema, quero consultar dados cadastrais do CNPJ através da API pública para obter informações atualizadas da empresa.
  - **Critérios de Aceitação**:
    - O sistema deve se conectar corretamente à API pública de CNPJ
    - O sistema deve extrair corretamente os seguintes dados: situação cadastral, data de abertura, CNAE principal, porte da empresa e localização
    - O sistema deve tratar adequadamente erros de conexão ou resposta da API
    - O sistema deve implementar um timeout adequado para a consulta

- **User Story 2.2**: Como sistema, quero calcular o score de risco baseado nos critérios predefinidos para classificar a empresa.
  - **Critérios de Aceitação**:
    - O cálculo deve considerar corretamente todos os critérios definidos na tabela de pontuação
    - O score final deve ser categorizado corretamente (Baixo, Médio ou Alto risco)
    - O sistema deve identificar e registrar todos os sinais de alerta aplicáveis
    - A lógica de cálculo deve ser facilmente atualizável

### Épico 3: Visualização de Resultados

- **User Story 3.1**: Como usuário, quero visualizar os dados cadastrais básicos da empresa consultada para confirmar a identidade do cliente.
  - **Critérios de Aceitação**:
    - Os seguintes dados devem ser exibidos de forma organizada: Razão Social, Nome Fantasia, CNPJ, Situação Cadastral, Data de Abertura, CNAE principal (código e descrição), Porte da Empresa, Endereço
    - Os dados devem ser formatados adequadamente para fácil leitura
    - Deve haver clara separação visual entre os dados cadastrais e a análise de risco

- **User Story 3.2**: Como usuário, quero ver claramente a classificação de risco da empresa com indicação visual para facilitar a compreensão imediata.
  - **Critérios de Aceitação**:
    - Um badge colorido deve indicar o nível de risco (Verde para Baixo, Amarelo para Médio, Vermelho para Alto)
    - O score numérico também deve ser exibido junto à classificação
    - A classificação deve estar em posição de destaque no dashboard

- **User Story 3.3**: Como usuário, quero visualizar os critérios que impactaram o score de risco para entender a análise realizada.
  - **Critérios de Aceitação**:
    - Cada critério aplicado deve ser listado com sua respectiva pontuação (positiva ou negativa)
    - Os sinais de alerta devem ser destacados visualmente
    - Deve haver uma explicação sucinta de como cada critério afeta o score

## 5. Restrições e Premissas

### Restrições:

1. **Tecnológicas**:
   - O sistema deve ser implementado utilizando as tecnologias especificadas: Frontend (HTML5 + JS ou React), Backend NodeJS e Banco de dados SQLite
   - A integração deve ser feita exclusivamente com a API pública de CNPJ indicada

2. **Legais**:
   - O sistema deve utilizar apenas dados públicos disponíveis através da API
   - O sistema deve incluir disclaimers informando que a análise é simplificada e não substitui uma avaliação de crédito completa

### Premissas:

1. **Dados**:
   - A API pública de CNPJ estará disponível e funcionando corretamente
   - Os dados fornecidos pela API serão suficientes para a análise proposta

2. **Negócio**:
   - Os critérios de pontuação definidos são adequados para uma análise inicial de risco
   - Os usuários possuem conhecimento básico sobre análise de risco de empresas

## 6. Glossário

- **CNPJ**: Cadastro Nacional da Pessoa Jurídica, registro obrigatório para empresas no Brasil
- **CNAE**: Classificação Nacional de Atividades Econômicas, código que identifica a atividade econômica principal da empresa
- **Score de Risco**: Pontuação numérica que representa o nível de risco associado à empresa
- **Situação Cadastral**: Status atual da empresa junto à Receita Federal (ativa, suspensa, inapta, baixada)
- **Badge**: Indicador visual (geralmente colorido) que representa o nível de risco
- **PJ**: Pessoa Jurídica, termo utilizado para se referir a empresas