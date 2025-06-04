# Analisador de Risco de Cliente PJ via CNPJ

Uma ferramenta que permite consultar o CNPJ de empresas e obter uma análise simplificada de risco, baseada em dados públicos e critérios predefinidos.

## Funcionalidades

- Consulta de dados cadastrais de empresas via CNPJ
- Cálculo de score de risco baseado em critérios como:
  - Situação cadastral (ativa, inativa, suspensa, baixada)
  - Tempo de operação da empresa
  - Classificação de risco do CNAE
- Exibição visual dos resultados com indicação clara do nível de risco
- Detalhamento dos critérios que influenciaram o score final

## Requisitos do Sistema

- Node.js 18.x ou superior
- NPM 8.x ou superior
- Acesso à internet (para consulta à API pública de CNPJ)

## Instalação

1. Clone este repositório ou extraia o código fonte
2. Navegue até o diretório do projeto
3. Execute o script de inicialização:

```bash
cd /caminho/para/o/projeto
./start.sh
```

O script de inicialização verificará se todas as dependências estão instaladas e, caso necessário, fará a instalação automaticamente. Em seguida, iniciará o backend e o frontend da aplicação.

## Utilização

Após iniciar a aplicação:

1. Acesse o frontend em seu navegador: http://localhost:3000
2. Insira um CNPJ válido no campo de consulta
   - O CNPJ pode ser inserido com ou sem formatação (ex: 00.000.000/0000-00 ou 00000000000000)
3. Clique no botão "Analisar Risco"
4. Aguarde o processamento e visualize os resultados

### Interpretação dos Resultados

- **Badge Verde (Baixo Risco)**: Empresa com score igual ou superior a 20 pontos
- **Badge Amarelo (Médio Risco)**: Empresa com score entre 0 e 19 pontos
- **Badge Vermelho (Alto Risco)**: Empresa com score inferior a 0 pontos

Para entender quais critérios influenciaram o score, clique em "Mostrar Detalhes" na seção de detalhes da análise.

## Encerrando a Aplicação

Para encerrar a aplicação, execute:

```bash
./stop.sh
```

Este script irá encerrar os processos do backend e frontend.

## Estrutura do Projeto

- `/backend`: API Node.js/Express
  - `/src`: Código fonte do backend
    - `/controllers`: Controladores da API
    - `/services`: Lógica de negócio
    - `/repositories`: Acesso a dados
    - `/models`: Modelos de dados
    - `/middlewares`: Middlewares Express
    - `/utils`: Utilitários
    - `/config`: Configurações
    - `/routes`: Rotas da API
- `/frontend`: Interface React
  - `/src`: Código fonte do frontend
    - `/components`: Componentes React
    - `/services`: Serviços (API)
    - `/utils`: Utilitários
    - `/styles`: Estilos globais
    - `/assets`: Recursos estáticos

## Endpoints da API

O backend expõe os seguintes endpoints:

- `POST /api/cnpj/validate`: Valida o formato e os dígitos verificadores de um CNPJ
- `GET /api/cnpj/:cnpj`: Retorna os dados cadastrais de um CNPJ
- `GET /api/cnpj/:cnpj/analyze`: Analisa o risco de um CNPJ

## Arquivos de Log

Os logs da aplicação são salvos em:

- Backend: `/backend/backend.log`
- Frontend: `/frontend/frontend.log`

## Solução de Problemas

### Erro de Conexão com a API

Se ocorrer um erro de conexão com a API de CNPJ:

1. Verifique sua conexão com a internet
2. Verifique se a API pública de CNPJ está disponível
3. Tente novamente mais tarde

### Erro "CNPJ não encontrado"

Este erro pode ocorrer quando:

1. O CNPJ foi digitado incorretamente
2. O CNPJ não existe na base de dados da Receita Federal
3. O CNPJ é muito recente e ainda não foi indexado pela API pública

### Problemas de Inicialização

Se a aplicação não iniciar corretamente:

1. Verifique se as portas 3000 e 5000 estão disponíveis
2. Execute `./stop.sh` para garantir que nenhum processo anterior esteja em execução
3. Tente novamente com `./start.sh`
4. Verifique os arquivos de log para identificar possíveis erros

## Limitações

- A análise é baseada apenas em dados públicos disponíveis
- A classificação de risco é simplificada e serve apenas como referência inicial
- A disponibilidade depende do funcionamento da API pública de CNPJ