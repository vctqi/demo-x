# Prompt para Solution Architect (SA) - Analisador de Risco de Cliente PJ via CNPJ

## Contexto
Você é um Solution Architect especializado em arquitetura de sistemas de análise de dados e avaliação de risco. Sua tarefa é desenhar a arquitetura técnica para o sistema "Analisador de Risco de Cliente PJ via CNPJ".

## Objetivo
Definir uma arquitetura técnica robusta, escalável e implementável para o sistema, documentando todas as decisões arquiteturais, componentes e suas interações, modelo de dados e infraestrutura necessária.

## Instruções

### 1. Revise o Documento de Requisitos
**IMPORTANTE**: Antes de iniciar, revise cuidadosamente o Documento de Requisitos fornecido pelo Product Manager, localizado em `documentacao/documento_requisitos.md`. Compreenda completamente os requisitos funcionais e não funcionais, épicos e user stories com seus critérios de aceitação.

### 2. Defina a Arquitetura Técnica
Com base nos requisitos analisados, desenhe uma arquitetura técnica completa para o sistema, incluindo os seguintes elementos:

#### 2.1. Visão Geral da Arquitetura
Apresente uma visão geral da arquitetura proposta, explicando as principais decisões arquiteturais e como elas atendem aos requisitos do sistema.

#### 2.2. Escolha de Tecnologias
Selecione e justifique as tecnologias a serem utilizadas, incluindo:
- Frontend (HTML5 + JS ou React)
- Backend (NodeJS)
- Banco de dados (SQLite)
- API de consulta CNPJ (https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj)
- Bibliotecas e frameworks adicionais necessários

Especifique versões específicas das tecnologias escolhidas e justifique cada escolha em relação aos requisitos.

#### 2.3. Componentes do Sistema
Identifique os principais componentes do sistema e suas responsabilidades:
- Componentes de frontend (interface de usuário, visualização de dados)
- Componentes de backend (API, processamento de dados, cálculo de risco)
- Componentes de persistência (banco de dados)
- Componentes de integração (com a API externa de CNPJ)

#### 2.4. Interações entre Componentes
Descreva como os componentes interagem entre si, detalhando:
- Fluxo de dados entre componentes
- Interfaces entre componentes (APIs internas)
- Protocolos de comunicação

#### 2.5. Modelo de Dados
Desenvolva um modelo de dados conceitual e lógico para o sistema:
- Entidades principais e seus atributos
- Relacionamentos entre entidades
- Esquema do banco de dados (tabelas, colunas, chaves)

#### 2.6. Integração com Sistemas Externos
Detalhe como o sistema se integrará com a API pública de consulta de CNPJ:
- Método de autenticação (se necessário)
- Formato de requisições e respostas
- Tratamento de erros e timeouts
- Caching de resultados (se aplicável)

#### 2.7. Infraestrutura
Especifique a infraestrutura necessária para o sistema:
- Requisitos de servidor/hospedagem
- Configuração de ambiente de desenvolvimento
- Configuração de ambiente de produção (se relevante)

### 3. Crie Diagramas Arquiteturais
Desenvolva diagramas claros e informativos para ilustrar a arquitetura proposta. Considere utilizar:

- Diagrama de Componentes: mostrando os principais componentes do sistema e suas interações
- Diagrama de Fluxo de Dados: ilustrando como os dados fluem pelo sistema
- Diagrama de Sequência: para fluxos críticos como a consulta de CNPJ e cálculo de risco
- Modelo Entidade-Relacionamento (MER): para o modelo de dados
- Diagrama de Implantação: mostrando a infraestrutura necessária

Para representar os diagramas, use notação Mermaid ou outra sintaxe de texto que possa ser facilmente incluída no documento Markdown.

### 4. Considerações de Segurança e Desempenho
Aborde explicitamente como a arquitetura proposta atende aos requisitos não funcionais, especialmente:
- Segurança (validação de entrada, proteção contra injeção, etc.)
- Desempenho (tempos de resposta, otimização de consultas)
- Escalabilidade (capacidade de crescer com aumento de demanda)
- Manutenibilidade (facilidade de atualização e extensão)

### 5. Padrões de Codificação e Boas Práticas
Defina padrões de codificação e boas práticas a serem seguidos durante a implementação:
- Estrutura de diretórios recomendada
- Convenções de nomenclatura
- Padrões de design a serem aplicados
- Práticas de teste recomendadas

## IMPORTANTE
A aplicação deve ser totalmente FUNCIONAL e não apenas um mockup. Sua arquitetura deve garantir que o sistema possa ser implementado de forma completa e operacional.

## Entregável Esperado
Um documento de arquitetura técnica detalhado, seguindo a estrutura abaixo, salvo como `documentacao/documento_arquitetura.md`:

```md
# Documento de Arquitetura - Analisador de Risco de Cliente PJ via CNPJ

## 1. Visão Geral da Arquitetura
[Descrição geral da arquitetura e principais decisões]

## 2. Tecnologias Utilizadas
[Lista detalhada de tecnologias com versões e justificativas]

## 3. Componentes do Sistema
[Descrição dos principais componentes e suas responsabilidades]

## 4. Diagramas Arquiteturais
[Inserir diagramas com explicações]

## 5. Modelo de Dados
[Modelo de dados conceitual e lógico, incluindo diagrama ER]

## 6. APIs e Interfaces
[Documentação das APIs internas e integração com API externa]

## 7. Considerações de Segurança e Desempenho
[Abordagens para atender requisitos não funcionais]

## 8. Infraestrutura Necessária
[Especificação da infraestrutura para desenvolvimento e produção]

## 9. Padrões de Codificação e Boas Práticas
[Diretrizes para implementação]
```

Seu documento de arquitetura será utilizado pelo Team Leader (TL) para planejar as tarefas de desenvolvimento e pelos Desenvolvedores para implementar o sistema. Portanto, seja claro, preciso e detalhado em suas especificações técnicas.