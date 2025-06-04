# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral do Produto

O **Analisador de Risco de Cliente PJ via CNPJ** é uma ferramenta que permite aos usuários inserir o número de CNPJ de uma empresa e obter uma análise simplificada de risco, baseada em dados públicos e critérios predefinidos. O sistema consulta informações públicas sobre a empresa, aplica regras de análise de risco e apresenta uma classificação clara e visual para o usuário.

### 1.1 Objetivo Principal
Fornecer uma ferramenta rápida e confiável para análise preliminar de risco de clientes pessoa jurídica, auxiliando na tomada de decisão para concessão de crédito, estabelecimento de parcerias ou qualquer outra atividade que envolva avaliação de risco empresarial.

### 1.2 Público-Alvo
- Analistas de crédito
- Gestores comerciais
- Profissionais de compliance
- Empresas que precisam avaliar fornecedores ou parceiros

## 2. Requisitos Funcionais

### 2.1 Entrada de Dados
- O sistema deve permitir que o usuário digite um número de CNPJ no formato XX.XXX.XXX/XXXX-XX ou apenas os números.
- O sistema deve validar se o formato e o dígito verificador do CNPJ estão corretos antes de processar a consulta.
- O sistema deve oferecer um botão claro para iniciar a análise após a inserção do CNPJ.
- O sistema deve permitir limpar o campo para iniciar uma nova consulta.

### 2.2 Processamento de Dados
- O sistema deve consultar a API pública de CNPJ (https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj) para obter dados cadastrais da empresa.
- O sistema deve extrair especificamente as seguintes informações:
  - Situação cadastral (ativa, inativa, suspensa, baixada)
  - Data de abertura
  - CNAE principal (código e descrição)
  - Porte da empresa
  - Localização (cidade e estado)
- O sistema deve calcular o tempo de operação da empresa (em anos e meses) com base na data de abertura.
- O sistema deve classificar o CNAE principal como baixo, médio ou alto risco conforme uma tabela predefinida.
- O sistema deve calcular um score de risco baseado nos critérios definidos na seção 4.

### 2.3 Exibição de Resultados
- O sistema deve apresentar um dashboard com os dados cadastrais obtidos da empresa.
- O sistema deve exibir uma classificação visual de risco (badge) nas cores:
  - Verde para baixo risco
  - Amarelo para médio risco
  - Vermelho para alto risco
- O sistema deve mostrar quais critérios contribuíram positivamente e negativamente para o score final.
- O sistema deve permitir que o usuário veja o detalhamento do cálculo do score.
- O sistema deve exibir claramente mensagens de alerta quando identificar sinais de risco elevado.

### 2.4 Tratamento de Erros
- O sistema deve exibir mensagens claras quando o CNPJ não for encontrado na base de dados.
- O sistema deve informar de maneira amigável sobre problemas de conexão com a API.
- O sistema deve oferecer sugestões de correção quando o CNPJ for inválido.
- O sistema deve permitir tentar novamente em caso de falha na consulta.

## 3. Requisitos Não Funcionais

### 3.1 Requisitos de Performance
- O tempo de resposta para a consulta e análise não deve ultrapassar 5 segundos em condições normais de conexão.
- O sistema deve ser capaz de processar múltiplas consultas simultâneas sem degradação significativa de performance.
- O sistema deve utilizar estratégias de cache para melhorar a performance de consultas repetidas.

### 3.2 Requisitos de Segurança
- O sistema não deve armazenar dados sensíveis que não sejam públicos.
- O sistema deve implementar proteção contra ataques de injeção e outros vetores comuns.
- O sistema deve limitar o número de consultas por IP para evitar abusos.

### 3.3 Requisitos de Usabilidade
- A interface deve ser intuitiva e de fácil utilização, mesmo para usuários não técnicos.
- O sistema deve ser responsivo, funcionando adequadamente em diferentes tamanhos de tela.
- As informações devem ser apresentadas de forma clara e organizada, priorizando os dados mais relevantes.
- O código de cores para classificação de risco deve seguir convenções intuitivas (verde, amarelo, vermelho).

