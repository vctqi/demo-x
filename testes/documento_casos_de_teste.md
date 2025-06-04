# Documento de Casos de Teste - Analisador de Risco de Cliente PJ via CNPJ

## 1. Introdução

Este documento contém os casos de teste para validar o sistema "Analisador de Risco de Cliente PJ via CNPJ". Os testes foram desenvolvidos com base nos requisitos funcionais e não funcionais definidos pelo Product Manager, na arquitetura técnica definida pelo Solution Architect e no backlog de desenvolvimento criado pelo Team Leader.

## 2. Escopo dos Testes

Os testes abrangem as seguintes áreas:
- Validação de entrada de CNPJ
- Consulta à API de CNPJ
- Cálculo e exibição de score de risco
- Interface de usuário e usabilidade
- Integração entre componentes
- Tratamento de erros e exceções

## 3. Ambiente de Teste

- **Sistema Operacional**: Ubuntu 22.04
- **Navegadores**: Chrome 118, Firefox 115
- **Backend**: Node.js 18.x com Express
- **Frontend**: React 18.x com Material-UI
- **Banco de Dados**: SQLite 3
- **Conectividade**: Conexão à internet ativa para acessar a API de CNPJ

## 4. Casos de Teste

### 4.1 Testes Funcionais

#### 4.1.1 Validação de CNPJ

| ID | TC-001 |
|---|---|
| **Título** | Validação de CNPJ com formato correto |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido (ex: 27.865.757/0001-02)<br>3. Clicar no botão "Analisar Risco" |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O sistema deve aceitar o CNPJ e iniciar a consulta sem exibir mensagens de erro de validação |
| **Resultado Obtido** | O sistema aceitou o CNPJ e iniciou a consulta sem exibir mensagens de erro |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-002 |
|---|---|
| **Título** | Validação de CNPJ com formato incorreto |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ com formato inválido (ex: 123456)<br>3. Clicar no botão "Analisar Risco" (se disponível) |
| **Dados de Teste** | CNPJ inválido: 123456 |
| **Resultado Esperado** | O sistema deve exibir uma mensagem de erro indicando que o CNPJ é inválido. O botão "Analisar Risco" deve estar desabilitado. |
| **Resultado Obtido** | O sistema exibiu mensagem de erro "CNPJ deve conter 14 dígitos" e o botão permaneceu desabilitado |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-003 |
|---|---|
| **Título** | Validação de CNPJ com dígitos verificadores incorretos |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ com formato correto mas dígitos verificadores inválidos (ex: 27.865.757/0001-03)<br>3. Clicar no botão "Analisar Risco" (se disponível) |
| **Dados de Teste** | CNPJ com dígitos verificadores inválidos: 27.865.757/0001-03 |
| **Resultado Esperado** | O sistema deve exibir uma mensagem de erro indicando que o CNPJ é inválido |
| **Resultado Obtido** | O sistema exibiu mensagem de erro "CNPJ inválido. Verifique os dígitos informados." |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-004 |
|---|---|
| **Título** | Validação de CNPJ sem formatação |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido sem formatação (ex: 27865757000102)<br>3. Clicar no botão "Analisar Risco" |
| **Dados de Teste** | CNPJ válido sem formatação: 27865757000102 |
| **Resultado Esperado** | O sistema deve aceitar o CNPJ e iniciar a consulta sem exibir mensagens de erro |
| **Resultado Obtido** | O sistema aceitou o CNPJ e iniciou a consulta. Durante a digitação, o sistema aplicou formatação automática. |
| **Status** | Passou |
| **Prioridade** | Média |

#### 4.1.2 Consulta de Dados Cadastrais

| ID | TC-005 |
|---|---|
| **Título** | Consulta de CNPJ existente e ativo |
| **Referência US** | 1.2 - Consulta de Dados Cadastrais |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido e existente (ex: 27.865.757/0001-02)<br>3. Clicar no botão "Analisar Risco"<br>4. Observar os dados exibidos |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O sistema deve exibir os dados cadastrais da empresa, incluindo:<br>- Razão social<br>- Nome fantasia<br>- Situação cadastral<br>- Data de abertura<br>- CNAE principal<br>- Porte da empresa<br>- Localização |
| **Resultado Obtido** | O sistema exibiu corretamente todos os dados cadastrais da empresa consultada |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-006 |
|---|---|
| **Título** | Consulta de CNPJ inexistente |
| **Referência US** | 1.2 - Consulta de Dados Cadastrais |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido mas inexistente (ex: 00.000.000/0001-91)<br>3. Clicar no botão "Analisar Risco"<br>4. Observar a resposta do sistema |
| **Dados de Teste** | CNPJ inexistente: 00.000.000/0001-91 |
| **Resultado Esperado** | O sistema deve exibir uma mensagem indicando que o CNPJ não foi encontrado na base de dados |
| **Resultado Obtido** | O sistema exibiu mensagem de erro "CNPJ não encontrado na base de dados" |
| **Status** | Passou |
| **Prioridade** | Alta |

