const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Define the database file path
const dbPath = path.join(__dirname, '../../database/risk_analyzer.db');

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

/**
 * Initialize the database schema and seed data
 * @returns {Promise} Resolves when database is initialized
 */
function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Settings table
      db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          return reject(err);
        }
        
        // Create Cache table
        db.run(`CREATE TABLE IF NOT EXISTS cache (
          id INTEGER PRIMARY KEY,
          cnpj TEXT NOT NULL UNIQUE,
          company_data TEXT NOT NULL,
          risk_score INTEGER NOT NULL,
          risk_level TEXT NOT NULL,
          risk_factors TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL
        )`, (err) => {
          if (err) {
            return reject(err);
          }
          
          // Insert default settings if they don't exist
          const settings = [
            { key: 'score_active', value: '10', description: 'Pontuação para empresa ativa' },
            { key: 'score_over_3_years', value: '10', description: 'Pontuação para empresa com mais de 3 anos' },
            { key: 'score_low_risk_cnae', value: '10', description: 'Pontuação para CNAE de baixo risco' },
            { key: 'score_high_risk_cnae', value: '-10', description: 'Pontuação para CNAE de alto risco' },
            { key: 'score_inactive', value: '-20', description: 'Pontuação para empresa inativa/suspensa' },
            { key: 'score_under_6_months', value: '-10', description: 'Pontuação para empresa aberta há menos de 6 meses' },
            { key: 'threshold_low_risk', value: '20', description: 'Limiar para classificação de baixo risco' },
            { key: 'threshold_medium_risk', value: '0', description: 'Limiar para classificação de médio risco' },
            // Add high risk CNAE codes (examples)
            { key: 'high_risk_cnae', value: '6499999,6612603,6619302,4312600', description: 'Códigos CNAE considerados de alto risco' }
          ];
          
          const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)');
          
          settings.forEach(setting => {
            stmt.run(setting.key, setting.value, setting.description);
          });
          
          stmt.finalize(err => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      });
    });
  });
}

/**
 * Get a setting from the database
 * @param {string} key - The setting key
 * @returns {Promise<string>} The setting value
 */
function getSetting(key) {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
      if (err) {
        return reject(err);
      }
      if (!row) {
        return reject(new Error(`Setting ${key} not found`));
      }
      resolve(row.value);
    });
  });
}

/**
 * Get all settings from the database
 * @returns {Promise<Object>} An object with all settings
 */
function getAllSettings() {
  return new Promise((resolve, reject) => {
    db.all('SELECT key, value FROM settings', (err, rows) => {
      if (err) {
        return reject(err);
      }
      
      const settings = {};
      rows.forEach(row => {
        settings[row.key] = row.value;
      });
      
      resolve(settings);
    });
  });
}

/**
 * Check if a CNPJ is in the cache
 * @param {string} cnpj - The CNPJ to check
 * @returns {Promise<Object|null>} The cached data or null if not found
 */
function getCachedCnpj(cnpj) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM cache WHERE cnpj = ? AND expires_at > datetime("now")',
      [cnpj],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        
        if (!row) {
          return resolve(null);
        }
        
        try {
          const result = {
            company: JSON.parse(row.company_data),
            risk_analysis: {
              score: row.risk_score,
              level: row.risk_level,
              factors: JSON.parse(row.risk_factors)
            }
          };
          resolve(result);
        } catch (e) {
          // If there's an error parsing the JSON, invalidate the cache
          db.run('DELETE FROM cache WHERE cnpj = ?', [cnpj]);
          resolve(null);
        }
      }
    );
  });
}

/**
 * Cache the results of a CNPJ analysis
 * @param {string} cnpj - The CNPJ
 * @param {Object} companyData - The company data
 * @param {number} riskScore - The risk score
 * @param {string} riskLevel - The risk level
 * @param {Array} riskFactors - The risk factors
 * @returns {Promise<void>}
 */
function cacheCnpjResult(cnpj, companyData, riskScore, riskLevel, riskFactors) {
  return new Promise((resolve, reject) => {
    // Cache expires after 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    db.run(
      `INSERT OR REPLACE INTO cache 
      (cnpj, company_data, risk_score, risk_level, risk_factors, expires_at) 
      VALUES (?, ?, ?, ?, ?, datetime(?))`,
      [
        cnpj,
        JSON.stringify(companyData),
        riskScore,
        riskLevel,
        JSON.stringify(riskFactors),
        expiresAt.toISOString()
      ],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

module.exports = {
  db,
  initDb,
  getSetting,
  getAllSettings,
  getCachedCnpj,
  cacheCnpjResult
};