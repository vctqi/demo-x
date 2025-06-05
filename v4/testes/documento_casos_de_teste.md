# Documento de Casos de Teste - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento contém o plano de testes e casos de teste detalhados para o sistema "Analisador de Risco de Cliente PJ via CNPJ". Os casos de teste foram desenvolvidos com base nos requisitos do sistema, arquitetura técnica e backlog de desenvolvimento, visando garantir a qualidade e conformidade do produto final.

## 2. Estratégia de Teste

### 2.1. Abordagem de Teste

O processo de teste para este sistema seguirá uma abordagem abrangente, incluindo:

- **Testes Unitários**: Verificação isolada de componentes e funções individuais
- **Testes de Integração**: Verificação da comunicação entre componentes do sistema
- **Testes Funcionais**: Verificação do comportamento do sistema contra requisitos funcionais
- **Testes de Interface**: Verificação da usabilidade e conformidade visual
- **Testes de Performance**: Verificação do tempo de resposta e comportamento sob carga
- **Testes de Recuperação**: Verificação do comportamento do sistema após falhas

### 2.2. Ambientes de Teste

- **Ambiente de Desenvolvimento**: Para testes unitários e testes iniciais de integração
- **Ambiente de Teste**: Para testes funcionais, de interface e de sistema
- **Ambiente de Produção Simulado**: Para testes de performance e recuperação

### 2.3. Ferramentas de Teste

- **Jest**: Para testes unitários do frontend e backend
- **Supertest**: Para testes de API
- **React Testing Library**: Para testes de componentes React
- **Postman/Insomnia**: Para testes manuais de API
- **Chrome DevTools**: Para inspeção de interface e debugging
- **Lighthouse**: Para análise de performance

### 2.4. Critérios de Entrada e Saída

#### Critérios de Entrada
- Documento de requisitos revisado e aprovado
- Documento de arquitetura revisado e aprovado
- Código implementado e disponível para teste
- Ambiente de teste configurado e funcional

#### Critérios de Saída
- Todos os casos de teste críticos e de alta prioridade executados
- Nenhum defeito crítico ou de alta severidade em aberto
- Taxa de cobertura de testes acima de 80%
- Documentação de testes completa e atualizada

## 3. Casos de Teste

### 3.1. Testes de Consulta de CNPJ

#### TC-001: Consulta de CNPJ Válido - Empresa Ativa e Antiga

- **ID do Teste**: TC-001
- **Título**: Consulta de CNPJ válido de empresa ativa e com mais de 3 anos
- **Referência à User Story**: User Story 1.1, User Story 1.2
- **Severidade**: Crítica
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste: 00.000.000/0001-91 (Banco do Brasil)
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ "00.000.000/0001-91" no campo de entrada
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ: 00.000.000/0001-91
- **Resultado Esperado**:
  - O sistema deve exibir os dados cadastrais da empresa
  - A situação cadastral deve ser "Ativa"
  - A data de abertura deve indicar mais de 3 anos
  - O score deve ser maior ou igual a 20
  - A classificação de risco deve ser "Baixo" com badge verde
- **Critérios de Sucesso/Falha**:
  - Sucesso: Todos os dados são exibidos corretamente e a classificação de risco é "Baixo"
  - Falha: Dados incorretos, classificação incorreta ou erro na consulta
- **Observações**: Este teste verifica o fluxo principal do sistema com um CNPJ válido de uma empresa estabelecida.

#### TC-002: Consulta de CNPJ Válido - Empresa Recente

- **ID do Teste**: TC-002
- **Título**: Consulta de CNPJ válido de empresa com menos de 6 meses
- **Referência à User Story**: User Story 1.1, User Story 1.2, User Story 2.1
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa recente
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ de uma empresa recente no campo de entrada
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com menos de 6 meses de existência
- **Resultado Esperado**:
  - O sistema deve exibir os dados cadastrais da empresa
  - A data de abertura deve indicar menos de 6 meses
  - Deve existir um sinal de alerta indicando "Empresa recém-aberta"
  - O score deve ser penalizado em -10 pontos pelo critério "Empresa aberta há menos de 6 meses"
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema identifica corretamente a empresa como recente e aplica a penalização no score
  - Falha: O sistema não identifica a empresa como recente ou não aplica a penalização correta
- **Observações**: Este teste verifica a identificação de empresas recentes como fator de risco.

#### TC-003: Consulta de CNPJ Válido - Empresa com CNAE de Risco

