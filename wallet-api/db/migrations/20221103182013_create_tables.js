// Database migrations

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function create(knex) {
  return knex.schema.createTable('lend_users', (table) => {
    table.string('user_id').notNullable().primary();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('username').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable().unique();
    table.string('password').notNullable();
    table.string('wallet_id').unique();
    table.bigInteger('balance').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
    .createTable('bank_wallet_transactions', (table) => {
      table.string('transaction_id').primary();
      table.string('type').notNullable();
      table.string('method').notNullable();
      table.string('service_provider').notNullable();
      table.bigInteger('amount').notNullable();
      table.string('description');
      table.string('reference_number').notNullable();
      table.string('status').notNullable();
      table.bigInteger('balance_before').notNullable();
      table.bigInteger('balance_after').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('transaction_user_id')
        .references('user_id')
        .inTable('lend_users')
        .onDelete('CASCADE');
    })
    .createTable('transfers', (table) => {
      table.string('transfer_id').primary();
      table.bigInteger('amount').notNullable();
      table.string('source_username').notNullable();
      table.string('destination_username').notNullable();
      table.string('description');
      table.string('reference_number');
      table.bigInteger('balance_before').notNullable();
      table.bigInteger('balance_after').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('source_user_id')
        .references('user_id')
        .inTable('lend_users')
        .onDelete('CASCADE');
      table.string('destination_user_id')
        .references('user_id')
        .inTable('lend_users')
        .onDelete('CASCADE');
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
    .dropTableIfExists('lend_users');
};
