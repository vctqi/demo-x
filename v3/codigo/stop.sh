#!/bin/bash

# Definição de cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Encerrando o Analisador de Risco de Cliente PJ via CNPJ ===${NC}"

# Diretório raiz da aplicação
APP_DIR=$(dirname "$(readlink -f "$0")")

# Encerra o processo do backend
if [ -f "$APP_DIR/backend.pid" ]; then
  BACKEND_PID=$(cat "$APP_DIR/backend.pid")
  if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}Encerrando o backend (PID $BACKEND_PID)...${NC}"
    kill $BACKEND_PID
    echo -e "${GREEN}Backend encerrado.${NC}"
  else
    echo -e "${RED}O processo do backend não está mais em execução.${NC}"
  fi
  rm "$APP_DIR/backend.pid"
else
  echo -e "${RED}Arquivo de PID do backend não encontrado.${NC}"
fi

# Encerra o processo do frontend
if [ -f "$APP_DIR/frontend.pid" ]; then
  FRONTEND_PID=$(cat "$APP_DIR/frontend.pid")
  if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${YELLOW}Encerrando o frontend (PID $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID
    echo -e "${GREEN}Frontend encerrado.${NC}"
  else
    echo -e "${RED}O processo do frontend não está mais em execução.${NC}"
  fi
  rm "$APP_DIR/frontend.pid"
else
  echo -e "${RED}Arquivo de PID do frontend não encontrado.${NC}"
fi

# Mata quaisquer processos residuais nas portas 3000 e 5000
echo -e "${YELLOW}Verificando processos residuais...${NC}"

FRONTEND_PORT_PID=$(lsof -t -i:3000 2>/dev/null)
if [ ! -z "$FRONTEND_PORT_PID" ]; then
  echo -e "${YELLOW}Encerrando processo na porta 3000 (PID $FRONTEND_PORT_PID)...${NC}"
  kill -9 $FRONTEND_PORT_PID 2>/dev/null
  echo -e "${GREEN}Processo encerrado.${NC}"
fi

BACKEND_PORT_PID=$(lsof -t -i:5000 2>/dev/null)
if [ ! -z "$BACKEND_PORT_PID" ]; then
  echo -e "${YELLOW}Encerrando processo na porta 5000 (PID $BACKEND_PORT_PID)...${NC}"
  kill -9 $BACKEND_PORT_PID 2>/dev/null
  echo -e "${GREEN}Processo encerrado.${NC}"
fi

echo -e "${GREEN}=== Aplicação encerrada com sucesso! ===${NC}"