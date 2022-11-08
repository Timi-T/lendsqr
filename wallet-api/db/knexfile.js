// Database configuration

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.WALLET_DB_HOST || '127.0.0.1',
      port: process.env.WALLET_DB_PORT || 3306,
      user: process.env.WALLET_DB_USER || 'DEV_USER',
      password: process.env.WALLET_DB_PWD || 'DEV_PWD',
      database: process.env.WALLET_DB_NAME || 'lendsqr',
    },
    migrations: {
      path: './db/migrations',
    },
    seeds: {
      path: './db/seeds',
    },
  },
};
