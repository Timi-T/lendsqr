// Database migrations

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function create(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('userId').notNullable().primary();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('username').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable().unique();
    table.string('password').notNullable();
    table.string('walletId').unique();
    table.bigInteger('balance').defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  })
    .createTable('bank_wallet_transactions', (table) => {
      table.string('transactionId').primary();
      table.string('type').notNullable();
      table.string('method').notNullable();
      table.string('serviceProvider').notNullable();
      table.bigInteger('amount').notNullable();
      table.string('description');
      table.string('referenceNumber').notNullable();
      table.string('status').notNullable();
      table.bigInteger('balanceBefore').notNullable();
      table.bigInteger('balanceAfter').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.string('userId')
        .references('userId')
        .inTable('users')
        .onDelete('CASCADE');
    })
    .createTable('transfers', (table) => {
      table.string('transferId').primary();
      table.bigInteger('amount').notNullable();
      table.string('sourceUsername').notNullable();
      table.string('destUsername').notNullable();
      table.string('description');
      table.string('referenceNumber');
      table.bigInteger('balanceBefore').notNullable();
      table.bigInteger('balanceAfter').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function drop(knex) {
  return knex.schema
    .dropTableIfExists('bank_wallet_transactions')
    .dropTableIfExists('transfers')
    .dropTableIfExists('users');
};
