export default {
  development: {
    use_env_variable: 'DIFFER_DB_URL',
    host: process.env.DIFFER_DB_HOST || process.argv[3] || '127.0.0.1',
    port: process.env.DIFFER_DB_PORT || process.argv[4] || '5432',
    username: process.env.DIFFER_DB_USER || process.argv[6] || 'differ',
    password: process.env.DIFFER_DB_PASSWORD || process.argv[7] || null,
    database: process.env.DIFFER_DB || process.argv[5] || 'differ_dev',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DIFFER_DB_URL',
    host: process.env.DIFFER_DB_HOST,
    port: process.env.DIFFER_DB_PORT,
    username: process.env.DIFFER_DB_USER,
    password: process.env.DIFFER_DB_PASSWORD,
    database: process.env.DIFFER_DB || 'differ_prod',
    dialect: 'postgres',
    logging: false
  }
};
