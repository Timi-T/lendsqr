// Populate transfers table

const Transfer = require('../../dataObjects/TransferObject');

// Creating user objects using the Transfer data model
const c1 = new Transfer('Opeyemi1', 'Opeyemi2', '1', '2', 15000, 'chop life crew!', 'ref-1234', 10000, 25000);
const c2 = new Transfer('Opeyemi2', 'Opeyemi1', '2', '1', 5000, 'jaiye times 2!', 'ref-1235', 2000, 7000);
const c3 = new Transfer('Opeyemi3', 'Opeyemi2', '3', '2', 1000, 'after round 1!', 'ref-1236', 18000, 17000);

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function populate(knex) {
  // Deletes ALL existing entries
  await knex('transfers').del();
  await knex('transfers').insert([c1, c2, c3]);
};