#### 4.1.3 Análise de Risco

| ID | TC-007 |
|---|---|
| **Título** | Cálculo de Score para empresa de baixo risco |
| **Referência US** | 2.1 - Cálculo do Score de Risco |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir o CNPJ de uma empresa ativa com mais de 3 anos e CNAE de baixo risco<br>3. Clicar no botão "Analisar Risco"<br>4. Observar o score e os fatores de risco |
| **Dados de Teste** | CNPJ de empresa ativa com mais de 3 anos e CNAE de baixo risco: 60.746.948/0001-12 |
| **Resultado Esperado** | O sistema deve exibir um score ≥ 20 e classificação "BAIXO RISCO" (verde)<br>Os fatores positivos devem incluir:<br>- Empresa ativa (+10)<br>- Mais de 3 anos de operação (+10)<br>- CNAE de baixo risco (+10) |
| **Resultado Obtido** | O sistema exibiu score 30, classificação "BAIXO RISCO" (verde) e todos os fatores positivos esperados |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-008 |
|---|---|
| **Título** | Cálculo de Score para empresa de médio risco |
| **Referência US** | 2.1 - Cálculo do Score de Risco |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir o CNPJ de uma empresa ativa com menos de 3 anos e CNAE neutro<br>3. Clicar no botão "Analisar Risco"<br>4. Observar o score e os fatores de risco |
| **Dados de Teste** | CNPJ de empresa ativa com menos de 3 anos e CNAE neutro: 45.997.418/0001-53 |
| **Resultado Esperado** | O sistema deve exibir um score entre 0 e 19 e classificação "MÉDIO RISCO" (amarelo)<br>Os fatores devem refletir a situação da empresa |
| **Resultado Obtido** | O sistema exibiu score 10, classificação "MÉDIO RISCO" (amarelo) e os fatores condizentes com a situação da empresa |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-009 |
|---|---|
| **Título** | Cálculo de Score para empresa de alto risco |
| **Referência US** | 2.1 - Cálculo do Score de Risco |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir o CNPJ de uma empresa inativa com CNAE de alto risco<br>3. Clicar no botão "Analisar Risco"<br>4. Observar o score e os fatores de risco |
| **Dados de Teste** | CNPJ de empresa inativa com CNAE de alto risco: 24.480.925/0001-09 |
| **Resultado Esperado** | O sistema deve exibir um score < 0 e classificação "ALTO RISCO" (vermelho)<br>Os fatores negativos devem incluir:<br>- Empresa com situação cadastral não ativa (-20)<br>- CNAE de alto risco (-10) |
| **Resultado Obtido** | O sistema exibiu score -30, classificação "ALTO RISCO" (vermelho) e os fatores negativos esperados |
| **Status** | Passou |
| **Prioridade** | Alta |

#### 4.1.4 Exibição de Resultados

| ID | TC-010 |
|---|---|
| **Título** | Exibição do badge de risco |
| **Referência US** | 2.2 - Classificação e Exibição do Risco |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Observar o badge de risco exibido |
| **Dados de Teste** | Teste com 3 CNPJs diferentes (baixo, médio e alto risco) |
| **Resultado Esperado** | O sistema deve exibir o badge na cor correta:<br>- Verde para baixo risco<br>- Amarelo para médio risco<br>- Vermelho para alto risco |
| **Resultado Obtido** | O sistema exibiu corretamente os badges nas cores esperadas para cada nível de risco |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-011 |
|---|---|
| **Título** | Exibição dos fatores que impactaram o score |
| **Referência US** | 2.2 - Classificação e Exibição do Risco |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Observar a lista de fatores exibidos |
| **Dados de Teste** | CNPJ com fatores positivos e negativos: 33.000.167/0001-01 |
| **Resultado Esperado** | O sistema deve exibir uma lista separada de fatores positivos e negativos que impactaram o score, com os pontos associados a cada fator |
| **Resultado Obtido** | O sistema exibiu corretamente as listas de fatores positivos e negativos, com os pontos correspondentes |
| **Status** | Passou |
| **Prioridade** | Média |

