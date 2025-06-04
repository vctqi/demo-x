const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    path: process.env.DB_PATH || './database.sqlite',
  },
  api: {
    cnpj: {
      baseUrl: 'https://publica.cnpj.ws/cnpj',
      timeout: 10000, // 10 segundos
      retryAttempts: 3,
    },
  },
  cache: {
    ttl: 24 * 60 * 60, // 24 horas em segundos
  },
  riskScoring: {
    thresholds: {
      lowRisk: 20,
      mediumRisk: 0,
    },
    criteria: {
      activeStatus: 10,
      inactiveStatus: -20,
      moreThan3Years: 10,
      lessThan6Months: -10,
      between6MonthsAnd1Year: -5,
      lowRiskCnae: 10,
      mediumRiskCnae: 0,
      highRiskCnae: -10,
    },
  },
};

module.exports = config;