### 3.4 Requisitos de Manutenibilidade
- O código deve ser bem documentado e seguir padrões de desenvolvimento claros.
- A arquitetura deve permitir fácil atualização dos critérios de pontuação.
- O sistema deve permitir a adição de novos critérios de análise no futuro.

### 3.5 Requisitos de Escalabilidade
- A arquitetura deve suportar crescimento no volume de consultas.
- O sistema deve ser capaz de incorporar novas fontes de dados no futuro.

## 4. Critérios para Cálculo do Score de Risco

| Critério                             | Pontuação |
| ------------------------------------ | --------- |
| Empresa com situação ativa           | +10       |
| Mais de 3 anos de operação           | +10       |
| CNAE de baixo risco                  | +10       |
| CNAE de médio risco                  | +0        |
| CNAE de alto risco (ex.: factoring)  | -10       |
| Empresa inativa/suspensa/baixada     | -20       |
| Empresa aberta há menos de 6 meses   | -10       |
| Empresa aberta entre 6 meses e 1 ano | -5        |

### 4.1 Classificação Final de Risco
- 20 ou mais pontos: Baixo risco (verde)
- Entre 0 e 19 pontos: Médio risco (amarelo)
- Abaixo de 0: Alto risco (vermelho)

### 4.2 Tabela de Classificação de CNAEs
O sistema deve conter uma tabela de classificação dos principais CNAEs em três categorias:
- Baixo risco: Atividades tradicionais com baixa taxa de inadimplência (ex.: serviços profissionais estabelecidos)
- Médio risco: Atividades com risco moderado (ex.: comércio varejista geral)
- Alto risco: Atividades com histórico de alta volatilidade ou inadimplência (ex.: factoring, construção civil)

## 5. Épicos e User Stories

### Épico 1: Consulta de CNPJ
- **User Story 1.1:** Como usuário, quero inserir um CNPJ para consulta, para que eu possa obter informações sobre uma empresa específica.
  - **Critérios de Aceitação:**
    1. O sistema deve aceitar entrada de CNPJ com ou sem formatação.
    2. O sistema deve validar o formato e dígito verificador do CNPJ.
    3. O sistema deve exibir mensagem de erro clara caso o CNPJ seja inválido.
    4. O campo deve permitir apenas números e caracteres especiais válidos para CNPJ.

- **User Story 1.2:** Como usuário, quero visualizar os dados cadastrais básicos da empresa consultada, para conhecer suas informações fundamentais.
  - **Critérios de Aceitação:**
    1. O sistema deve exibir nome, situação cadastral, data de abertura, CNAE e porte da empresa.
    2. O sistema deve formatar as informações de maneira legível e organizada.
    3. O sistema deve indicar claramente quando uma informação não estiver disponível.
    4. O sistema deve calcular e exibir o tempo de operação da empresa em anos e meses.

### Épico 2: Análise de Risco
- **User Story 2.1:** Como usuário, quero que o sistema calcule automaticamente um score de risco para a empresa consultada, para que eu tenha uma avaliação objetiva.
  - **Critérios de Aceitação:**
    1. O sistema deve aplicar corretamente todos os critérios de pontuação definidos.
    2. O cálculo deve ser feito automaticamente após a consulta bem-sucedida.
    3. O sistema deve armazenar temporariamente o score calculado para exibição.
    4. O sistema deve recalcular o score caso novas informações sejam obtidas.

- **User Story 2.2:** Como usuário, quero ver os fatores que influenciaram positivamente e negativamente o score, para entender como a classificação foi determinada.
  - **Critérios de Aceitação:**
    1. O sistema deve listar todos os critérios aplicados no cálculo.
    2. O sistema deve indicar a pontuação de cada critério.
    3. O sistema deve separar visualmente os fatores positivos e negativos.
    4. O sistema deve permitir expandir ou recolher esta seção para melhor visualização.

