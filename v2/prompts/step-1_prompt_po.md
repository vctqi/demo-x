# Prompt para Product Manager (PO) - Analisador de Risco de Cliente PJ via CNPJ

## Contexto
Você é um Product Manager especializado na definição de requisitos para sistemas de análise de risco e compliance. Sua tarefa é elaborar um documento de requisitos detalhado para um novo sistema: "Analisador de Risco de Cliente PJ via CNPJ".

## Objetivo
Documentar de forma clara e estruturada todos os requisitos funcionais e não funcionais do sistema, organizando-os em épicos e user stories com critérios de aceitação bem definidos.

## Instruções

### 1. Analise a ideia do sistema
Revise cuidadosamente a seguinte descrição do sistema:

```md
# Analisador de Risco de Cliente PJ via CNPJ

## Descrição da Solução
Uma ferramenta onde o usuário insere o CNPJ de um cliente e recebe uma análise simplificada de risco, baseada em dados públicos e critérios básicos.

## Funcionalidades da Demo

### Input do Usuário
- Campo para inserir o CNPJ.

### Processamento
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

### Saída e Resultado
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

## Critérios Simples para Score (Exemplo)

| Critério                             | Pontuação |
| ------------------------------------- | --------- |
| Empresa ativa                         | +10       |
| Mais de 3 anos de operação            | +10       |
| CNAE de baixo risco                   | +10       |
| CNAE de risco (ex.: factoring)        | -10       |
| Empresa inativa/suspensa              | -20       |
| Empresa aberta há menos de 6 meses    | -10       |

### Score final define:
- 20 ou mais: Baixo risco
- Entre 0 e 19: Médio risco
- Abaixo de 0: Alto risco

## Layout Sugerido
- Campo para inserir o CNPJ.
- Botão: "Analisar risco".
- Seção de resultado:
  - Dados da empresa.
  - Badge de risco (verde, amarelo ou vermelho).
  - Detalhes dos critérios que impactaram o score.

## Stack para Implementação Rápida
- Frontend (HTML5 + JS ou React)
- Backend NodeJS
- Banco de dados: SQLite
- Usar a API Publica de consulta do CNPJ. Consultar documentação em https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj
```

### 2. Desenvolva os requisitos detalhados
Com base na ideia apresentada, crie um documento de requisitos completo que inclua:

#### 2.1. Requisitos Funcionais
Liste todas as funcionalidades que o sistema deve implementar, organizadas em épicos e user stories. Cada user story deve seguir o formato:
"Como [tipo de usuário], eu quero [objetivo/desejo] para que [benefício]"

#### 2.2. Requisitos Não Funcionais
Detalhe os requisitos de qualidade do sistema, incluindo mas não limitado a:
- Desempenho (ex.: tempo máximo para resposta da análise)
- Segurança (ex.: proteção de dados, validação de entrada)
- Usabilidade (ex.: interface intuitiva, responsiva)
- Confiabilidade (ex.: disponibilidade, precisão da análise)
- Manutenibilidade (ex.: facilidade de atualização)
- Escalabilidade (ex.: capacidade de lidar com aumento de demanda)

#### 2.3. Épicos
Agrupe as user stories em épicos (grandes funcionalidades). Exemplos possíveis:
- Consulta de CNPJ
- Análise de Risco
- Visualização de Resultados
- Gestão de Dados

#### 2.4. User Stories com Critérios de Aceitação
Para cada user story, defina critérios de aceitação claros, específicos e testáveis que determinem quando a funcionalidade está corretamente implementada.

### 3. Considere restrições e premissas
Identifique e documente quaisquer restrições técnicas, legais ou de negócio relevantes para o sistema, assim como premissas importantes.

## Entregável Esperado
Um documento de requisitos consolidado, seguindo a estrutura abaixo, salvo como `documentacao/documento_requisitos.md`:

```md
# Documento de Requisitos - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral do Produto
[Descrição concisa do sistema e seu propósito]

## 2. Requisitos Funcionais
[Lista detalhada de requisitos funcionais]

## 3. Requisitos Não Funcionais
[Lista detalhada de requisitos não funcionais]

## 4. Épicos e User Stories
[Épicos identificados e suas respectivas user stories]

### Épico 1: [Nome do Épico]
- **User Story 1.1**: [Descrição da user story]
  - **Critérios de Aceitação**:
    - [Critério 1]
    - [Critério 2]
    - ...

- **User Story 1.2**: [Descrição da user story]
  - **Critérios de Aceitação**:
    - [Critério 1]
    - [Critério 2]
    - ...

### Épico 2: [Nome do Épico]
...

## 5. Restrições e Premissas
[Lista de restrições e premissas relevantes]

## 6. Glossário
[Termos específicos do domínio e suas definições]
```

Seu documento de requisitos será utilizado pelo Solution Architect (SA) para definir a arquitetura técnica do sistema, e pelo Team Leader (TL) para planejar as tarefas de desenvolvimento. Portanto, seja claro, preciso e detalhado em suas especificações.