# Documento de Arquitetura - Analisador de Risco de Cliente PJ via CNPJ

## Visão Geral da Arquitetura

O sistema "Analisador de Risco de Cliente PJ via CNPJ" seguirá uma arquitetura cliente-servidor com separação clara entre frontend e backend. A arquitetura será baseada em componentes modulares, facilitando a manutenção e evolução do sistema. O sistema utilizará uma API REST para comunicação entre o frontend e o backend, e integrará com uma API externa para consulta de dados de CNPJ.

### Princípios Arquiteturais
- **Separação de Responsabilidades**: Cada componente terá responsabilidades bem definidas e limitadas.
- **Desacoplamento**: Os componentes serão desacoplados, permitindo alterações com impacto mínimo.
- **Escalabilidade**: A arquitetura permitirá escalar horizontalmente conforme necessário.
- **Segurança por Design**: Princípios de segurança aplicados em todas as camadas.
- **Observabilidade**: Métricas e logs para monitoramento do sistema.

## Stack Tecnológico

### Frontend
- **Framework**: React.js 18.x
- **Biblioteca de UI**: Material-UI 5.x
- **Estado**: Context API + Hooks
- **Cliente HTTP**: Axios
- **Validação de Formulários**: React Hook Form + Zod
- **Visualização de Dados**: Recharts (caso necessário para dashboards)
- **Build Tool**: Vite

### Backend
- **Plataforma**: Node.js 18.x LTS
- **Framework**: Express.js 4.x
- **Validação**: Joi ou Zod
- **Logging**: Winston
- **Cache**: Node-cache (para armazenar resultados temporários)
- **Segurança**: Helmet, CORS, Rate Limiting
- **Monitoramento**: Express Prometheus ou similar

### Banco de Dados
- **Banco de Dados**: SQLite 3
- **ORM**: Prisma ou Sequelize (para facilitar a transição para outros bancos se necessário)

### DevOps
- **Containerização**: Docker
- **Versionamento**: Git
- **CI/CD**: GitHub Actions (básico)
- **Testes**: 
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest

### Integrações
- **API de CNPJ**: [API Pública CNPJ.ws](https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj)

## Componentes do Sistema

### Diagrama de Componentes
```
+------------------------------------+
|              Frontend              |
|  +------------+   +-------------+  |
|  |   UI/UX    |   |   State     |  |
|  | Components |   | Management  |  |
|  +------------+   +-------------+  |
|          |               |         |
|          v               v         |
|  +--------------------------------+|
|  |        HTTP Client Layer       ||
|  +--------------------------------+|
+------------------|-----------------+
                  |
                  v
+------------------|-----------------+
|              Backend               |
|  +------------+   +-------------+  |
|  |   Routes   |   |  Services   |  |
|  +------------+   +-------------+  |
|          |               |         |
|          v               v         |
|  +------------+   +-------------+  |
|  | Data Model |   |  External   |  |
|  |  & Storage |   |    APIs     |  |
|  +------------+   +-------------+  |
+------------------------------------+
```

### Detalhamento dos Componentes

#### Frontend
1. **UI/UX Components**
   - Formulário de Consulta CNPJ
   - Componente de Exibição de Dados Cadastrais
   - Componente de Visualização de Risco
   - Componente de Histórico de Consultas
   - Componente de Exportação de Resultados

2. **State Management**
   - Gerenciamento de estado da aplicação
   - Armazenamento do histórico de consultas na sessão
   - Gestão do estado de loading durante consultas

3. **HTTP Client Layer**
   - Abstração para chamadas à API do Backend
   - Tratamento de erros e timeout
   - Interceptores para adicionar headers e tokens

#### Backend
1. **Routes**
   - API REST com endpoints para consulta de CNPJ
   - Endpoint para validação de CNPJ
   - Endpoint para obtenção do histórico

2. **Services**
   - Serviço de Validação de CNPJ
   - Serviço de Consulta à API Externa
   - Serviço de Cálculo de Score de Risco
   - Serviço de Geração de PDF (para exportação)

3. **Data Model & Storage**
   - Modelos de dados para consultas e histórico
   - Acesso ao banco de dados SQLite
   - Cache para resultados frequentes

4. **External APIs**
   - Cliente para API CNPJ.ws
   - Tratamento de erros e fallbacks

## Diagrama de Sequência (Fluxo Principal)

