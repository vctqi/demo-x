# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## Visão Geral do Produto

O "Analisador de Risco de Cliente PJ via CNPJ" é uma ferramenta web que permite aos usuários avaliar rapidamente o nível de risco associado a uma empresa brasileira utilizando apenas seu número de CNPJ. A aplicação consulta dados públicos disponíveis através de APIs, processa essas informações utilizando critérios pré-definidos e apresenta uma análise simplificada de risco, auxiliando na tomada de decisões em processos de due diligence, análise de crédito, ou avaliação de parceiros comerciais.

## Requisitos Funcionais

### RF01 - Consulta de CNPJ
- O sistema deve permitir ao usuário inserir um número de CNPJ no formato válido (XX.XXX.XXX/XXXX-XX ou sem formatação).
- O sistema deve validar o formato do CNPJ inserido.
- O sistema deve consultar os dados cadastrais do CNPJ através de API pública.

### RF02 - Processamento de Dados
- O sistema deve extrair os seguintes dados da consulta:
  - Situação cadastral (ativa, inapta, suspensa, baixada)
  - Data de abertura
  - CNAE principal (atividade econômica)
  - Porte da empresa
  - Localização (cidade/estado)
- O sistema deve calcular o tempo de operação da empresa com base na data de abertura.
- O sistema deve identificar se o CNAE da empresa está em uma lista de atividades de maior risco.

### RF03 - Cálculo de Score de Risco
- O sistema deve atribuir pontuação conforme os seguintes critérios:
  - Empresa ativa: +10 pontos
  - Mais de 3 anos de operação: +10 pontos
  - CNAE de baixo risco: +10 pontos
  - CNAE de alto risco: -10 pontos
  - Empresa inativa/suspensa: -20 pontos
  - Empresa aberta há menos de 6 meses: -10 pontos
- O sistema deve classificar o risco com base na pontuação final:
  - 20 ou mais: Baixo risco (verde)
  - Entre 0 e 19: Médio risco (amarelo)
  - Abaixo de 0: Alto risco (vermelho)

### RF04 - Exibição de Resultados
- O sistema deve apresentar os dados cadastrais consultados do CNPJ.
- O sistema deve exibir a classificação de risco com indicador visual (badge colorido).
- O sistema deve mostrar os sinais de alerta identificados.
- O sistema deve detalhar os critérios que impactaram o score final.

### RF05 - Histórico de Consultas
- O sistema deve armazenar o histórico das últimas 10 consultas realizadas na sessão do usuário.
- O sistema deve permitir que o usuário acesse e reveja consultas anteriores.

## Requisitos Não Funcionais

### RNF01 - Desempenho
- O tempo de resposta para uma consulta completa não deve exceder 3 segundos.
- O sistema deve ser capaz de processar até 100 consultas simultâneas.

### RNF02 - Usabilidade
- A interface deve ser responsiva e funcionar em diferentes dispositivos (desktop, tablet, mobile).
- A aplicação deve ter design intuitivo, minimizando a necessidade de treinamento.
- Mensagens de erro devem ser claras e orientar o usuário sobre como proceder.

### RNF03 - Disponibilidade
- O sistema deve estar disponível 99,5% do tempo, exceto durante manutenções programadas.
- O sistema deve implementar mecanismos de fallback caso a API externa esteja indisponível.

### RNF04 - Segurança
- O sistema deve implementar proteção contra ataques de injeção e CSRF.
- As consultas realizadas não devem expor dados sensíveis nos logs do sistema.
- O sistema deve implementar limitação de taxa para evitar abusos (rate limiting).

### RNF05 - Manutenibilidade
- O código deve seguir padrões de codificação documentados.
- O sistema deve ter cobertura de testes de pelo menos 80%.
- A documentação técnica deve ser mantida atualizada.

## Épicos

### E01 - Consulta e Avaliação de Risco
Permitir que os usuários consultem informações de empresas através do CNPJ e obtenham uma análise de risco baseada em critérios pré-definidos.

### E02 - Experiência do Usuário
Garantir uma experiência intuitiva e eficiente para os usuários durante todo o processo de consulta e análise.

### E03 - Gestão de Dados
Implementar mecanismos para armazenamento, consulta e gestão dos dados processados pelo sistema.

## User Stories

### US01 - Consulta Básica de CNPJ
**Como** usuário do sistema,  
**Eu quero** inserir um CNPJ para consulta,  
**Para que** eu possa obter informações sobre uma empresa específica.