- **ID do Teste**: TC-003
- **Título**: Consulta de CNPJ válido de empresa com CNAE de alto risco
- **Referência à User Story**: User Story 1.1, User Story 1.2, User Story 2.1
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa com CNAE de risco (ex: factoring)
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ da empresa com CNAE de risco
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com CNAE de alto risco
- **Resultado Esperado**:
  - O sistema deve exibir os dados cadastrais da empresa
  - Deve existir um sinal de alerta indicando "CNAE com risco associado"
  - O score deve ser penalizado em -10 pontos pelo critério "CNAE de risco"
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema identifica corretamente o CNAE de risco e aplica a penalização no score
  - Falha: O sistema não identifica o CNAE de risco ou não aplica a penalização correta
- **Observações**: Este teste verifica a identificação de CNAEs de risco como fator de risco.

#### TC-004: Consulta de CNPJ Válido - Empresa Inativa

- **ID do Teste**: TC-004
- **Título**: Consulta de CNPJ válido de empresa inativa ou suspensa
- **Referência à User Story**: User Story 1.1, User Story 1.2, User Story 2.1
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa inativa ou suspensa
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ da empresa inativa
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com situação cadastral "Inativa" ou "Suspensa"
- **Resultado Esperado**:
  - O sistema deve exibir os dados cadastrais da empresa
  - A situação cadastral deve ser "Inativa" ou "Suspensa"
  - Deve existir um sinal de alerta indicando "Situação cadastral irregular"
  - O score deve ser penalizado em -20 pontos pelo critério "Empresa inativa/suspensa"
  - A classificação de risco deve ser "Alto" com badge vermelho
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema identifica corretamente a situação cadastral irregular e aplica a penalização no score
  - Falha: O sistema não identifica a situação cadastral irregular ou não aplica a penalização correta
- **Observações**: Este teste verifica a identificação de empresas inativas como fator de alto risco.

#### TC-005: Consulta de CNPJ Inválido

- **ID do Teste**: TC-005
- **Título**: Tentativa de consulta com CNPJ em formato inválido
- **Referência à User Story**: User Story 1.1
- **Severidade**: Média
- **Pré-condições**: 
  - Sistema em execução
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir um valor inválido como "12345" no campo de CNPJ
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ inválido: "12345" (menos de 14 dígitos)
  - CNPJ inválido: "99.999.999/9999-99" (formato correto mas dígitos verificadores inválidos)
- **Resultado Esperado**:
  - O sistema deve validar o formato do CNPJ
  - Uma mensagem de erro clara deve ser exibida informando que o CNPJ é inválido
  - Nenhuma consulta à API deve ser realizada
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema rejeita o CNPJ inválido e exibe mensagem de erro apropriada
  - Falha: O sistema aceita o CNPJ inválido ou não exibe mensagem clara
- **Observações**: Este teste verifica a validação de entrada do CNPJ antes da consulta.

### 3.2. Testes de Análise de Risco

#### TC-006: Cálculo de Score para Empresa de Baixo Risco

- **ID do Teste**: TC-006
- **Título**: Verificação do cálculo de score para empresa de baixo risco
- **Referência à User Story**: User Story 2.1, User Story 2.2
- **Severidade**: Crítica
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa com critérios de baixo risco
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ da empresa de baixo risco
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com as seguintes características:
    - Situação cadastral ativa (+10 pontos)
    - Mais de 3 anos de operação (+10 pontos)
    - CNAE de baixo risco (+10 pontos)
- **Resultado Esperado**:
  - O score calculado deve ser exatamente 30 pontos
  - A classificação de risco deve ser "Baixo" com badge verde
  - Os critérios aplicados devem ser listados corretamente com suas pontuações
- **Critérios de Sucesso/Falha**:
  - Sucesso: O score é calculado corretamente como 30 e a classificação é "Baixo"
  - Falha: O score é calculado incorretamente ou a classificação é diferente de "Baixo"
- **Observações**: Este teste verifica a precisão do cálculo de score para empresas de baixo risco.

#### TC-007: Cálculo de Score para Empresa de Médio Risco

- **ID do Teste**: TC-007
- **Título**: Verificação do cálculo de score para empresa de médio risco
- **Referência à User Story**: User Story 2.1, User Story 2.2
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa com critérios de médio risco
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ da empresa de médio risco
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com as seguintes características:
    - Situação cadastral ativa (+10 pontos)
    - Menos de 3 anos de operação (0 pontos)
    - CNAE de risco (-10 pontos)
