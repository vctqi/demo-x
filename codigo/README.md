# Analisador de Risco de Cliente PJ via CNPJ

Este sistema permite avaliar o risco de empresas brasileiras através da consulta do CNPJ, utilizando dados públicos e critérios predefinidos.

## Funcionalidades

- Consulta de dados cadastrais da empresa via CNPJ
- Análise de risco baseada em critérios como:
  - Situação cadastral
  - Tempo de operação
  - Tipo de atividade econômica (CNAE)
- Dashboard com visualização de:
  - Dados cadastrais da empresa
  - Classificação de risco (Baixo, Médio, Alto)
  - Fatores que impactaram o score
  - Sinais de alerta específicos

## Requisitos do Sistema

- Node.js v14 ou superior
- npm v6 ou superior
- SQLite3

## Instalação

O sistema inclui scripts automatizados para instalação e execução.

### Instalação Automática

1. Clone o repositório:
   ```
   git clone https://github.com/vctqi/demo-x.git
   cd demo-x/codigo
   ```

2. Torne os scripts executáveis:
   ```
   chmod +x scripts/start.sh scripts/stop.sh
   ```

3. Execute o script de inicialização, que verificará e instalará todas as dependências necessárias:
   ```
   ./scripts/start.sh
   ```
   
   Este script:
   - Verifica e instala o Node.js (se necessário)
   - Verifica e instala o SQLite3 (se necessário)
   - Instala as dependências do backend e frontend
   - Compila o frontend
   - Inicia a aplicação

## Execução

### Iniciar a Aplicação

Se você já executou o script de instalação, a aplicação já estará em execução. Caso contrário, você pode iniciar a aplicação com:

```
./scripts/start.sh
```

A aplicação estará disponível em http://localhost:3000

### Parar a Aplicação

Para parar a aplicação em execução:

```
./scripts/stop.sh
```

## Estrutura do Projeto

```
/codigo
├── backend/                  # Servidor Node.js/Express
│   ├── src/                  # Código fonte do backend
│   │   ├── controllers/      # Controladores da API
│   │   ├── services/         # Serviços (consulta CNPJ, análise de risco)
│   │   ├── models/           # Modelos de dados
│   │   ├── middleware/       # Middleware Express
│   │   ├── utils/            # Funções utilitárias
│   │   ├── config/           # Configurações
│   │   └── app.js            # Aplicação Express principal
│   └── database/             # Banco de dados SQLite
│
├── frontend/                 # Aplicação React
│   ├── public/               # Arquivos estáticos
│   └── src/                  # Código fonte do frontend
│       ├── components/       # Componentes React
│       ├── services/         # Serviços para comunicação com API
│       └── utils/            # Funções utilitárias
│
└── scripts/                  # Scripts de automação
    ├── start.sh              # Script para iniciar a aplicação
    └── stop.sh               # Script para parar a aplicação
```

## Uso da Aplicação

1. Acesse a aplicação em seu navegador: http://localhost:3000
2. Digite um CNPJ válido no campo de busca (apenas números)
3. Clique no botão "Analisar Risco"
4. Aguarde o processamento e visualize os resultados

## Critérios de Análise de Risco

| Critério | Pontuação |
|----------|-----------|
| Empresa ativa | +10 |
| Mais de 3 anos de operação | +10 |
| CNAE de baixo risco | +10 |
| CNAE de alto risco | -10 |
| Empresa inativa/suspensa | -20 |
| Empresa aberta há menos de 6 meses | -10 |

### Classificação de Risco

- 20 ou mais pontos: Baixo risco
- Entre 0 e 19 pontos: Médio risco
- Abaixo de 0: Alto risco

## Considerações Importantes

- Esta análise é simplificada e baseada em dados públicos.
- Não substitui uma avaliação completa de crédito ou due diligence.
- A aplicação depende da API pública de CNPJ (https://publica.cnpj.ws) e está sujeita às limitações dessa API.

## Solução de Problemas

### A aplicação não inicia

- Verifique se as portas 3000 não estão sendo utilizadas por outros processos
- Verifique os logs da aplicação para identificar possíveis erros

### Erros na consulta de CNPJ

- Verifique se o CNPJ inserido é válido
- A API externa pode estar indisponível ou com limitações de acesso
- Tente novamente mais tarde