```
+--------+     +--------+     +--------+     +---------+
| Cliente |     | Backend |    | Cache  |     | API CNPJ |
+--------+     +--------+     +--------+     +---------+
    |               |             |              |
    | Consulta CNPJ |             |              |
    |-------------->|             |              |
    |               | Verifica Cache             |
    |               |------------>|              |
    |               |             |              |
    |               | Cache Miss  |              |
    |               |<------------|              |
    |               |                            |
    |               | Consulta CNPJ              |
    |               |---------------------------->|
    |               |                            |
    |               | Retorna Dados              |
    |               |<----------------------------|
    |               |                            |
    |               | Calcula Score              |
    |               |----------------+           |
    |               |                |           |
    |               |<---------------+           |
    |               |                            |
    |               | Armazena em Cache          |
    |               |------------>|              |
    |               |             |              |
    |               | Confirmação |              |
    |               |<------------|              |
    |               |                            |
    | Retorna Resultado com Score |              |
    |<--------------|                            |
    |               |                            |
```

## Modelo de Dados

### Diagrama de Entidade-Relacionamento Simplificado
```
+-----------------+       +------------------+
|    Consulta     |       |   ResultadoRisco |
|-----------------| 1---1 |------------------|
| id              |------>| id               |
| cnpj            |       | consulta_id      |
| data_consulta   |       | score            |
| razao_social    |       | classificacao    |
| nome_fantasia   |       | criterios_positivos |
| data_abertura   |       | criterios_negativos |
| cnae_principal  |       | alertas          |
| situacao        |       +------------------+
| porte           |
| localizacao     |
+-----------------+
```

### Esquema do Banco de Dados SQLite

```sql
-- Tabela para armazenar as consultas realizadas
CREATE TABLE consultas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cnpj TEXT NOT NULL,
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    razao_social TEXT,
    nome_fantasia TEXT,
    data_abertura DATE,
    cnae_principal TEXT,
    situacao TEXT,
    porte TEXT,
    localizacao TEXT,
    dados_brutos JSON -- Armazena a resposta completa da API
);

-- Tabela para armazenar os resultados da análise de risco
CREATE TABLE resultados_risco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consulta_id INTEGER,
    score INTEGER NOT NULL,
    classificacao TEXT NOT NULL, -- 'Baixo', 'Médio', 'Alto'
    criterios_positivos JSON, -- Array de critérios que contribuíram positivamente
    criterios_negativos JSON, -- Array de critérios que contribuíram negativamente
    alertas JSON, -- Array de alertas identificados
    FOREIGN KEY (consulta_id) REFERENCES consultas(id)
);
```

## Estratégia de Integração com API Externa

### API CNPJ.ws
A integração com a API pública CNPJ.ws será feita seguindo a documentação disponível em https://docs.cnpj.ws/referencia-de-api/api-publica/consultando-cnpj.

#### Características da Integração:
1. **Cliente HTTP Dedicado**: Um módulo específico para lidar com a comunicação com a API.
2. **Cache de Resultados**: Armazenamento em cache das consultas recentes para reduzir chamadas desnecessárias.
3. **Retry Mechanism**: Implementação de mecanismo de retry para lidar com falhas temporárias.
4. **Circuit Breaker**: Para evitar chamadas repetidas quando a API estiver indisponível.
5. **Timeout Configurável**: Para garantir que as consultas não bloqueiem o sistema indefinidamente.

#### Exemplo de Fluxo de Integração:
1. Receber solicitação de consulta de CNPJ do frontend.
2. Validar formato do CNPJ.
3. Verificar se o resultado está em cache.
4. Se não estiver em cache, consultar a API externa.
5. Processar o resultado e calcular o score de risco.
6. Armazenar o resultado no banco de dados e no cache.
7. Retornar o resultado processado para o frontend.

## Estratégia de Implantação

### Diagrama de Implantação
```
+---------------------+       +---------------------+
|    Frontend App     |       |     Backend API     |
|  (React + Vite)     |------>|  (Node + Express)   |
+---------------------+       +---------------------+
                                        |
                                        v
                              +---------------------+
                              |    SQLite DB        |
                              |  (Local Storage)    |
                              +---------------------+
                                        |
                                        v
                              +---------------------+
                              |    External API     |
                              |    (CNPJ.ws)        |
                              +---------------------+
```

