/* eslint class-methods-use-this: "off" */

// Database operations

const knex = require('knex');
const { attachPaginate } = require('knex-paginate');

const config = require('./knexfile');

// Creating a connection to the database using knex
const db = knex(config.development);
attachPaginate();

// Class to handle all database operation
class DbClient {
  // Method to get objects from the database
  async get(table, filters = null, page = 1, perPage = 10) {
    if (filters) {
      // Return a filtered result
      const data = await db.select('*')
        .from(table)
        .where(filters)
        .paginate({ perPage, currentPage: page });
      return data;
    }
    // Return all data from the provided table
    const data = await db.select('*')
      .from(table)
      .where({})
      .paginate({ perPage, currentPage: page });
    return data;
  }

  // Method to create a new entry
  async post(table, data) {
    const res = await db(table).insert(data);
    return res;
  }

  // Method to update an entry
  async put(table, filters, data) {
    const obj = db(table).where(filters).update(data);
    return obj;
  }

  // Method to delete an entry
  async del(table, filters) {
    const obj = db(table).where(filters);
    return obj;
  }
}

// Exporting instance of class dbClient
module.exports = new DbClient();