**Critérios de Aceitação:**
- O campo de entrada deve aceitar CNPJ com ou sem formatação.
- O sistema deve validar se o CNPJ inserido é válido (formato e dígitos verificadores).
- Deve exibir mensagem de erro caso o CNPJ seja inválido.
- Deve exibir mensagem de erro caso o CNPJ não seja encontrado.
- Deve mostrar um indicador visual enquanto a consulta está em andamento.

### US02 - Visualização de Dados Cadastrais
**Como** usuário do sistema,  
**Eu quero** visualizar os dados cadastrais do CNPJ consultado,  
**Para que** eu possa conhecer informações básicas sobre a empresa.

**Critérios de Aceitação:**
- Após consulta bem-sucedida, o sistema deve exibir:
  - Razão social
  - Nome fantasia
  - Situação cadastral
  - Data de abertura
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (cidade/estado)
- As informações devem ser apresentadas de forma organizada e de fácil leitura.
- Caso alguma informação não esteja disponível, deve ser indicado como "Não disponível".

### US03 - Análise de Risco
**Como** usuário do sistema,  
**Eu quero** receber uma análise de risco baseada nos dados do CNPJ,  
**Para que** eu possa avaliar rapidamente o nível de risco associado à empresa.

**Critérios de Aceitação:**
- O sistema deve calcular e exibir o score de risco conforme os critérios definidos.
- A classificação de risco deve ser exibida com um badge colorido (verde, amarelo ou vermelho).
- Os critérios que impactaram o score devem ser listados de forma clara.
- O sistema deve destacar os sinais de alerta identificados.
- A análise deve ser atualizada automaticamente se o usuário consultar o mesmo CNPJ novamente.

### US04 - Detalhamento dos Critérios de Risco
**Como** usuário do sistema,  
**Eu quero** visualizar detalhadamente os critérios utilizados no cálculo do risco,  
**Para que** eu possa entender os fatores que influenciaram a classificação.

**Critérios de Aceitação:**
- O sistema deve exibir todos os critérios avaliados.
- Para cada critério, deve mostrar:
  - Descrição do critério
  - Pontuação atribuída (+10, -10, etc.)
  - Justificativa para a pontuação
- Deve ser possível expandir/colapsar a seção de detalhamento para melhor visualização.

### US05 - Histórico de Consultas
**Como** usuário do sistema,  
**Eu quero** acessar o histórico das minhas consultas recentes,  
**Para que** eu possa revisar ou comparar análises anteriores.

**Critérios de Aceitação:**
- O sistema deve armazenar as últimas 10 consultas realizadas na sessão.
- Cada item do histórico deve mostrar:
  - CNPJ consultado
  - Razão social
  - Classificação de risco (com indicador visual)
  - Data/hora da consulta
- Deve ser possível clicar em um item do histórico para visualizar novamente os detalhes completos.
- O histórico deve persistir durante toda a sessão do usuário.

### US06 - Exportação de Resultados
**Como** usuário do sistema,  
**Eu quero** exportar os resultados da análise em formato PDF,  
**Para que** eu possa salvar ou compartilhar as informações obtidas.

**Critérios de Aceitação:**
- Deve haver um botão de "Exportar para PDF" na tela de resultados.
- O PDF gerado deve conter todos os dados cadastrais e a análise de risco completa.
- O arquivo PDF deve ser formatado de maneira profissional e de fácil leitura.
- O nome do arquivo deve seguir o padrão "Analise_Risco_[CNPJ]_[Data].pdf".

## Considerações sobre Experiência do Usuário

- A interface deve ser limpa e focada na tarefa principal (consulta de CNPJ).
- O fluxo de uso deve ser intuitivo: campo de entrada > botão de consulta > exibição de resultados.
- Feedback visual deve ser fornecido em todas as etapas (validação, consulta em andamento, resultados).
- O design deve priorizar a legibilidade das informações críticas (classificação de risco, sinais de alerta).
- A navegação entre resultados e histórico deve ser fluida e clara.
- Mensagens de erro devem ser construtivas e orientar o usuário sobre como proceder.
- A aplicação deve ter tempos de carregamento percebidos como rápidos, utilizando indicadores de progresso quando necessário.
- Os elementos visuais de risco (badges coloridos) devem ser intuitivos e acessíveis, considerando usuários com daltonismo.