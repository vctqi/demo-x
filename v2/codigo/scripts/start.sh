#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

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

# Check if Node.js is installed
step "Checking if Node.js is installed..."
if ! command_exists node; then
    step "Node.js not found. Installing Node.js..."
    if command_exists apt; then
        sudo apt update
        sudo apt install -y nodejs npm
    else
        error "Package manager not found. Please install Node.js manually."
    fi
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
REQUIRED_VERSION="14.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    step "Node.js version $NODE_VERSION is too old. Updating Node.js..."
    if command_exists npm; then
        # Install nvm
        if [ ! -d "$HOME/.nvm" ]; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        else
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        
        # Install Node.js 18
        nvm install 18
        nvm use 18
    else
        error "npm not found. Please update Node.js manually."
    fi
fi

# Check if SQLite3 is installed
step "Checking if SQLite3 is installed..."
if ! command_exists sqlite3; then
    step "SQLite3 not found. Installing SQLite3..."
    if command_exists apt; then
        sudo apt update
        sudo apt install -y sqlite3
    else
        error "Package manager not found. Please install SQLite3 manually."
    fi
fi

# Install backend dependencies
step "Installing backend dependencies..."
cd ../codigo/backend || error "Backend directory not found"
npm install || error "Failed to install backend dependencies"
success "Backend dependencies installed successfully"

# Install frontend dependencies
step "Installing frontend dependencies..."
cd ../frontend || error "Frontend directory not found"
npm install || error "Failed to install frontend dependencies"
success "Frontend dependencies installed successfully"

# Build frontend
step "Building frontend..."
npm run build || error "Failed to build frontend"
success "Frontend built successfully"

# Start the backend server
step "Starting the application..."
cd ../backend || error "Failed to navigate to backend directory"
NODE_ENV=production npm start &
PID=$!
echo $PID > ../../.pid
success "Application started successfully"
echo -e "Access the application at ${GREEN}http://localhost:3000${NC}"
echo -e "To stop the application, run: ${YELLOW}./scripts/stop.sh${NC}"