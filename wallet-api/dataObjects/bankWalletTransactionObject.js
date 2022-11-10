/* eslint import/no-extraneous-dependencies: "off" */

// Data model for a Bank Wallet transactions

const uuid = require('uuid');

// Class to implement a Bank wallet object
class BankWalletTransaction {
  constructor(
    transactionUserId,
    method,
    type,
    serviceProvider,
    amount,
    description,
    referenceNumber,
    balanceBefore,
    balanceAfter,
    status,
  ) {
    this.transaction_id = uuid.v4();
    this.type = type;
    this.transaction_user_id = transactionUserId;
    this.method = method;
    this.service_provider = serviceProvider;
    this.amount = amount;
    this.description = description;
    this.reference_number = referenceNumber;
    this.balance_before = balanceBefore;
    this.balance_after = balanceAfter;
    this.status = status;
  }
}

module.exports = BankWalletTransaction;