- **Resultado Esperado**:
  - O score calculado deve ser exatamente 0 pontos
  - A classificação de risco deve ser "Médio" com badge amarelo
  - Os critérios aplicados devem ser listados corretamente com suas pontuações
- **Critérios de Sucesso/Falha**:
  - Sucesso: O score é calculado corretamente como 0 e a classificação é "Médio"
  - Falha: O score é calculado incorretamente ou a classificação é diferente de "Médio"
- **Observações**: Este teste verifica a precisão do cálculo de score para empresas de médio risco.

#### TC-008: Cálculo de Score para Empresa de Alto Risco

- **ID do Teste**: TC-008
- **Título**: Verificação do cálculo de score para empresa de alto risco
- **Referência à User Story**: User Story 2.1, User Story 2.2
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - API de CNPJ acessível
  - CNPJ de teste para uma empresa com critérios de alto risco
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o CNPJ da empresa de alto risco
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ de uma empresa com as seguintes características:
    - Situação cadastral inativa/suspensa (-20 pontos)
    - Menos de 6 meses de operação (-10 pontos)
    - CNAE de risco (-10 pontos)
- **Resultado Esperado**:
  - O score calculado deve ser exatamente -40 pontos
  - A classificação de risco deve ser "Alto" com badge vermelho
  - Os critérios aplicados devem ser listados corretamente com suas pontuações
- **Critérios de Sucesso/Falha**:
  - Sucesso: O score é calculado corretamente como -40 e a classificação é "Alto"
  - Falha: O score é calculado incorretamente ou a classificação é diferente de "Alto"
- **Observações**: Este teste verifica a precisão do cálculo de score para empresas de alto risco.

### 3.3. Testes de Armazenamento e Cache

#### TC-009: Armazenamento de Consulta no Banco de Dados

- **ID do Teste**: TC-009
- **Título**: Verificação do armazenamento da consulta no banco de dados
- **Referência à User Story**: User Story 3.1
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - Banco de dados configurado e acessível
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir um CNPJ válido no campo de entrada
  3. Clicar no botão "Analisar Risco"
  4. Verificar no banco de dados se a consulta foi armazenada
- **Dados de Teste**:
  - CNPJ válido: "00.000.000/0001-91"
- **Resultado Esperado**:
  - A consulta deve ser armazenada no banco de dados
  - Os dados armazenados devem incluir:
    - CNPJ consultado
    - Data/hora da consulta
    - Dados obtidos da API
    - Score calculado
    - Classificação de risco
- **Critérios de Sucesso/Falha**:
  - Sucesso: A consulta é armazenada corretamente no banco de dados com todos os dados necessários
  - Falha: A consulta não é armazenada ou está incompleta
- **Observações**: Este teste verifica a funcionalidade de persistência de dados das consultas.

#### TC-010: Recuperação de Consulta em Cache

- **ID do Teste**: TC-010
- **Título**: Verificação da recuperação de consulta em cache
- **Referência à User Story**: User Story 3.2
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - Consulta prévia do CNPJ realizada há menos de 24 horas
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Inserir o mesmo CNPJ consultado anteriormente
  3. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ previamente consultado: "00.000.000/0001-91"
- **Resultado Esperado**:
  - O sistema deve recuperar os dados do banco de dados (cache)
  - Não deve realizar nova chamada à API externa
  - Uma notificação deve ser exibida informando que os dados são de uma consulta anterior
  - A data/hora da consulta original deve ser exibida
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema usa o cache e exibe a notificação adequada
  - Falha: O sistema faz nova chamada à API ou não informa sobre o uso de cache
- **Observações**: Este teste verifica a funcionalidade de cache para consultas repetidas.

### 3.4. Testes de Interface

#### TC-011: Responsividade da Interface

- **ID do Teste**: TC-011
- **Título**: Verificação da responsividade da interface em diferentes tamanhos de tela
- **Referência à User Story**: RNF-06
- **Severidade**: Média
- **Pré-condições**: 
  - Sistema em execução
- **Passos para Execução**:
  1. Acessar a página inicial do sistema em um desktop (> 1200px)
  2. Redimensionar a janela para tamanho de tablet (768px-992px)
  3. Redimensionar a janela para tamanho de smartphone (< 576px)
  4. Em cada tamanho, verificar a disposição dos elementos
- **Dados de Teste**: N/A
- **Resultado Esperado**:
  - A interface deve se adaptar adequadamente a cada tamanho de tela
  - Todos os elementos devem permanecer visíveis e utilizáveis
  - Não deve haver sobreposição de elementos ou textos cortados
