#!/bin/bash

# Definição de cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando o Analisador de Risco de Cliente PJ via CNPJ ===${NC}"

# Diretório raiz da aplicação
APP_DIR=$(dirname "$(readlink -f "$0")")
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_DIR="$APP_DIR/backend"

# Verifica se o NVM está instalado
if [ ! -d "$HOME/.nvm" ]; then
  echo -e "${YELLOW}NVM não encontrado. Instalando...${NC}"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
  echo -e "${GREEN}NVM já está instalado.${NC}"
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Verifica se o Node.js está instalado (versão 18)
if ! nvm ls 18 > /dev/null 2>&1; then
  echo -e "${YELLOW}Node.js 18 não encontrado. Instalando...${NC}"
  nvm install 18
fi

# Usa o Node.js 18
nvm use 18
echo -e "${GREEN}Usando Node.js $(node -v)${NC}"

# Verifica e instala dependências do backend
echo -e "${YELLOW}Verificando dependências do backend...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Instalando dependências do backend...${NC}"
  npm install
else
  echo -e "${GREEN}Dependências do backend já estão instaladas.${NC}"
fi

# Verifica e instala dependências do frontend
echo -e "${YELLOW}Verificando dependências do frontend...${NC}"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
  npm install
else
  echo -e "${GREEN}Dependências do frontend já estão instaladas.${NC}"
fi

# Inicia o backend em segundo plano
echo -e "${YELLOW}Iniciando o servidor backend...${NC}"
cd "$BACKEND_DIR"
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$APP_DIR/backend.pid"
echo -e "${GREEN}Backend iniciado com PID $BACKEND_PID${NC}"

# Aguarda o backend iniciar
echo -e "${YELLOW}Aguardando o backend inicializar...${NC}"
sleep 5

# Inicia o frontend em segundo plano
echo -e "${YELLOW}Iniciando o cliente frontend...${NC}"
cd "$FRONTEND_DIR"
PORT=3001 npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$APP_DIR/frontend.pid"
echo -e "${GREEN}Frontend iniciado com PID $FRONTEND_PID${NC}"

echo -e "${GREEN}=== Aplicação iniciada com sucesso! ===${NC}"
echo -e "${YELLOW}Backend rodando em: ${NC}http://localhost:5000/api"
echo -e "${YELLOW}Frontend rodando em: ${NC}http://localhost:3001"
echo -e "${YELLOW}Logs do backend: ${NC}$BACKEND_DIR/backend.log"
echo -e "${YELLOW}Logs do frontend: ${NC}$FRONTEND_DIR/frontend.log"
echo -e "${YELLOW}Para encerrar a aplicação, execute ${NC}./stop.sh"