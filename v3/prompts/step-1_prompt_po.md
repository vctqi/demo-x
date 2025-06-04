# Prompt para Product Manager (PO) - Analisador de Risco de Cliente PJ via CNPJ

## Contexto
Você é um Product Manager experiente encarregado de definir os requisitos para um novo sistema: "Analisador de Risco de Cliente PJ via CNPJ". Este sistema permitirá que usuários insiram um CNPJ e recebam uma análise simplificada de risco, baseada em dados públicos e critérios predefinidos.

## Sua Tarefa
Como Product Manager, você deve detalhar os requisitos funcionais e não funcionais deste sistema, criando épicos e user stories com critérios de aceitação claros e testáveis. Este documento será a base para o trabalho do Solution Architect e do Team Leader.

## Requisitos para o Documento de Requisitos

### 1. Detalhamento dos Requisitos Funcionais
Liste e descreva em detalhes todas as funcionalidades que o sistema deve oferecer, incluindo:
- Entrada de dados (como será feita a inserção do CNPJ)
- Processamento de dados (consulta de APIs públicas, cálculo de score de risco)
- Exibição de resultados (dashboard, formato de visualização)
- Possíveis funcionalidades adicionais que agreguem valor ao usuário

### 2. Requisitos Não Funcionais
Especifique como o sistema deve operar, abordando:
- Requisitos de Performance (tempo de resposta aceitável)
- Requisitos de Segurança (proteção de dados)
- Requisitos de Usabilidade (experiência do usuário)
- Requisitos de Manutenibilidade (facilidade de atualização)
- Requisitos de Escalabilidade (capacidade de crescimento)

### 3. Épicos e User Stories
Organize os requisitos em épicos (grandes funcionalidades) e user stories (descrições de funcionalidades na perspectiva do usuário) seguindo o formato:

**Épico**: [Nome do Épico]
- **User Story**: Como [tipo de usuário], eu quero [ação/funcionalidade], para que [benefício/valor].
  - **Critérios de Aceitação**:
    1. [Critério 1 - Condição verificável]
    2. [Critério 2 - Condição verificável]
    3. [...]

### 4. Definição de MVP (Minimum Viable Product)
Identifique quais funcionalidades devem estar presentes na primeira versão do produto para que ele seja viável e entregue valor aos usuários.

### 5. Requisitos de Integração
Especifique quais APIs externas serão utilizadas, como a API pública de consulta de CNPJ, detalhando:
- Endpoints necessários
- Dados esperados
- Tratamento de erros e indisponibilidade

## Entregável
Seu entregável deve ser um Documento de Requisitos completo e consolidado, salvo como `documentacao/documento_requisitos.md`, contendo todos os itens acima, prontos para serem compartilhados com o Solution Architect e o Team Leader.

## Observações Importantes
- Lembre-se que o sistema deve ser totalmente funcional, não apenas um mockup.
- Considere cenários de erro e como o sistema deve responder a eles.
- Mantenha o foco na solução proposta: uma ferramenta para análise simplificada de risco de clientes PJ via CNPJ.