- **Critérios de Sucesso/Falha**:
  - Sucesso: A interface se adapta corretamente a todos os tamanhos de tela
  - Falha: Elementos são cortados, sobrepostos ou inacessíveis em algum tamanho de tela
- **Observações**: Este teste verifica a responsividade da interface em diferentes dispositivos.

#### TC-012: Usabilidade do Formulário

- **ID do Teste**: TC-012
- **Título**: Verificação da usabilidade do formulário de consulta
- **Referência à User Story**: User Story 1.1, RNF-08
- **Severidade**: Média
- **Pré-condições**: 
  - Sistema em execução
- **Passos para Execução**:
  1. Acessar a página inicial do sistema
  2. Verificar o campo de entrada de CNPJ
  3. Digitar um CNPJ no campo
  4. Verificar a formatação automática
  5. Limpar o campo usando o botão "Limpar"
- **Dados de Teste**:
  - CNPJ para digitação: "00000000000191"
- **Resultado Esperado**:
  - O campo deve aceitar apenas números
  - O CNPJ deve ser formatado automaticamente (00.000.000/0001-91)
  - O botão "Limpar" deve resetar o formulário e quaisquer resultados exibidos
  - O formulário deve ter foco visual adequado
- **Critérios de Sucesso/Falha**:
  - Sucesso: O formulário é intuitivo, formata corretamente e funciona como esperado
  - Falha: Problemas de formatação, usabilidade ou funcionamento incorreto
- **Observações**: Este teste verifica a usabilidade e comportamento do formulário principal.

### 3.5. Testes de Cenários Especiais

#### TC-013: Indisponibilidade da API Externa

- **ID do Teste**: TC-013
- **Título**: Comportamento do sistema durante indisponibilidade da API externa
- **Referência à User Story**: RNF-10, RNF-11
- **Severidade**: Alta
- **Pré-condições**: 
  - Sistema em execução
  - Simulação de indisponibilidade da API externa
- **Passos para Execução**:
  1. Configurar o sistema para simular falha na API externa
  2. Acessar a página inicial do sistema
  3. Inserir um CNPJ válido no campo de entrada
  4. Clicar no botão "Analisar Risco"
- **Dados de Teste**:
  - CNPJ válido: "00.000.000/0001-91"
- **Resultado Esperado**:
  - O sistema deve detectar a falha na API
  - Uma mensagem de erro clara deve ser exibida ao usuário
  - A mensagem deve sugerir tentar novamente mais tarde
  - O erro deve ser registrado nos logs da aplicação
- **Critérios de Sucesso/Falha**:
  - Sucesso: O sistema trata adequadamente a indisponibilidade da API
  - Falha: O sistema trava, exibe mensagem técnica ou não fornece orientação ao usuário
- **Observações**: Este teste verifica a resiliência do sistema a falhas externas.

#### TC-014: Tempo de Resposta da Aplicação

- **ID do Teste**: TC-014
- **Título**: Verificação do tempo de resposta da aplicação
- **Referência à User Story**: RNF-01, RNF-02
- **Severidade**: Média
- **Pré-condições**: 
  - Sistema em execução
  - Ferramenta de medição de tempo de resposta configurada
- **Passos para Execução**:
  1. Iniciar a medição de tempo
  2. Acessar a página inicial do sistema
  3. Inserir um CNPJ válido no campo de entrada
  4. Clicar no botão "Analisar Risco"
  5. Aguardar o carregamento completo dos resultados
  6. Finalizar a medição de tempo
- **Dados de Teste**:
  - CNPJ válido: "00.000.000/0001-91"
- **Resultado Esperado**:
  - O tempo de resposta para consulta à API externa não deve exceder 5 segundos
  - O tempo total para processar e exibir o resultado não deve exceder 8 segundos
  - Durante o carregamento, deve haver um indicador visual de progresso
- **Critérios de Sucesso/Falha**:
  - Sucesso: Os tempos de resposta estão dentro dos limites especificados
  - Falha: Os tempos de resposta excedem os limites ou não há feedback visual durante o carregamento
- **Observações**: Este teste verifica os requisitos de performance do sistema.

## 4. Testes de Carga e Limites

#### TC-015: Consultas Simultâneas

- **ID do Teste**: TC-015
- **Título**: Comportamento do sistema com múltiplas consultas simultâneas
- **Referência à User Story**: RNF-03
- **Severidade**: Média
- **Pré-condições**: 
  - Sistema em execução
  - Ferramenta de teste de carga configurada
