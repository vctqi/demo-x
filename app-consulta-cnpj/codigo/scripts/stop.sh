#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display a step message
step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

# Function to display a success message
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to display an error message and exit
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Change to the project root directory
cd "$(dirname "$0")/.." || error "Failed to change to project directory"

# Check if PID file exists
if [ -f .pid ]; then
    PID=$(cat .pid)
    step "Stopping application with PID $PID..."
    
    # Check if process is running
    if ps -p $PID > /dev/null; then
        kill $PID
        sleep 2
        
        # Check if process was killed
        if ps -p $PID > /dev/null; then
            step "Process still running. Forcing termination..."
            kill -9 $PID
        fi
        
        success "Application stopped successfully"
    else
        step "Process with PID $PID is not running"
    fi
    
    # Remove PID file
    rm .pid
else
    # Try to find and kill the Node.js process
    step "PID file not found. Attempting to find Node.js process..."
    NODE_PID=$(ps aux | grep "node.*app.js" | grep -v grep | awk '{print $2}')
    
    if [ -n "$NODE_PID" ]; then
        step "Found Node.js process with PID $NODE_PID. Stopping..."
        kill $NODE_PID
        success "Application stopped successfully"
    else
        error "No running application found"
    fi
fi