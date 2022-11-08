/* eslint import/no-extraneous-dependencies: "off" */

// Data model for a Bank Wallet transactions

const uuid = require('uuid');

// Class to implement a Bank wallet object
class BankWalletTransaction {
  constructor(
    userId,
    method,
    type,
    serviceProvider,
    amount,
    description,
    refNumber,
    balanceBefore,
    balanceAfter,
    status,
  ) {
    this.transactionId = uuid.v4();
    this.type = type;
    this.userId = userId;
    this.method = method;
    this.serviceProvider = serviceProvider;
    this.amount = amount;
    this.description = description;
    this.referenceNumber = refNumber;
    this.balanceBefore = balanceBefore;
    this.balanceAfter = balanceAfter;
    this.status = status;
  }
}

module.exports = BankWalletTransaction;
