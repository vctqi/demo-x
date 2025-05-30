const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { setupLogger } = require('../utils/logger');

// Initialize logger
const logger = setupLogger();

// Database connection
let db = null;

/**
 * Initialize the SQLite database and create tables if they don't exist
 */
exports.initDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
    
    logger.info(`Initializing database at ${dbPath}`);
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Error connecting to the database', err);
        return reject(err);
      }
      
      logger.info('Connected to the SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          logger.error('Error enabling foreign keys', err);
          return reject(err);
        }
        
        // Create tables
        createTables()
          .then(resolve)
          .catch(reject);
      });
    });
  });
};

/**
 * Create database tables if they don't exist
 */
function createTables() {
  return new Promise((resolve, reject) => {
    // Table for storing CNPJ queries
    const createConsultasTable = `
      CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cnpj TEXT NOT NULL,
        data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        razao_social TEXT,
        nome_fantasia TEXT,
        data_abertura DATE,
        cnae_principal TEXT,
        situacao TEXT,
        porte TEXT,
        localizacao TEXT,
        dados_brutos TEXT -- JSON string of the raw API response
      )
    `;
    
    // Table for storing risk analysis results
    const createResultadosRiscoTable = `
      CREATE TABLE IF NOT EXISTS resultados_risco (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consulta_id INTEGER,
        score INTEGER NOT NULL,
        classificacao TEXT NOT NULL, -- 'Baixo', 'Médio', 'Alto'
        criterios_positivos TEXT, -- JSON string of positive criteria
        criterios_negativos TEXT, -- JSON string of negative criteria
        alertas TEXT, -- JSON string of alerts
        FOREIGN KEY (consulta_id) REFERENCES consultas(id)
      )
    `;
    
    // Execute table creation
    db.serialize(() => {
      db.run(createConsultasTable, (err) => {
        if (err) {
          logger.error('Error creating consultas table', err);
          return reject(err);
        }
        
        logger.info('Consultas table created or already exists');
        
        db.run(createResultadosRiscoTable, (err) => {
          if (err) {
            logger.error('Error creating resultados_risco table', err);
            return reject(err);
          }
          
          logger.info('Resultados_risco table created or already exists');
          resolve();
        });
      });
    });
  });
}

/**
 * Get database connection instance
 */
exports.getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

/**
 * Close database connection
 */
exports.closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          logger.error('Error closing database connection', err);
          return reject(err);
        }
        logger.info('Database connection closed');
        db = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
};