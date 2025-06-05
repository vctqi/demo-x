#!/bin/bash

# Script modificado para iniciar a aplicação sem tentar instalar/atualizar o Node.js

# Definir diretório base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"
LOG_DIR="$BASE_DIR/../logs"

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_DIR/start_script.log"
}

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"
touch "$LOG_DIR/start_script.log"

log "Iniciando script de inicialização da aplicação"

# Verificar dependências do backend
log "Verificando dependências do backend..."
cd "$BACKEND_DIR" || { log "Diretório backend não encontrado em $BACKEND_DIR"; exit 1; }

if [ ! -d "node_modules" ]; then
  log "Instalando dependências do backend..."
  npm install
  if [ $? -ne 0 ]; then
    log "Erro ao instalar dependências do backend"
    exit 1
  fi
  log "Dependências do backend instaladas com sucesso"
else
  log "Dependências do backend já instaladas"
fi

# Verificar dependências do frontend
log "Verificando dependências do frontend..."
cd "$FRONTEND_DIR" || { log "Diretório frontend não encontrado em $FRONTEND_DIR"; exit 1; }

if [ ! -d "node_modules" ]; then
  log "Instalando dependências do frontend..."
  npm install
  if [ $? -ne 0 ]; then
    log "Erro ao instalar dependências do frontend"
    exit 1
  fi
  log "Dependências do frontend instaladas com sucesso"
else
  log "Dependências do frontend já instaladas"
fi

# Iniciar backend em background
log "Iniciando servidor backend..."
cd "$BACKEND_DIR" || { log "Diretório backend não encontrado"; exit 1; }
nohup npm start > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$LOG_DIR/backend.pid"
log "Servidor backend iniciado com PID: $BACKEND_PID"

# Esperar backend iniciar
log "Aguardando inicialização do backend..."
sleep 5

# Iniciar frontend em background
log "Iniciando servidor frontend..."
cd "$FRONTEND_DIR" || { log "Diretório frontend não encontrado"; exit 1; }
PORT=3000 nohup npm start > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"
log "Servidor frontend iniciado com PID: $FRONTEND_PID"

log "Aplicação iniciada com sucesso"
log "Backend: http://localhost:3001"
log "Frontend: http://localhost:3000"
log "Use o script stop.sh para parar a aplicação"

# Retornar ao diretório original
cd "$BASE_DIR" || exit