// Populate bank_wallet_transactions table

const BankWalletTransaction = require('../../dataObjects/bankWalletTransactionObject');

// Creating user objects using the BankWalletTransaction data model
const d1 = new BankWalletTransaction(1, 'Card', 'withdrawal', 'Paystack', 10000, 'spending', 'refno-1234', 10000, 0, 'success');
const d2 = new BankWalletTransaction(2, 'Card', 'deposit', 'Flutterwave', 15000, 'funding2', 'refno-1235', 0, 15000, 'success');
const d3 = new BankWalletTransaction(3, 'Paypal', 'deposit', 'Paypal', 20000, 'funding3', 'refno-1236', 0, 20000, 'success');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function populate(knex) {
  // Deletes ALL existing entries
  await knex('bank_wallet_transactions').del();
  await knex('bank_wallet_transactions').insert([d1, d2, d3]);
};
