# Analisador de Risco de Cliente PJ via CNPJ

Este repositório contém a implementação de um sistema para análise de risco de empresas brasileiras através da consulta do CNPJ, utilizando dados públicos e critérios predefinidos.

## Estrutura do Repositório

```
/
├── codigo/                # Código fonte da aplicação
│   ├── backend/           # Backend Node.js/Express
│   ├── frontend/          # Frontend React
│   ├── scripts/           # Scripts de automação
│   └── README.md          # Instruções detalhadas
│
├── documentacao/          # Documentação do projeto
│   ├── documento_requisitos.md            # Requisitos do sistema
│   ├── documento_arquitetura.md           # Arquitetura técnica
│   └── documento_backlog_desenvolvimento.md  # Backlog de desenvolvimento
│
├── logs/                  # Logs do projeto
│   └── worklog.md         # Registro de atividades
│
├── prompts/               # Prompts utilizados para gerar documentação
│   ├── step-1_prompt_po.md   # Prompt do Product Manager
│   ├── step-2_prompt_sa.md   # Prompt do Solution Architect
│   ├── step-3_prompt_tl.md   # Prompt do Team Leader
│   └── step-4_prompt_dev.md  # Prompt do Developer
│
├── start.sh               # Script para iniciar a aplicação
└── stop.sh                # Script para parar a aplicação
```

## Executando a Aplicação

1. Clone o repositório:
   ```
   git clone https://github.com/vctqi/demo-x.git
   cd demo-x
   ```

2. Execute o script de inicialização:
   ```
   ./start.sh
   ```

   O script verificará e instalará todas as dependências necessárias e iniciará a aplicação.

3. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

4. Para parar a aplicação:
   ```
   ./stop.sh
   ```

## Documentação

Para mais detalhes, consulte:

- [Requisitos do Sistema](documentacao/documento_requisitos.md)
- [Arquitetura Técnica](documentacao/documento_arquitetura.md)
- [Backlog de Desenvolvimento](documentacao/documento_backlog_desenvolvimento.md)
- [Instruções Detalhadas](codigo/README.md)