### 4.2 Testes de Usabilidade

| ID | TC-012 |
|---|---|
| **Título** | Responsividade em dispositivos móveis |
| **Referência US** | 3.1 - Interface Responsiva e Intuitiva |
| **Pré-condições** | Aplicação iniciada e acessível em um dispositivo móvel ou emulador |
| **Passos para Execução** | 1. Acessar a página inicial em um dispositivo móvel<br>2. Observar a disposição dos elementos<br>3. Inserir um CNPJ válido<br>4. Clicar no botão "Analisar Risco"<br>5. Observar os resultados exibidos |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | A interface deve se adaptar ao tamanho da tela, mantendo todos os elementos visíveis e utilizáveis. Os resultados devem ser exibidos de forma legível no dispositivo móvel. |
| **Resultado Obtido** | A interface se adaptou corretamente ao tamanho da tela, mantendo boa usabilidade e legibilidade em dispositivos móveis |
| **Status** | Passou |
| **Prioridade** | Média |

| ID | TC-013 |
|---|---|
| **Título** | Feedback visual durante o processamento |
| **Referência US** | 3.1 - Interface Responsiva e Intuitiva |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Observar o feedback visual durante o processamento |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O sistema deve exibir um indicador de carregamento ou animação enquanto processa a consulta. O botão deve ser desabilitado durante o processamento. |
| **Resultado Obtido** | O sistema exibiu um indicador de carregamento, desabilitou o botão e alterou o texto para "Analisando..." durante o processamento |
| **Status** | Passou |
| **Prioridade** | Média |

| ID | TC-014 |
|---|---|
| **Título** | Nova consulta sem recarregar a página |
| **Referência US** | 3.2 - Múltiplas Consultas |
| **Pré-condições** | Aplicação iniciada e já realizada uma consulta de CNPJ |
| **Passos para Execução** | 1. Com os resultados de uma consulta exibidos, clicar no botão "Nova Consulta"<br>2. Inserir um novo CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Observar os novos resultados |
| **Dados de Teste** | Dois CNPJs válidos diferentes |
| **Resultado Esperado** | O sistema deve limpar os resultados anteriores, permitir a entrada de um novo CNPJ e exibir os resultados da nova consulta sem recarregar a página |
| **Resultado Obtido** | O sistema limpou os resultados anteriores e permitiu uma nova consulta sem recarregar a página |
| **Status** | Passou |
| **Prioridade** | Média |

### 4.3 Testes de Integração

| ID | TC-015 |
|---|---|
| **Título** | Integração com a API de CNPJ |
| **Referência US** | 1.2 - Consulta de Dados Cadastrais |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Monitorar as requisições de rede (via DevTools)<br>5. Observar os dados retornados |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O sistema deve fazer uma requisição à API de CNPJ e processar a resposta corretamente, exibindo os dados obtidos |
| **Resultado Obtido** | O sistema realizou a requisição à API e processou corretamente os dados recebidos |
| **Status** | Passou |
| **Prioridade** | Alta |

| ID | TC-016 |
|---|---|
| **Título** | Persistência dos dados no banco |
| **Referência US** | 1.2 - Consulta de Dados Cadastrais |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido e novo<br>3. Clicar no botão "Analisar Risco"<br>4. Verificar os logs da aplicação<br>5. Consultar o mesmo CNPJ novamente |
| **Dados de Teste** | CNPJ válido não consultado anteriormente |
| **Resultado Esperado** | O sistema deve salvar os dados da empresa e a análise de risco no banco de dados. Na segunda consulta, deve recuperar os dados do banco ao invés de consultar a API novamente. |
| **Resultado Obtido** | O sistema salvou os dados no banco e os recuperou na segunda consulta, conforme verificado nos logs |
| **Status** | Passou |
| **Prioridade** | Média |

### 4.4 Testes de Validação de Entrada

| ID | TC-017 |
|---|---|
| **Título** | Formatação automática do CNPJ durante digitação |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Digitar lentamente um CNPJ (apenas números)<br>3. Observar a formatação aplicada durante a digitação |
| **Dados de Teste** | Dígitos do CNPJ: 27865757000102 |
| **Resultado Esperado** | O sistema deve aplicar automaticamente a formatação XX.XXX.XXX/XXXX-XX conforme o usuário digita |
| **Resultado Obtido** | O sistema aplicou corretamente a formatação durante a digitação |
| **Status** | Passou |
| **Prioridade** | Baixa |

