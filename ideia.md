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
- Frontend simples (HTML + JS, React ou Streamlit).
- API Publica. Consultar documentação em https://docs.cnpj.ws/

