# Analisador de Risco de Cliente PJ via CNPJ - Arquitetura

## Descrição da Solução
Uma ferramenta onde o usuário insere o CNPJ de um cliente e recebe uma avaliação de risco com base nos dados públicos da empresa.

## Requisitos do Sistema
Antes de iniciar, revise cuidadosamente o documento de requisitos fornecido pelo Product Manager (PO). Este documento contém os requisitos funcionais e não funcionais que devem ser atendidos pela arquitetura proposta.

## Arquitetura Técnica

### Visão Geral da Arquitetura
Proponho uma arquitetura de três camadas para este sistema:
1. **Frontend**: Interface de usuário responsiva e intuitiva
2. **Backend**: Serviços REST para processamento da lógica de negócios
3. **Persistência**: Armazenamento de dados e cache

### Diagrama de Componentes
```
+----------------+      +------------------+      +------------------+
|                |      |                  |      |                  |
|   Frontend     |<---->|    Backend API   |<---->|  Banco de Dados  |
|  (React/HTML5) |      |     (Node.js)    |      |     (SQLite)     |
|                |      |                  |      |                  |
+----------------+      +------------------+      +------------------+
                               |
                               v
                        +------------------+
                        |                  |
                        |   API Externa    |
                        |    (CNPJ.ws)     |
                        |                  |
                        +------------------+
```

### Stack Tecnológica
- **Frontend**: 
  - React.js para SPA (Single Page Application)
  - Bibliotecas de UI: Material-UI ou Bootstrap
  - Estado global via Context API ou Redux (se necessário)

- **Backend**:
  - Node.js com Express
  - Middleware para validação, autenticação e tratamento de erros
  - Axios para consumo de APIs externas

- **Persistência**:
  - SQLite para armazenamento local
  - Modelo de dados simples para histórico de consultas

### Fluxo de Dados
1. Usuário insere CNPJ na interface
2. Frontend valida formato básico do CNPJ
3. Requisição é enviada ao backend
4. Backend verifica se os dados já estão em cache
5. Se não estiverem em cache, consulta API externa
6. Dados são processados aplicando regras de negócio para cálculo de score
7. Resultado é armazenado no banco e retornado ao frontend
8. Frontend exibe o resultado formatado ao usuário

### Considerações de Segurança
- Implementar rate limiting para evitar abusos
- Validar e sanitizar todas as entradas de usuário
- Implementar logs de auditoria para consultas realizadas
- Armazenar apenas dados necessários, respeitando LGPD

### Escalabilidade
- Implementar cache para reduzir chamadas à API externa
- Design stateless para permitir escalabilidade horizontal futura
- Separação clara entre camadas para facilitar manutenção

## Detalhes de Implementação

### Modelos de Dados
```javascript
// Modelo de consulta
{
  id: Number,
  cnpj: String,
  dataConsulta: Date,
  resultados: {
    dadosEmpresa: Object,
    scoreRisco: Number,
    nivelRisco: String, // "BAIXO", "MÉDIO", "ALTO"
    criteriosImpacto: Array
  }
}
```

### APIs Internas
- `POST /api/analise-risco`: Recebe CNPJ e retorna análise completa
- `GET /api/historico`: Retorna histórico de consultas realizadas
- `GET /api/criterios`: Retorna os critérios utilizados no cálculo

## Entregáveis
- Documento de arquitetura do sistema contendo:
  - Diagramas de arquitetura
  - Especificações técnicas detalhadas
  - Fluxos de dados e interações entre componentes
  - Considerações de segurança e escalabilidade