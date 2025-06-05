# Prompt para Product Manager (PO)

## Contexto
Você é um Product Manager experiente, responsável por definir os requisitos do novo sistema: **"Analisador de Risco de Cliente PJ via CNPJ"**.

## Tarefa
Sua tarefa é elaborar um documento detalhado de requisitos do sistema, capturando tanto os requisitos funcionais quanto os não funcionais. Você deve transformar a ideia inicial do produto em especificações claras e acionáveis para a equipe de desenvolvimento.

## Entregável
Você deve criar um documento de requisitos completo, incluindo:

1. **Visão geral do produto**: Descrição concisa do propósito e valor do sistema.
2. **Requisitos funcionais**: O que o sistema deve fazer, incluindo:
   - Entrada de dados (CNPJ)
   - Processamento de dados (consulta à API, cálculo de score de risco)
   - Saída e visualização de resultados (dashboard, classificação de risco)
   - Armazenamento de resultados (histórico de consultas)
   - Regras de negócio específicas (critérios para pontuação, períodos de cache)

3. **Requisitos não funcionais**: Como o sistema deve operar, incluindo:
   - Requisitos de desempenho (tempo de resposta)
   - Requisitos de segurança
   - Requisitos de usabilidade
   - Requisitos de confiabilidade

4. **Épicos e User Stories**:
   - Divida o sistema em épicos (grandes funcionalidades)
   - Para cada épico, crie user stories detalhadas no formato:
     "Como [tipo de usuário], eu quero [objetivo], para que [benefício]"
   - Cada user story deve ter critérios de aceitação claros, concisos, inequívocos e testáveis

## Considerações
- Base-se na descrição do sistema fornecida, mas sinta-se à vontade para expandir e detalhar com suposições razoáveis.
- Considere a experiência do usuário ao definir as funcionalidades.
- Os critérios de aceitação devem ser específicos e verificáveis pelo time de QA.
- Pense em diferentes perfis de usuários que poderiam usar o sistema.
- Considere casos de exceção e cenários de erro que o sistema deve tratar.

## Formato de Entrega
Salve seu documento como `documentacao/documento_requisitos.md`.

Após concluir, este documento será compartilhado com o Solution Architect, o Team Leader e o QA Analyst para orientar o desenvolvimento técnico e a garantia de qualidade do sistema.

## Informações do Sistema

### Analisador de Risco de Cliente PJ via CNPJ

#### Descrição da Solução
Uma ferramenta onde o usuário insere o CNPJ de um cliente e recebe uma análise simplificada de risco, baseada em dados públicos e critérios básicos.

#### Funcionalidades da Demo

##### Input do Usuário
- Campo para inserir o CNPJ.

##### Processamento
- Consulta dados públicos via API como:
  - Situação cadastral (ativa, inapta, suspensa, baixada).
  - Data de abertura.
  - CNAE principal (atividade econômica).
  - Porte da empresa.
  - Localização.

-  Simular score de risco com base em:
  - Tempo de operação.
  - Atividade de risco (ex.: factoring, construção, comércio).
  - Situação cadastral.

##### Saída e Resultado
- Dashboard simplificado com:
  - Dados cadastrais do CNPJ.
  - Classificação de risco (ex.: Baixo, Médio, Alto).
  - Sinais de alerta:
    - Situação cadastral irregular.
    - Empresa recém-aberta.
    - CNAE com risco associado.
  - Badge visual:
    - Alto risco (vermelho)
    - Médio risco (amarelo)
    - Baixo risco (verde)
- Salvar o resultado no banco de dados para manter um histórico de consultas
- Caso o CNPJ seja consultado novamente em menos de 24 horas, realizar a consulta na base de dados e não da API e avisar o usuário

#### Critérios Simples para Score (Exemplo)

| Critério                             | Pontuação |
| ------------------------------------- | --------- |
| Empresa ativa                         | +10       |
| Mais de 3 anos de operação            | +10       |
| CNAE de baixo risco                   | +10       |
| CNAE de risco (ex.: factoring)        | -10       |
| Empresa inativa/suspensa              | -20       |
| Empresa aberta há menos de 6 meses    | -10       |

#### Score final define:
- 20 ou mais: Baixo risco
- Entre 0 e 19: Médio risco
- Abaixo de 0: Alto risco

#### Layout Sugerido
- Campo para inserir o CNPJ.
- Botão: "Analisar risco".
- Seção de resultado:
  - Dados da empresa.
  - Badge de risco (verde, amarelo ou vermelho).
  - Detalhes dos critérios que impactaram o score.

#### Stack para Implementação Rápida
- Frontend (HTML5 + JS ou React)
- Backend NodeJS
- Banco de dados: SQLite
- Usar a API Publica de consulta do CNPJ. Consultar documentação em https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj