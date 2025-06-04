const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
const fs = require('fs');

// Garantir que o diretório de logs exista
const logDir = path.join(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para logs
const logFormat = format.printf(({ level, message, timestamp, context }) => {
  return `${timestamp} [${level.toUpperCase()}] [${context || 'App'}] - ${message}`;
});

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ 
      filename: path.join(logDir, 'application.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 7,
    })
  ]
});

// Exportar o logger
module.exports = logger;