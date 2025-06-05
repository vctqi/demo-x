const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Garantir que o diretório de logs exista
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Configuração do formato dos logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] - ${message}`;
    })
);

// Criar o logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        // Logs de console
        new winston.transports.Console(),
        
        // Logs em arquivo
        new winston.transports.File({ 
            filename: path.join(logDir, 'application.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        
        // Logs de erro separados
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

module.exports = logger;