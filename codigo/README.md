# Analisador de Risco de Cliente PJ via CNPJ

## Descrição

O **Analisador de Risco de Cliente PJ via CNPJ** é uma aplicação web que permite aos usuários analisar o risco potencial de empresas (Pessoas Jurídicas) a partir do número de CNPJ. A ferramenta consulta dados públicos, aplica critérios de análise pré-definidos e apresenta um dashboard com a classificação de risco e informações relevantes sobre a empresa consultada.

## Estrutura do Projeto

```
analisador-risco-cnpj/
│
├── frontend/                # Aplicação React
│   ├── public/              # Arquivos estáticos
│   ├── src/                 # Código fonte do frontend
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Serviços para comunicação com a API
│   │   ├── utils/           # Funções utilitárias
│   │   ├── App.js           # Componente principal
│   │   └── index.js         # Ponto de entrada
│   ├── package.json         # Dependências do frontend
│   └── README.md            # Documentação do frontend
│
├── backend/                 # API Node.js/Express
│   ├── src/                 # Código fonte do backend
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Serviços de negócio
│   │   ├── models/          # Modelos de dados
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── utils/           # Funções utilitárias
│   │   ├── config/          # Configurações
│   │   └── app.js           # Configuração do Express
│   ├── logs/                # Arquivos de log
│   ├── database/            # Banco de dados SQLite
│   ├── package.json         # Dependências do backend
│   └── README.md            # Documentação do backend
│
├── scripts/                 # Scripts utilitários
│   ├── start.sh             # Script para iniciar a aplicação
│   └── stop.sh              # Script para parar a aplicação
│
└── README.md                # Este arquivo
```

## Requisitos do Sistema

### Pré-requisitos

- Node.js v16.0.0 ou superior
- npm v7.0.0 ou superior
- Acesso à internet (para comunicação com a API de CNPJ)

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/sua-organizacao/analisador-risco-cnpj.git
cd analisador-risco-cnpj
```

### 2. Instalação de dependências

Você pode instalar todas as dependências de uma vez usando o script start.sh, que verificará e instalará tudo o que for necessário:

```bash
chmod +x ./scripts/start.sh
./scripts/start.sh --install-only
```

Ou instalar manualmente:

```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

## Configuração

### Variáveis de Ambiente

As configurações da aplicação são gerenciadas através de variáveis de ambiente. O sistema possui valores padrão adequados para desenvolvimento, mas você pode personalizá-los criando um arquivo `.env` nas pastas backend e/ou frontend.

#### Backend (.env)

```
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
LOG_FILE=logs/application.log
DB_PATH=database/analisador.sqlite
CACHE_DURATION_HOURS=24
```

#### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3001/api
```

## Execução da Aplicação

### Utilizando os Scripts

A maneira mais fácil de iniciar a aplicação é utilizando os scripts fornecidos:

#### Para iniciar a aplicação:

```bash
./scripts/start.sh
```

Este script:
1. Verifica se todos os requisitos estão instalados
2. Instala dependências ausentes, se necessário
3. Inicia o backend na porta 3001
4. Inicia o frontend na porta 3000
5. Abre o navegador automaticamente com a aplicação

#### Para parar a aplicação:

```bash
./scripts/stop.sh
```

Este script encerra todos os processos relacionados à aplicação.

### Execução Manual

Se preferir, você pode iniciar os componentes manualmente:

#### Backend:

```bash
cd backend
npm start
```

O backend estará disponível em http://localhost:3001/api

#### Frontend:

```bash
cd frontend
npm start
```

O frontend estará disponível em http://localhost:3000

## Uso da Aplicação

1. Acesse a aplicação no navegador: http://localhost:3000
2. Insira um CNPJ válido no campo de entrada (pode ser com ou sem formatação)
3. Clique no botão "Analisar Risco"
4. Aguarde enquanto o sistema consulta os dados e realiza a análise
5. Visualize o dashboard com:
   - Dados cadastrais da empresa
   - Classificação de risco (Baixo, Médio ou Alto)
   - Sinais de alerta identificados
   - Detalhes dos critérios que impactaram o score

### Exemplos de CNPJs para Teste

- **00.000.000/0001-91** - Banco do Brasil (empresa antiga, baixo risco)
- **33.000.167/0001-01** - Petrobras (empresa antiga, baixo risco)
- **34.028.316/0001-03** - Empresa recente (exemplo de médio risco)
- **99.999.999/9999-99** - CNPJ inválido (para testar tratamento de erro)

## Logs e Monitoramento

### Logs do Backend

Os logs da aplicação são armazenados em:
- Console (stdout) em ambiente de desenvolvimento
- Arquivo `backend/logs/application.log` em ambiente de produção

Níveis de log utilizados:
- ERROR: Falhas críticas
- WARN: Situações anormais mas não críticas
- INFO: Eventos normais importantes
- DEBUG: Informações detalhadas (apenas em ambiente de desenvolvimento)

### Monitoramento

A aplicação registra métricas importantes que podem ser visualizadas nos logs:
- Tempo de resposta da API externa
- Número de consultas realizadas
- Taxa de acerto no cache (hit rate)
- Erros encontrados

## Solução de Problemas

### Problemas Comuns

#### A aplicação não inicia

1. Verifique se as portas 3000 e 3001 não estão sendo usadas por outros processos
2. Verifique se Node.js está instalado corretamente: `node --version`
3. Verifique se as dependências foram instaladas: `cd backend && npm ls`

#### Erro ao consultar CNPJ

1. Verifique se o CNPJ inserido é válido
2. Verifique se há conexão com a internet
3. A API externa pode estar indisponível temporariamente, tente novamente mais tarde
4. Verifique os logs para mais detalhes sobre o erro

#### Banco de dados não inicializa

1. Verifique se a pasta `backend/database` existe e tem permissões de escrita
2. Verifique os logs para mensagens de erro relacionadas ao SQLite

### Logs de Erro

Para verificar os logs de erro:

```bash
cat backend/logs/application.log | grep ERROR
```

## Desenvolvimento

### Estrutura do Código

A aplicação segue uma arquitetura em camadas:

#### Backend
- **Controllers**: Recebem requisições e coordenam a resposta
- **Services**: Contêm a lógica de negócio
- **Models**: Definem a estrutura dos dados
- **Middlewares**: Interceptam requisições para logging, validação, etc.
- **Utils**: Funções utilitárias compartilhadas

#### Frontend
- **Components**: Componentes React reutilizáveis
- **Services**: Comunicação com a API
- **Utils**: Funções utilitárias

### Testes

Para executar os testes:

```bash
# Testes do backend
cd backend
npm test

# Testes do frontend
cd frontend
npm test
```

## Limitações Conhecidas

- A análise é baseada em critérios simplificados e não substitui uma análise financeira completa
- A disponibilidade depende da API externa de CNPJ
- O sistema não possui autenticação ou níveis de acesso

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Implemente suas mudanças
4. Execute os testes para garantir que nada foi quebrado
5. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
6. Push para a branch (`git push origin feature/nova-feature`)
7. Abra um Pull Request

## Contato

Para dúvidas ou sugestões, entre em contato pelo email: seuemail@exemplo.com