### Épico 3: Visualização de Resultados
- **User Story 3.1:** Como usuário, quero visualizar um badge colorido indicando o nível de risco, para identificar rapidamente a classificação.
  - **Critérios de Aceitação:**
    1. O badge deve seguir o código de cores definido (verde, amarelo, vermelho).
    2. O badge deve ter tamanho adequado para destaque na interface.
    3. O badge deve incluir texto descritivo (ex.: "Baixo Risco").
    4. O badge deve ser posicionado em local de destaque na interface.

- **User Story 3.2:** Como usuário, quero um dashboard organizado com todas as informações relevantes, para ter uma visão completa da análise.
  - **Critérios de Aceitação:**
    1. O dashboard deve apresentar uma organização lógica das informações.
    2. Deve haver separação clara entre dados cadastrais e análise de risco.
    3. O dashboard deve ser responsivo, adaptando-se a diferentes tamanhos de tela.
    4. Informações críticas devem ter destaque visual apropriado.

### Épico 4: Gerenciamento de Erros e Exceções
- **User Story 4.1:** Como usuário, quero receber notificações claras quando ocorrerem erros na consulta, para saber como proceder.
  - **Critérios de Aceitação:**
    1. O sistema deve identificar e informar quando o CNPJ não for encontrado.
    2. O sistema deve notificar sobre problemas de conexão com a API.
    3. As mensagens de erro devem ser em linguagem clara e não técnica.
    4. O sistema deve oferecer sugestões de ação para resolução de problemas comuns.

- **User Story 4.2:** Como usuário, quero poder tentar novamente após um erro, sem precisar reinserir todos os dados.
  - **Critérios de Aceitação:**
    1. O sistema deve manter o CNPJ no campo após uma falha na consulta.
    2. O sistema deve fornecer um botão de "Tentar Novamente" em caso de erros.
    3. O sistema deve limpar eventuais resultados parciais antes de uma nova tentativa.
    4. O sistema deve permitir editar o CNPJ antes de tentar novamente.

## 6. Definição de MVP (Minimum Viable Product)

O MVP deve incluir as seguintes funcionalidades:

1. Campo para inserção e validação de CNPJ
2. Consulta básica à API pública de CNPJ
3. Exibição de dados cadastrais da empresa
4. Cálculo de score baseado nos critérios essenciais:
   - Situação cadastral
   - Tempo de operação
   - Classificação básica de CNAE
5. Badge visual indicando a classificação de risco
6. Tratamento básico de erros de consulta

## 7. Requisitos de Integração

### 7.1 API Pública de Consulta de CNPJ
- **Endpoint Principal:** https://publica.cnpj.ws/cnpj/{cnpj} (conforme documentação oficial)
- **Método:** GET
- **Formato de Resposta:** JSON
- **Dados Esperados:**
  - `razao_social`: Nome oficial da empresa
  - `estabelecimento.situacao_cadastral`: Situação atual (ativa, suspensa, etc.)
  - `estabelecimento.data_inicio_atividade`: Data de abertura
  - `estabelecimento.atividade_principal.codigo`: Código CNAE principal
  - `estabelecimento.atividade_principal.descricao`: Descrição do CNAE
  - `porte.descricao`: Porte da empresa
  - `estabelecimento.cidade.nome`: Cidade
  - `estabelecimento.estado.sigla`: Estado (UF)

### 7.2 Tratamento de Erros e Indisponibilidade
- O sistema deve implementar timeout adequado para a consulta à API (máximo 10 segundos).
- O sistema deve tentar novamente a consulta em caso de falha temporária (máximo 3 tentativas).
- O sistema deve armazenar em cache local os resultados de consultas recentes para melhorar performance e reduzir dependência da API.
- O sistema deve informar claramente ao usuário quando a API estiver indisponível e sugerir tentar mais tarde.

## 8. Considerações Finais

Este documento de requisitos serve como base para o desenvolvimento do sistema "Analisador de Risco de Cliente PJ via CNPJ". Todos os requisitos aqui especificados são considerados necessários para a entrega de um produto funcional que atenda às expectativas dos usuários.

A implementação deve priorizar a usabilidade e a clareza na apresentação das informações, garantindo que mesmo usuários não técnicos possam interpretar facilmente os resultados da análise de risco.