- **Passos para Execução**:
  1. Configurar teste de carga para simular 100 usuários simultâneos
  2. Executar consultas de diferentes CNPJs
  3. Monitorar o comportamento do sistema
- **Dados de Teste**:
  - Lista de 100 CNPJs válidos
- **Resultado Esperado**:
  - O sistema deve processar todas as consultas sem erros
  - Não deve haver degradação significativa de performance
  - O tempo médio de resposta não deve aumentar mais que 50%
- **Critérios de Sucesso/Falha**:
  - Sucesso: Todas as consultas são processadas corretamente sem degradação significativa
  - Falha: Erros nas consultas, timeouts ou degradação severa de performance
- **Observações**: Este teste verifica a capacidade do sistema de lidar com múltiplos usuários simultâneos.

## 5. Matriz de Rastreabilidade

A tabela abaixo mapeia os requisitos e user stories aos casos de teste:

| Requisito/User Story | Casos de Teste |
|----------------------|----------------|
| User Story 1.1 (Inserir CNPJ) | TC-001, TC-002, TC-003, TC-004, TC-005, TC-012 |
| User Story 1.2 (Visualizar dados) | TC-001, TC-002, TC-003, TC-004 |
| User Story 2.1 (Calcular score) | TC-002, TC-003, TC-004, TC-006, TC-007, TC-008 |
| User Story 2.2 (Visualizar classificação) | TC-006, TC-007, TC-008 |
| User Story 3.1 (Armazenar consultas) | TC-009 |
| User Story 3.2 (Utilizar cache) | TC-010 |
| RNF-01, RNF-02 (Tempo de resposta) | TC-014 |
| RNF-03 (Consultas simultâneas) | TC-015 |
| RNF-06 (Responsividade) | TC-011 |
| RNF-08 (Apresentação visual) | TC-012 |
| RNF-10, RNF-11 (Tratamento de falhas) | TC-013 |

## 6. Priorização dos Testes

### 6.1. Testes Críticos (Prioridade 1)
- TC-001: Consulta de CNPJ Válido - Empresa Ativa e Antiga
- TC-006: Cálculo de Score para Empresa de Baixo Risco
- TC-008: Cálculo de Score para Empresa de Alto Risco
- TC-013: Indisponibilidade da API Externa

### 6.2. Testes de Alta Prioridade (Prioridade 2)
- TC-002: Consulta de CNPJ Válido - Empresa Recente
- TC-003: Consulta de CNPJ Válido - Empresa com CNAE de Risco
- TC-004: Consulta de CNPJ Válido - Empresa Inativa
- TC-007: Cálculo de Score para Empresa de Médio Risco
- TC-009: Armazenamento de Consulta no Banco de Dados
- TC-010: Recuperação de Consulta em Cache

### 6.3. Testes de Média Prioridade (Prioridade 3)
- TC-005: Consulta de CNPJ Inválido
- TC-011: Responsividade da Interface
- TC-012: Usabilidade do Formulário
- TC-014: Tempo de Resposta da Aplicação
- TC-015: Consultas Simultâneas

## 7. Considerações Finais

### 7.1. Riscos Identificados

- **Dependência da API Externa**: O sistema depende fortemente da disponibilidade e precisão da API de CNPJ.
- **Qualidade dos Dados**: A análise de risco é tão boa quanto os dados recebidos da API.
- **Variações de Performance**: Tempos de resposta podem variar dependendo da carga na API externa.

### 7.2. Recomendações

- **Testes Contínuos**: Executar testes regularmente para garantir que mudanças na API externa não afetem o sistema.
- **Monitoramento em Produção**: Implementar monitoramento ativo para detectar problemas de disponibilidade ou performance.
- **Aprimoramento do Cache**: Considerar estratégias mais avançadas de cache para reduzir dependência da API externa.
- **Validação dos Critérios de Risco**: Revisar periodicamente os critérios de avaliação de risco para garantir sua relevância.

### 7.3. Próximos Passos

- Automatizar os casos de teste para execução contínua
- Desenvolver testes de regressão para garantir estabilidade em atualizações futuras
- Implementar testes de segurança para validar proteção contra vulnerabilidades comuns
- Conduzir testes de usabilidade com usuários reais para identificar melhorias na interface

## 8. Aprovações

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| QA Analyst | | | |
| Product Owner | | | |
| Team Leader | | | |