// Populate the users table

const User = require('../../dataObjects/userObject');

// Creating user objects using the User data model
const user1 = new User('Opeyemi', 'Ogunbode', 'opeyemi1', 'ope@gmail.com', '09011164280', 'opeyemi', 12345678, 1200000);
const user2 = new User('Opeyemi', 'Ogunbode', 'opeyemi2', 'opeyemi@gmail.com', '09011164281', 'opeyemi', 12345679, 1300000);
const user3 = new User('Opeyemi', 'Ogunbode', 'opeyemi3', 'opebode@gmail.com', '09011164282', 'opeyemi', 12345670, 1400000);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function populate(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([user1, user2, user3]);
};
