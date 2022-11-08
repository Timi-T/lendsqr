// Populate transfers table

const Transfer = require('../../dataObjects/TransferObject');

// Creating user objects using the Transfer data model
const c1 = new Transfer(1, 'Opeyemi1', 15000, 'chop life crew!', 'ref-1234', 10000, 25000, 'credit');
const c2 = new Transfer(2, 'Opeyemi2', 5000, 'jaiye times 2!', 'ref-1235', 2000, 7000, 'credit');
const c3 = new Transfer(3, 'Opeyemi3', 1000, 'after round 1!', 'ref-1236', 18000, 17000, 'debit');

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function populate(knex) {
  // Deletes ALL existing entries
  await knex('transfers').del();
  await knex('transfers').insert([c1, c2, c3]);
};
