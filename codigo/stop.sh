#!/bin/bash

# Script para parar a aplicação Analisador de Risco de Cliente PJ via CNPJ

# Definir diretório base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$BASE_DIR/../logs"

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_DIR/stop_script.log"
}

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"
touch "$LOG_DIR/stop_script.log"

log "Iniciando script de encerramento da aplicação"

# Parar backend
if [ -f "$LOG_DIR/backend.pid" ]; then
  BACKEND_PID=$(cat "$LOG_DIR/backend.pid")
  log "Encerrando servidor backend (PID: $BACKEND_PID)..."
  
  if kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill -15 "$BACKEND_PID"
    sleep 2
    
    # Verificar se o processo ainda está em execução
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
      log "Processo não encerrou normalmente. Forçando encerramento..."
      kill -9 "$BACKEND_PID" 2>/dev/null
    fi
    
    log "Servidor backend encerrado com sucesso"
  else
    log "Processo do backend não está em execução"
  fi
  
  rm -f "$LOG_DIR/backend.pid"
else
  log "Arquivo PID do backend não encontrado"
fi

# Parar frontend
if [ -f "$LOG_DIR/frontend.pid" ]; then
  FRONTEND_PID=$(cat "$LOG_DIR/frontend.pid")
  log "Encerrando servidor frontend (PID: $FRONTEND_PID)..."
  
  if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill -15 "$FRONTEND_PID"
    sleep 2
    
    # Verificar se o processo ainda está em execução
    if kill -0 "$FRONTEND_PID" 2>/dev/null; then
      log "Processo não encerrou normalmente. Forçando encerramento..."
      kill -9 "$FRONTEND_PID" 2>/dev/null
    fi
    
    log "Servidor frontend encerrado com sucesso"
  else
    log "Processo do frontend não está em execução"
  fi
  
  rm -f "$LOG_DIR/frontend.pid"
else
  log "Arquivo PID do frontend não encontrado"
fi

# Verificar processos node que possam estar relacionados à aplicação
NODE_PROCESSES=$(ps aux | grep -v grep | grep -E "node.*backend|node.*frontend" | awk '{print $2}')
if [ -n "$NODE_PROCESSES" ]; then
  log "Encontrados processos node adicionais. Encerrando..."
  
  for pid in $NODE_PROCESSES; do
    log "Encerrando processo node adicional (PID: $pid)..."
    kill -15 "$pid" 2>/dev/null
    sleep 1
    
    # Verificar se o processo ainda está em execução
    if kill -0 "$pid" 2>/dev/null; then
      log "Processo não encerrou normalmente. Forçando encerramento..."
      kill -9 "$pid" 2>/dev/null
    fi
  done
  
  log "Processos node adicionais encerrados"
fi

log "Aplicação encerrada com sucesso"