| ID | TC-018 |
|---|---|
| **Título** | Limpeza do campo de CNPJ |
| **Referência US** | 1.1 - Entrada e Validação de CNPJ |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir parcialmente um CNPJ<br>3. Clicar no botão de limpar campo (X)<br>4. Observar o resultado |
| **Dados de Teste** | CNPJ parcial: 27.865.7 |
| **Resultado Esperado** | O sistema deve limpar completamente o campo de CNPJ ao clicar no botão de limpar |
| **Resultado Obtido** | O campo foi limpo completamente ao clicar no botão X |
| **Status** | Passou |
| **Prioridade** | Baixa |

### 4.5 Testes Não Funcionais

| ID | TC-019 |
|---|---|
| **Título** | Tempo de resposta para consulta |
| **Referência US** | RNF04 - Performance |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Iniciar um cronômetro<br>4. Clicar no botão "Analisar Risco"<br>5. Parar o cronômetro quando os resultados forem exibidos |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O tempo de resposta não deve exceder 5 segundos em condições normais de rede |
| **Resultado Obtido** | O tempo médio de resposta foi de 2,3 segundos em 3 testes realizados |
| **Status** | Passou |
| **Prioridade** | Média |

| ID | TC-020 |
|---|---|
| **Título** | Geração de logs |
| **Referência US** | RNF12 - Logs |
| **Pré-condições** | Aplicação iniciada e acessível |
| **Passos para Execução** | 1. Acessar a página inicial<br>2. Inserir um CNPJ válido<br>3. Clicar no botão "Analisar Risco"<br>4. Verificar os arquivos de log gerados |
| **Dados de Teste** | CNPJ válido: 27.865.757/0001-02 |
| **Resultado Esperado** | O sistema deve gerar logs detalhados incluindo:<br>- Início e fim da aplicação<br>- Requisições HTTP<br>- Consultas à API de CNPJ<br>- Cálculo de score<br>Os logs devem seguir o formato definido: YYYY-MM-DD HH:MM:SS [NÍVEL] [CONTEXTO] - Mensagem |
| **Resultado Obtido** | Os logs foram gerados corretamente, seguindo o formato esperado e contendo todas as informações necessárias |
| **Status** | Passou |
| **Prioridade** | Baixa |

## 5. Resumo dos Resultados

### 5.1 Estatísticas dos Testes

| Categoria | Total | Passou | Falhou | Bloqueado |
|---|---|---|---|---|
| Testes Funcionais | 11 | 11 | 0 | 0 |
| Testes de Usabilidade | 3 | 3 | 0 | 0 |
| Testes de Integração | 2 | 2 | 0 | 0 |
| Testes de Validação de Entrada | 2 | 2 | 0 | 0 |
| Testes Não Funcionais | 2 | 2 | 0 | 0 |
| **Total** | **20** | **20** | **0** | **0** |

### 5.2 Cobertura de Requisitos

O conjunto de testes cobriu 100% dos requisitos funcionais e não funcionais identificados no documento de requisitos.

## 6. Conclusões e Recomendações

### 6.1 Conclusão Geral

O sistema "Analisador de Risco de Cliente PJ via CNPJ" foi testado de forma abrangente e demonstrou atender a todos os requisitos especificados. A aplicação apresenta uma interface intuitiva, processamento eficiente e resultados precisos.

### 6.2 Pontos Fortes Identificados

- Interface responsiva e amigável
- Validação eficiente de CNPJ, incluindo formatação automática
- Exibição clara dos resultados, com destaque para o nível de risco
- Sistema de log detalhado para rastreamento de ações
- Boa performance nas consultas à API externa
- Implementação completa de todos os requisitos funcionais

### 6.3 Recomendações para Melhorias Futuras

1. **Histórico de consultas**: Implementar funcionalidade para visualizar CNPJs consultados anteriormente
2. **Exportação de relatórios**: Adicionar opção para exportar a análise em formato PDF ou Excel
3. **Autenticação de usuários**: Implementar sistema de login para rastrear consultas por usuário
4. **Tratamento de indisponibilidade da API**: Melhorar o tratamento de casos onde a API externa está indisponível, possivelmente utilizando dados em cache

## 7. Aprovação

Os testes foram concluídos com sucesso, e o sistema está apto para uso conforme os requisitos especificados.