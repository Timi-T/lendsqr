// Database configuration
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
    migrations: {
      path: './db/migrations',
    },
    seeds: {
      path: './db/seeds',
    },
  },
};
