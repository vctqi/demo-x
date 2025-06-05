# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral do Produto

### 1.1 Descrição
O "Analisador de Risco de Cliente PJ via CNPJ" é uma ferramenta que permite aos usuários realizar uma análise rápida e simplificada do risco associado a empresas (Pessoas Jurídicas) através da consulta de seu CNPJ. O sistema utiliza dados públicos disponíveis via API para avaliar fatores como tempo de operação, atividade econômica e situação cadastral, gerando uma classificação de risco que auxilia na tomada de decisões.

### 1.2 Propósito
Oferecer uma forma simples e rápida de avaliar o risco potencial de relacionamento com uma empresa, permitindo que o usuário tome decisões mais informadas sobre parcerias comerciais, concessão de crédito ou outras formas de relacionamento empresarial.

### 1.3 Valor para o Usuário
- Economia de tempo na avaliação inicial de potenciais parceiros de negócio
- Padronização do processo de análise de risco básica
- Acesso rápido a informações relevantes sobre empresas
- Identificação precoce de sinais de alerta em potenciais relacionamentos comerciais

## 2. Requisitos Funcionais

### 2.1 Entrada de Dados
- RF01: O sistema deve permitir que o usuário insira um número de CNPJ no formato XX.XXX.XXX/XXXX-XX ou sem formatação (apenas números).
- RF02: O sistema deve validar o formato e os dígitos verificadores do CNPJ antes de processar a consulta.
- RF03: O sistema deve fornecer feedback imediato ao usuário caso o CNPJ inserido seja inválido.

