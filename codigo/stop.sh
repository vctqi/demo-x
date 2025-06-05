#!/bin/bash

# Script para parar o Analisador de Risco de Cliente PJ via CNPJ

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_PID_FILE="$SCRIPT_DIR/.backend.pid"
FRONTEND_PID_FILE="$SCRIPT_DIR/.frontend.pid"

# Função para exibir mensagens
log() {
    local level=$1
    local message=$2
    local color=$NC
    
    case $level in
        "INFO")
            color=$BLUE
            ;;
        "SUCCESS")
            color=$GREEN
            ;;
        "WARNING")
            color=$YELLOW
            ;;
        "ERROR")
            color=$RED
            ;;
    esac
    
    echo -e "${color}[$level] $message${NC}"
}

# Função para parar um processo
stop_process() {
    local pid_file=$1
    local process_name=$2
    
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        
        if ps -p $PID > /dev/null; then
            log "INFO" "Parando $process_name (PID: $PID)..."
            kill $PID
            
            # Aguardar até 5 segundos pelo processo terminar
            for i in {1..10}; do
                if ! ps -p $PID > /dev/null; then
                    break
                fi
                sleep 0.5
            done
            
            # Verificar se o processo ainda está em execução
            if ps -p $PID > /dev/null; then
                log "WARNING" "$process_name ainda está em execução. Forçando encerramento..."
                kill -9 $PID
                sleep 1
            fi
            
            # Verificar novamente
            if ! ps -p $PID > /dev/null; then
                log "SUCCESS" "$process_name parado com sucesso"
                rm "$pid_file"
            else
                log "ERROR" "Falha ao parar $process_name"
                return 1
            fi
        else
            log "WARNING" "$process_name não está em execução (PID: $PID)"
            rm "$pid_file"
        fi
    else
        log "INFO" "Arquivo PID para $process_name não encontrado"
        
        # Tentar encontrar processos pelo nome
        if [[ "$process_name" == *"backend"* ]]; then
            PIDS=$(pgrep -f "node.*index.js")
        elif [[ "$process_name" == *"frontend"* ]]; then
            PIDS=$(pgrep -f "react-scripts start")
        fi
        
        if [ -n "$PIDS" ]; then
            log "INFO" "Encontrados processos $process_name: $PIDS"
            
            for pid in $PIDS; do
                log "INFO" "Parando processo $process_name (PID: $pid)..."
                kill $pid
                sleep 1
                
                if ps -p $pid > /dev/null; then
                    log "WARNING" "Processo ainda em execução. Forçando encerramento..."
                    kill -9 $pid
                    sleep 1
                fi
                
                if ! ps -p $pid > /dev/null; then
                    log "SUCCESS" "Processo $process_name (PID: $pid) parado com sucesso"
                else
                    log "ERROR" "Falha ao parar processo $process_name (PID: $pid)"
                fi
            done
        else
            log "INFO" "Nenhum processo $process_name encontrado em execução"
        fi
    fi
    
    return 0
}

# Função principal
main() {
    log "INFO" "Parando o Analisador de Risco de Cliente PJ via CNPJ..."
    
    # Parar frontend
    stop_process "$FRONTEND_PID_FILE" "frontend"
    FRONTEND_STOPPED=$?
    
    # Parar backend
    stop_process "$BACKEND_PID_FILE" "backend"
    BACKEND_STOPPED=$?
    
    # Verificar portas 3000 e 3001
    FRONTEND_PORT_BUSY=$(lsof -i:3000 -t || echo "")
    BACKEND_PORT_BUSY=$(lsof -i:3001 -t || echo "")
    
    if [ -n "$FRONTEND_PORT_BUSY" ]; then
        log "WARNING" "Porta 3000 ainda está sendo usada pelos processos: $FRONTEND_PORT_BUSY"
        log "INFO" "Tentando encerrar processos..."
        
        for pid in $FRONTEND_PORT_BUSY; do
            kill -9 $pid 2>/dev/null
        done
    fi
    
    if [ -n "$BACKEND_PORT_BUSY" ]; then
        log "WARNING" "Porta 3001 ainda está sendo usada pelos processos: $BACKEND_PORT_BUSY"
        log "INFO" "Tentando encerrar processos..."
        
        for pid in $BACKEND_PORT_BUSY; do
            kill -9 $pid 2>/dev/null
        done
    fi
    
    # Verificar node processos zombie (sem parent)
    NODE_ZOMBIES=$(ps -ef | grep -v grep | grep -E "node.*react-scripts|node.*index.js" | awk '$3==1 {print $2}')
    
    if [ -n "$NODE_ZOMBIES" ]; then
        log "WARNING" "Encontrados processos node órfãos: $NODE_ZOMBIES"
        log "INFO" "Tentando encerrar processos órfãos..."
        
        for pid in $NODE_ZOMBIES; do
            kill -9 $pid 2>/dev/null
        done
    fi
    
    log "SUCCESS" "Analisador de Risco de Cliente PJ via CNPJ foi encerrado com sucesso!"
}

# Executar função principal
main