### Processo de Implantação
1. **Desenvolvimento Local**: Ambiente de desenvolvimento com hot-reload.
2. **Build**: Compilação dos assets do frontend e backend.
3. **Dockerização**: Criação de imagens Docker para frontend e backend.
4. **Deployment**: Implantação em ambiente de produção (pode ser um serviço de hospedagem simples inicialmente).

## Considerações de Segurança

1. **Validação de Entrada**: Todos os inputs do usuário serão validados tanto no frontend quanto no backend.
2. **Proteção contra Injeção**: Uso de ORM e prepared statements para evitar SQL injection.
3. **Rate Limiting**: Limitação de requisições por IP para evitar abusos.
4. **Headers de Segurança**: Implementação de headers HTTP de segurança através do Helmet.
5. **CORS Configurado**: Configuração de CORS para permitir apenas origens confiáveis.
6. **Sanitização de Saída**: Dados retornados para o frontend serão sanitizados para evitar XSS.
7. **Logs Seguros**: Implementação de logs que não expõem informações sensíveis.

## Considerações de Performance

1. **Caching**: Implementação de cache para consultas frequentes.
2. **Minimização de Assets**: Compressão de JavaScript e CSS para o frontend.
3. **Lazy Loading**: Carregamento sob demanda de componentes pesados do frontend.
4. **Paginação**: Implementação de paginação para listas longas (histórico de consultas).
5. **Compressão**: Uso de compressão gzip/brotli para respostas HTTP.
6. **Pooling de Conexões**: Reuso de conexões HTTP para API externa.

## Considerações de Escalabilidade

Embora o sistema inicial seja de escala modesta, a arquitetura foi projetada pensando em potencial crescimento:

1. **Desacoplamento**: Componentes desacoplados permitem escalabilidade independente.
2. **Stateless Backend**: O backend não mantém estado de sessão, permitindo escalar horizontalmente.
3. **Banco de Dados**: SQLite é suficiente para fase inicial, mas o uso de ORM facilita migração para PostgreSQL ou MySQL se necessário.
4. **Cache Distribuído**: Possibilidade de evoluir para Redis ou similar para cache distribuído.
5. **Container-ready**: Arquitetura preparada para funcionar em containers, facilitando orquestração com Kubernetes.

## Monitoramento e Observabilidade

1. **Logging**: Implementação de logs estruturados em todos os componentes.
2. **Métricas**: Coleta de métricas de performance e uso (taxa de consultas, tempo de resposta).
3. **Health Checks**: Endpoints de health check para monitoramento de disponibilidade.
4. **Alertas**: Configuração de alertas para condições críticas (falhas na API externa, tempos de resposta elevados).

## Recomendações Técnicas para Implementação

1. **Organização do Código**:
   - Estrutura de diretórios por funcionalidade
   - Separação clara entre lógica de negócio e infraestrutura
   - Uso de interfaces e abstrações para facilitar testes

2. **Gestão de Configuração**:
   - Uso de variáveis de ambiente para configurações
   - Diferentes configurações por ambiente (dev, test, prod)
   - Secrets management adequado

3. **Qualidade de Código**:
   - Configuração de linters (ESLint, Prettier)
   - Testes automatizados (unitários, integração)
   - Code reviews
   - Documentação inline e README detalhado

4. **Versionamento**:
   - Semantic Versioning
   - Conventional Commits
   - Feature branches e PRs

5. **Frontend**:
   - Componentes reutilizáveis
   - Responsividade e acessibilidade
   - Feedback visual claro para ações do usuário

6. **Backend**:
   - Middleware para funcionalidades transversais
   - Documentação da API (Swagger/OpenAPI)
   - Error handling padronizado

## Conclusão

A arquitetura proposta para o "Analisador de Risco de Cliente PJ via CNPJ" é robusta, porém simples o suficiente para uma implementação rápida. O sistema foi projetado com atenção à manutenibilidade, segurança e experiência do usuário, oferecendo uma base sólida que pode evoluir conforme o sistema cresça em funcionalidades e volume de uso.

A separação clara entre frontend e backend, o uso de componentes modulares e a estratégia de integração com API externa permitem que o sistema seja desenvolvido, testado e implantado de forma eficiente, atendendo aos requisitos especificados e proporcionando uma boa experiência para os usuários.