### 2.2 Consulta de Dados
- RF04: O sistema deve consultar a API pública de CNPJ (https://docs.cnpj.ws/) para obter dados da empresa.
- RF05: O sistema deve extrair da API, no mínimo, os seguintes dados:
  - Razão social
  - Nome fantasia (se disponível)
  - Situação cadastral (ativa, inapta, suspensa, baixada)
  - Data de abertura
  - CNAE principal (código e descrição da atividade econômica)
  - Porte da empresa
  - Localização (município/UF)
- RF06: O sistema deve tratar adequadamente os casos em que a API está indisponível ou o CNPJ não é encontrado.

### 2.3 Análise de Risco
- RF07: O sistema deve calcular um score de risco baseado nos seguintes critérios:
  - Situação cadastral da empresa
  - Tempo de operação (data de abertura até o presente)
  - Classificação de risco do CNAE principal
- RF08: O sistema deve classificar o risco da empresa em três níveis:
  - Baixo risco (score ≥ 20)
  - Médio risco (score entre 0 e 19)
  - Alto risco (score < 0)
- RF09: O sistema deve identificar e exibir sinais de alerta específicos, como:
  - Situação cadastral irregular
  - Empresa recém-aberta (menos de 6 meses)
  - CNAE com risco associado

### 2.4 Apresentação dos Resultados
- RF10: O sistema deve exibir um dashboard com os dados cadastrais obtidos da empresa.
- RF11: O sistema deve exibir a classificação de risco calculada de forma clara e visual (badge colorido).
- RF12: O sistema deve listar os critérios que impactaram positiva e negativamente o score.
- RF13: O sistema deve permitir uma nova consulta sem necessidade de recarregar a página.

## 3. Requisitos Não Funcionais

### 3.1 Usabilidade
- RNF01: A interface deve ser intuitiva e de fácil uso, permitindo que o usuário realize a consulta em até 3 cliques.
- RNF02: O sistema deve fornecer feedback visual durante o processamento da consulta (ex: indicador de carregamento).
- RNF03: As mensagens de erro devem ser claras e orientar o usuário sobre como proceder.

### 3.2 Performance
- RNF04: O tempo de resposta para consulta e análise de um CNPJ não deve exceder 5 segundos em condições normais de rede.
- RNF05: O sistema deve ter timeout configurado para a API externa, não excedendo 10 segundos de espera.
- RNF06: O frontend deve ser otimizado para carregamento rápido (< 3 segundos).

### 3.3 Segurança
- RNF07: O sistema deve validar e sanitizar todas as entradas de usuário para prevenir injeção de código.
- RNF08: O sistema não deve expor dados sensíveis nos logs ou no frontend.
- RNF09: As chamadas à API externa devem ser tratadas de forma segura.

### 3.4 Disponibilidade e Confiabilidade
- RNF10: O sistema deve estar disponível para uso durante o horário comercial (8h às 18h).
- RNF11: O sistema deve ser resiliente a falhas na API externa, fornecendo feedback adequado ao usuário.
- RNF12: O sistema deve manter logs adequados para diagnóstico de problemas.

### 3.5 Manutenibilidade
- RNF13: O código deve seguir boas práticas de desenvolvimento e ser adequadamente documentado.
- RNF14: O sistema deve ter uma arquitetura modular que facilite futuras expansões.

## 4. Épicos e User Stories

### Épico 1: Consulta de CNPJ
**Descrição**: Como usuário, quero poder consultar informações cadastrais de uma empresa através do seu CNPJ, para conhecer seu histórico e situação atual.

#### User Story 1.1: Entrada e Validação de CNPJ
**Como** usuário do sistema,  
**Quero** inserir um número de CNPJ e ter sua validade verificada,  
**Para** garantir que estou consultando um número de registro válido.

**Critérios de Aceitação:**
- O sistema deve aceitar CNPJ com ou sem formatação (ex: 12.345.678/0001-90 ou 12345678000190).
- O sistema deve validar o formato e os dígitos verificadores do CNPJ.
- O sistema deve exibir uma mensagem de erro clara se o CNPJ for inválido.
- O sistema deve permitir que o usuário corrija o CNPJ após um erro.
- O botão de consulta só deve ser habilitado após a inserção de um CNPJ com formato válido.

#### User Story 1.2: Consulta de Dados Cadastrais
**Como** usuário do sistema,  
**Quero** visualizar os dados cadastrais da empresa consultada,  
**Para** conhecer suas informações básicas e situação atual.

**Critérios de Aceitação:**
- Após inserir um CNPJ válido e clicar em "Analisar", o sistema deve exibir:
  - Razão social
  - Nome fantasia (se disponível)
  - Situação cadastral
  - Data de abertura
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (município/UF)
- O sistema deve exibir uma mensagem adequada caso o CNPJ não seja encontrado na base de dados.
- O sistema deve exibir uma mensagem adequada caso a API esteja indisponível.
- Os dados devem ser apresentados de forma organizada e legível.

### Épico 2: Análise de Risco
**Descrição**: Como usuário, quero receber uma análise de risco da empresa consultada, baseada em critérios objetivos, para auxiliar na minha tomada de decisão.

#### User Story 2.1: Cálculo do Score de Risco
**Como** usuário do sistema,  
**Quero** que o sistema calcule automaticamente um score de risco para a empresa consultada,  
**Para** ter uma avaliação objetiva baseada em critérios predefinidos.

**Critérios de Aceitação:**
- O sistema deve calcular o score de risco considerando:
  - +10 pontos se a empresa estiver ativa
  - +10 pontos se a empresa tiver mais de 3 anos de operação
  - +10 pontos se o CNAE for de baixo risco
  - -10 pontos se o CNAE for de alto risco (ex: factoring, construção)
  - -20 pontos se a empresa estiver inativa/suspensa
  - -10 pontos se a empresa tiver menos de 6 meses de operação
- O cálculo deve ser realizado automaticamente após a obtenção dos dados cadastrais.
- O sistema deve manter uma lista categorizada de CNAEs de alto e baixo risco.

#### User Story 2.2: Classificação e Exibição do Risco
**Como** usuário do sistema,  
**Quero** visualizar a classificação de risco da empresa de forma clara e intuitiva,  
**Para** identificar rapidamente o nível de risco associado.

**Critérios de Aceitação:**
- O sistema deve classificar o risco em três níveis:
  - Baixo risco (verde): score ≥ 20
  - Médio risco (amarelo): score entre 0 e 19
  - Alto risco (vermelho): score < 0
- A classificação deve ser exibida com destaque visual (badge colorido).
- O sistema deve exibir uma lista dos fatores que contribuíram para o score (positivos e negativos).
- O sistema deve exibir alertas específicos quando aplicável (ex: "Empresa recém-aberta", "Situação cadastral irregular").

### Épico 3: Experiência do Usuário
**Descrição**: Como usuário, quero uma interface intuitiva e responsiva, que me permita consultar e analisar múltiplos CNPJs de forma eficiente.

#### User Story 3.1: Interface Responsiva e Intuitiva
**Como** usuário do sistema,  
**Quero** utilizar uma interface clara e responsiva,  
**Para** realizar consultas de forma eficiente em qualquer dispositivo.

**Critérios de Aceitação:**
- A interface deve ser responsiva, adaptando-se a diferentes tamanhos de tela.
- Os elementos da interface devem ter tamanho adequado para uso em dispositivos móveis.
- A navegação deve ser intuitiva, com fluxo claro de ações.
- O sistema deve fornecer feedback visual durante o processamento (ex: indicador de carregamento).
- As informações devem ser apresentadas de forma hierárquica, destacando os dados mais relevantes.

#### User Story 3.2: Múltiplas Consultas
**Como** usuário do sistema,  
**Quero** poder realizar múltiplas consultas sem recarregar a página,  
**Para** analisar várias empresas de forma eficiente.

**Critérios de Aceitação:**
- Após completar uma consulta, o sistema deve permitir iniciar uma nova consulta através de um botão claro.
- A nova consulta deve limpar os resultados anteriores.
- O campo de CNPJ deve ser limpo ao iniciar uma nova consulta.
- O histórico de consultas da sessão deve ser mantido e exibido (opcional/futuro).

## 5. Regras de Negócio

### 5.1 Cálculo do Score de Risco
- RN01: O score de risco é calculado através da soma dos seguintes pontos:
  - Empresa ativa: +10 pontos
  - Mais de 3 anos de operação: +10 pontos
  - CNAE de baixo risco: +10 pontos
  - CNAE de alto risco: -10 pontos
  - Empresa inativa/suspensa: -20 pontos
  - Empresa com menos de 6 meses de operação: -10 pontos

### 5.2 Classificação de Risco
- RN02: A classificação de risco é determinada pelo score final:
  - Score ≥ 20: Baixo risco (verde)
  - Score entre 0 e 19: Médio risco (amarelo)
  - Score < 0: Alto risco (vermelho)

### 5.3 Classificação de CNAEs
- RN03: Para fins de análise de risco, os CNAEs serão classificados como:
  - Alto risco: 
    - 6491-3/00 (Sociedades de fomento mercantil - factoring)
    - 4120-4/00 (Construção de edifícios)
    - 4399-1/99 (Serviços especializados para construção)
    - 9609-2/07 (Alojamento de animais domésticos)
    - 9200-3/99 (Exploração de jogos de azar e apostas)
    - 4711-3/01 (Comércio varejista de mercadorias em geral)
  - Baixo risco:
    - 6201-5/01 (Desenvolvimento de software)
    - 8550-3/02 (Atividades de apoio à educação)
    - 7210-0/00 (Pesquisa e desenvolvimento)
    - 8621-6/01 (UTI móvel)
    - 8630-5/03 (Laboratório clínico)
  - Risco neutro: demais CNAEs (não impactam o score)

### 5.4 Validação de CNPJ
- RN04: Um CNPJ válido deve:
  - Conter 14 dígitos numéricos
  - Possuir dígitos verificadores corretos (calculados pelo algoritmo oficial)
  - Não ser composto apenas por dígitos repetidos (ex: 00000000000000)

### 5.5 Processamento de Consultas
- RN05: Caso a API externa esteja indisponível, o sistema deve:
  - Informar ao usuário sobre a indisponibilidade
  - Sugerir que tente novamente mais tarde
  - Registrar o erro nos logs do sistema

## 6. Glossário

- **CNPJ**: Cadastro Nacional da Pessoa Jurídica, registro de empresas junto à Receita Federal do Brasil.
- **CNAE**: Classificação Nacional de Atividades Econômicas, código que identifica a atividade econômica principal da empresa.
- **API**: Application Programming Interface, interface que permite a comunicação entre sistemas distintos.
- **Score**: Pontuação numérica calculada com base em critérios predefinidos para avaliar o risco.
- **Badge**: Elemento visual (selo) que indica a classificação de risco de forma colorida.
- **PJ**: Pessoa Jurídica, termo que designa uma empresa formalmente constituída.
- **Frontend**: Parte do sistema com a qual o usuário interage diretamente (interface).
- **Backend**: Parte do sistema responsável pelo processamento e lógica de negócio.